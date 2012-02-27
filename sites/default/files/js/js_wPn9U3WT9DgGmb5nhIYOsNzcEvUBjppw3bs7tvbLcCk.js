/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true debug: true Drupal: true window: true */


var ThemeBuilder = ThemeBuilder || {};

/**
 * The Bar class is the interface through which the themebuilder is added to
 * the page.  It exposes application level functionality, such as save,
 * publish, export.  It also provides APIs for the rest of the application to
 * interact with the themebuilder user interface.
 *
 * @class
 *
 * This class implements the singleton design pattern.
 */
ThemeBuilder.Bar = ThemeBuilder.initClass();

/**
 * This static method is the only way an instance of the Bar class should be
 * retrieved.  It ensures only one instance of the Bar class exists.
 *
 * @static
 *
 * @param {boolean} createIfNeeded
 *   (Optional) Indicates whether the instance should be created if it doesn't
 *   already exist.  Defaults to true.
 *
 * @return {ThemeBuilder.Bar}
 *   The instance of the ThemeBuilder.Bar class.  If no instance currently
 *   exists, one will be created as a result of calling this method.
 */
ThemeBuilder.Bar.getInstance = function (createIfNeeded) {
  createIfNeeded = createIfNeeded === undefined ? true : createIfNeeded;
  if (!ThemeBuilder.Bar._instance && createIfNeeded) {
    ThemeBuilder.Bar._instance = new ThemeBuilder.Bar();
  }
  return (ThemeBuilder.Bar._instance);
};

/**
 * The constructor of the Bar class.
 */
ThemeBuilder.Bar.prototype.initialize = function () {
  if (ThemeBuilder.Bar._instance) {
    throw "ThemeBuilder.Bar is a singleton that has already been instantiated.";
  }
  this.changed = false;
  this._dialogs = {};
  this.saving = false;
  this.links = {};
  this.showing = false;
  this.loader = null;
  if (ThemeBuilder.undoButtons) {
    ThemeBuilder.undoButtons.addStatusChangedListener(this);
  }
  this._attachEventHandlers();
  this._tabLoadRequests = [];
  this.listeners = [];
};

/**
 * Attaches event handlers to the buttons.  This must be called or the buttons
 * won't do anything.
 *
 * @private
 */
ThemeBuilder.Bar.prototype._attachEventHandlers = function () {
  var $ = jQuery;
  // Before attaching event handlers, make sure the elements exist.
  var selectors = ['#themebuilder-wrapper .export',
    '#themebuilder-wrapper .save',
    '#themebuilder-wrapper .save-as',
    '#themebuilder-wrapper .publish',
    '#themebuilder-mini-button',
    '#themebuilder-exit-button'];
  for (var index = 0; index < selectors.length; index++) {
    var selector = selectors[index];
    if (selector.indexOf('#themebuilder') === 0) {
      if ($(selector).length === 0) {
        // The element does not exist on the page yet.  Wait for the element
        // to appear before adding event listeners.
        setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this._attachEventHandlers), 150);
        return;
      }
    }
  }
  // The elements exist.  Attach the event handlers.
  $('#themebuilder-wrapper').click(ThemeBuilder.bind(this, this.quarantineEvents));
  $('#themebuilder-wrapper .export').click(ThemeBuilder.bind(this, this.exportTheme));
  $('#themebuilder-wrapper .save').click(ThemeBuilder.bind(this, this.save));
  $('#themebuilder-wrapper .save-as').click(ThemeBuilder.bind(this, this.saveas));
  $('#themebuilder-wrapper .publish').click(ThemeBuilder.bind(this, this.publish));
  $('#themebuilder-mini-button').click(ThemeBuilder.bind(this, this.toggleMinimize));
  $('#themebuilder-exit-button').click(ThemeBuilder.bindIgnoreCallerArgs(this, this.exit, true));
  $('#themebuilder-main').bind('save', ThemeBuilder.bind(this, this._saveCallback));
  $('#themebuilder-main').bind('modified', ThemeBuilder.bind(this, this.indicateThemeModified));
};

/**
 * Keypress event handler, to correctly handle the Enter key in save dialogs.
 *
 * @private
 *
 * @param {event} event
 *   The keypress event.
 * @param {string} dialogName
 *   The name of the save dialog.
 */
ThemeBuilder.Bar.prototype._handleKeyPress = function (event, dialogName) {
  if ((event.which && event.which === 13) || (event.keyCode && event.keyCode === 13)) {
    // This only works because the OK button appears first in the markup.
    this.getDialog(dialogName).siblings('.ui-dialog-buttonpane').find('button:first').click();
    return ThemeBuilder.util.stopEvent(event);
  }
};

/**
 * Displays an indicator over the current page to indicate the themebuilder is
 * busy.
 */
ThemeBuilder.Bar.prototype.showWaitIndicator = function () {
  var $ = jQuery;
  // Show the throbber to indicate it's loading.
  $('<div class="themebuilder-loader"></div>').
    appendTo($('body'));
};

/**
 * Removes the busy indicator.
 */
ThemeBuilder.Bar.prototype.hideWaitIndicator = function () {
  var $ = jQuery;
  $('.themebuilder-loader').remove();
};

/**
 * Called when the user clicks the button to enter the themebuilder.  This
 * method causes the themebuilder to open.
 */
ThemeBuilder.Bar.prototype.openThemebuilder = function () {
  if (this.showing && !this.forceReload) {
    return;
  }
  // Don't open Themebuilder if the overlay is open.
  if (Drupal.overlay && (Drupal.overlay.isOpen || Drupal.overlay.isOpening)) {
    Drupal.overlay.close();
  }
  var ic = new ThemeBuilder.StartInteraction();
  ic.start();
};
/**
 * Reloads the page.
 */
ThemeBuilder.Bar.prototype.reloadPage = function (data) {
  var $ = jQuery;

  // If there was an error, then stop.
  if (data && data.error) {
    alert(data.error);
    this.hideWaitIndicator();
    return;
  }

  // Reload, which is required even if there are no changes to the
  // theme to make sure the gears work after the themebuilder is
  // closed.
  parent.location.reload(true);
};

/**
 * Displays the themebuilder user interface and performs any necessary
 * initialization.
 */
ThemeBuilder.Bar.prototype.show = function () {
  if (this.showing) {
    return;
  }
  var $ = jQuery;
  this.showing = true;
  this.trackWindowSize();

  // Disable the undo and redo buttons until the themebuilder is fully started.
  var statusKey;
  if (ThemeBuilder.undoButtons) {
    statusKey = ThemeBuilder.undoButtons.disable();
  }

  $('#themebuilder-wrapper').show();
  $('body').addClass('themebuilder');
  $('#themebuilder-main').tabs(
    {select: ThemeBuilder.bind(this, this.tabSelected)}
  );
  this._initializeCurrentTab();

  if (!Drupal.settings.themebuilderSaved) {
    $('#themebuilder-save .save').attr('disabled', true);
  }
  var state = this.getSavedState();
  $('#themebuilder-main').tabs('select', '#' + state.tabId);
  this.getTabObject(state.tabId).show();

  this._createVeil();

  // Allow the undo and redo buttons to be used now that the themebuilder is
  // ready.
  if (statusKey) {
    ThemeBuilder.undoButtons.clear(statusKey);
  }
  statusKey = undefined;

  $('#themebuilder-theme-name .theme-name').truncate({addtitle: true});
  this.showInitialAlert();
};

/**
 * Called when the application init data is available.
 *
 * @param {Object} data
 *   The Application init data.
 */
ThemeBuilder.Bar.initializeUserInterface = function (data) {
  var $ = jQuery;
  ThemeBuilder.Bar.showInitialMessage(data);
  var bar = ThemeBuilder.Bar.getInstance();
  bar.setChanged(Drupal.settings.themebuilderIsModified);
  bar.refreshThemeUpdate();
  $('#themebuilder-theme-update .update-available')
    .click(ThemeBuilder.bind(bar, bar.updateTheme));
};

/**
 * Sets up the update theme indicator according to whether an update is
 * available or not.
 */
ThemeBuilder.Bar.prototype.refreshThemeUpdate = function () {
  var data = ThemeBuilder.getApplicationInstance().getData();
  var $ = jQuery;
  if (data.theme_update_available) {
    $('#themebuilder-theme-update')
      .removeClass('disabled');
  }
  else {
    $('#themebuilder-theme-update')
      .addClass('disabled');
  }
};

/**
 * Causes window resizes to be detected, and resizes the themebuilder panel
 * accordingly.
 */
ThemeBuilder.Bar.prototype.trackWindowSize = function () {
  var $ = jQuery;
  $(window).resize(ThemeBuilder.bind(this, this.windowSizeChanged));
  this.windowSizeChanged();
};

/**
 * When the window size changes, reset the max-width property of the
 * themebuilder.  Certain properties applied to the body tag will have an
 * effect on the layout of the themebuilder.  These include padding and
 * margin.  Because they change the size of the actual window, this type of
 * CSS "leakage" could not be fixed by the css insulator or iframe alone.
 *
 * @param {Event} event
 *   The window resize event.
 */
ThemeBuilder.Bar.prototype.windowSizeChanged = function (event) {
  var $ = jQuery;
  var win = window;
  if (event && event.currentTarget) {
    win = event.currentTarget;
  }
  $('#themebuilder-wrapper').css('max-width', $(win).width());
};

/**
 * Returns tab info for the specified tab.  The tab can be specified by id
 * (ex: themebuilder-layout) or name (ex: layout).  If the tabName is not
 * provided, the info for the currently selected theme will be used.
 *
 * @param tabName
 *   The name of the tab to provide info for.  If not provided, the current
 *   tab will be used.
 *
 * @return {Array}
 *   An array of information about the specified tab.  This includes the name,
 *   title, weight, link, and id.
 */
ThemeBuilder.Bar.prototype.getTabInfo = function (tabName) {
  var tabId, name, state;
  if (!tabName) {
    state = this.getSavedState();
    tabId = state.tabId;
    name = tabId.replace(/^themebuilder-/, '');
  }
  else {
    name = tabName.replace(/^[#]?themebuilder-/, '');
    tabId = 'themebuilder-' + name;
  }
  
  var tabInfo = ThemeBuilder.clone(Drupal.settings.toolbarItems[name]);
  tabInfo.id = tabId;
  return tabInfo;
};

/**
 * Returns the object that manages the tab with the specified id.
 *
 * The tab manager has the following methods:
 *   show - called when the tab is selected by the user.
 *   hide - called when the user traverses away from the tab.
 *
 * @param {String} id
 *   The id associated with the tab.
 *
 * @return {Object}
 *   The object that manages the tab associated with the id.  An exception is
 *   thrown if the id is unknown.
 */
ThemeBuilder.Bar.prototype.getTabObject = function (id) {
  switch (id) {
  case 'themebuilder-brand':
    return ThemeBuilder.brandEditor;
  case 'themebuilder-advanced':
    return ThemeBuilder.AdvancedTab.getInstance();
  case 'themebuilder-layout':
    return ThemeBuilder.LayoutEditor.getInstance();
  case 'themebuilder-style':
    return ThemeBuilder.styleEditor;
  case 'themebuilder-themes':
    return ThemeBuilder.themeSelector;
  default:
    throw Drupal.t('ThemeBuilder.Bar.getTabObject: unknown tab %id', {'%id': id});
  }
};

/**
 * Called when a major tab in the themebuilder is selected.  This method is
 * responsible for sending messages to the currently open tab and the tab
 * being opened so the tabs can do necessary cleanup before the UI is updated.
 *
 * @param {Event} event
 *   The tabselect event.
 * @param {Object} ui
 *   The jQuery object associated with changing tabs.  This object holds
 *   information about the tab being selected.
 *
 * @return {boolean}
 *   True if the tab selection should be honored; false if the tab selection
 *   should be aborted.
 */
ThemeBuilder.Bar.prototype.tabSelected = function (event, ui) {
  var currentTabInfo = this.getTabInfo();
  var newTabInfo = this.getTabInfo(ui.tab.hash);

  if (currentTabInfo.id !== newTabInfo.id) {
    // Only hide the current tab if we selected a different tab.
    var current = this.getTabObject(currentTabInfo.id);
    if (current.hide() === false) {
      return false;
    }
  }
  this._initializeTab(newTabInfo.name);
  var panel = this.getTabObject(newTabInfo.id);
  if (panel.show() === false) {
    return false;
  }
  for (var i = 0; i < this.listeners.length; i++) {
    if (this.listeners[i].selectorChanged) {
      this.listeners[i].handleTabSwitch(panel);
    }
  }
  
  return true;
};

/**
 * Saves the current state of the UI.
 * 
 * The state include the current tab id, and can contain other
 * information as needed.  This method determines whether it is
 * necessary to save the state to avoid sending unnecessary requests
 * to the server.
 *
 * @param {String} tabId
 *   The element id of the currently selected tab.
 * @param {Object} otherInfo
 *   Any other information that should be saved with the state.
 * @param {Function} successCallback
 *   The callback that should be invoked upon success.
 * @param {Function} failureCallback
 *   The callback that should be invoken upon failure.
 */
ThemeBuilder.Bar.prototype.saveState = function (tabId, otherInfo, successCallback, failureCallback) {
  var originalState = this.getSavedState();
  // Avoid superfluous requests to the server.
  if (originalState && originalState.tabId === tabId &&
      !otherInfo &&
      !successCallback) {
    return;
  }

  // Send the request.
  var state = {
    tabId: tabId,
    info: otherInfo
  };
  ThemeBuilder.postBack('themebuilder-save-state', {state: JSON.stringify(state)}, successCallback, failureCallback);
  Drupal.settings.toolbarState = state;
};

/**
 * Returns the currently saved state.
 * 
 * The saved state can be in one of two forms - the older form is a
 * simple string containing the tab id, the newer form is an object
 * that contains the tab id as a field.  This method reads both and
 * returns the newer object form.  This will ease the update
 * transition.
 * 
 * @return {Object}
 *   An object containing the saved state, including a field name
 *   'tabId' that contains the id of the active tab.
 */
ThemeBuilder.Bar.prototype.getSavedState = function () {
  var state;
  state = Drupal.settings.toolbarState;
  if (!state) {
    throw new Error('Drupal.settings.toolbarState is not set.');
  }
  if (!state.tabId) {
    try {
      state = jQuery.parseJSON(Drupal.settings.toolbarState);
    } catch (e) {
      if (typeof(state) === 'string') {
	// The state is a string, not an object.  Originally the state
	// was a string that only contained the id of the tab element.
	// Create a new structure with that info.
        state = {
          tabId: state,
          info: {}
        };
      }
    }
    // Only parse this info once.
    Drupal.settings.toolbarState = state;
  }

  if (state.tabId[0] === '#') {
    state.tabId = state.tabId.slice(1);
    Drupal.settings.toolbarState = state;
  }
  return state;
};

/**
 * Initializes the tab associated with the specified name.  This method loads
 * all of the javascript assocaited with the tab.
 *
 * @private
 *
 * @param {String} name
 *   The name of the tab to initialize.  This will be used to construct the
 *   element id associated with the tab.
 */
ThemeBuilder.Bar.prototype._initializeTab = function (name) {
  var obj = this.getTabInfo(name);
  if (this._tabLoadRequests[obj.id] === true) {
    // The tab contents have already been requested.
    this.saveState(obj.id);
    return;
  }
  var $ = jQuery;
  this.links[obj.name] = obj.link;
  var panel = $('#' + obj.id);
  if (obj.link) {
    ThemeBuilder.load(panel, obj.link, {}, ThemeBuilder.bind(this, this.tabResourcesLoaded, obj, name, panel), '', false);
  }
  // Allow modules to define tabs with no server-side markup.
  else {
    this.tabResourcesLoaded('', 'success', obj, name, panel);
  }

  // Remember that we requested the tab contents.
  this._tabLoadRequests[obj.id] = true;
};

/**
 * Called when the tab resources are loaded.  This method is responsible for
 * initializing the tabs as soon as the tab is loaded.
 *
 * @param {String} markup
 *   The markup resulting from loading the tab.
 * @param {String} status
 *   Indicates whether the load succeeded.  Should be "success".
 * @param {Object} obj
 *   Provides information about the tab.
 * @param {String} name
 *   The name of the tab.
 * @param {jQuery Object} panel
 *   The object representing the panel associated with the tab.
 */
ThemeBuilder.Bar.prototype.tabResourcesLoaded = function (markup, status, obj, name, panel) {
  if (status !== 'success') {
    // The load failed.  Allow the load to occur again.
    delete this._tabLoadRequests[obj.id];
  }
  else {
    // The tab load succeeded.  Remember which tab we are on.
    this.saveState(obj.id);
  }
  var $ = jQuery;
  var tabObject = this.getTabObject(obj.id);
  if (tabObject && tabObject.init) {
    tabObject.init();
  }
  if (tabObject && tabObject.loaded) {
    tabObject.loaded();
  }
  if (!panel.is('.ui-tabs-hide')) {
    if (this.loader) {
      this.loader.hide();
    }
    this.hideWaitIndicator();
    panel.show();
  }
};

/**
 * Causes the currently selected tab to be initialized.  If the tabs are being
 * lazy loaded, this is the only tab initialization that needs to be done.
 *
 * @private
 */
ThemeBuilder.Bar.prototype._initializeCurrentTab = function () {
  var currentTabInfo = this.getTabInfo();
  this._initializeTab(currentTabInfo.name);
};


ThemeBuilder.Bar.prototype.addBarListener = function (listener) {
  this.listeners.push(listener);
};

/**
 * Sets the change status of the theme being edited.  This causes the user
 * interface to reflect the current state of modification.
 *
 * @param {boolean} isChanged
 *   True if the theme has been modified since the last save; false otherwise.
 */
ThemeBuilder.Bar.prototype.setChanged = function (isChanged) {
  var $ = jQuery;
  if (isChanged === null) {
    isChanged = true;
  }
  this.changed = isChanged;

  if (this.changed) {
    $('#themebuilder-save .save').attr('disabled', false);
    $('#themebuilder-main').trigger('modified');
    this.indicateThemeModified();
  }
  else {
    $('#themebuilder-save .save').attr('disabled', true);
    this.clearModifiedFlag();
  }
};

/**
 * Called when a request is sent that changes status of the undo and redo
 * buttons.  This method is responsible for disabling the buttons accordingly
 * to prevent the user from causing the client and server to get out of sync.
 *
 * @param {boolean} status
 *   If true, the status is going from an empty undo/redo stack to a non-empty
 *   stack.  false indicates the opposite.
 *   
 */
ThemeBuilder.Bar.prototype.undoStatusChanged = function (status) {
  if (status) {
    this.enableButtons();
  }
  else {
    this.disableButtons();
  }
  this.stackChanged();
};

/**
 * Called when the undo stack state has changed.  This function is responsible
 * for enabling and disabling the undo and redo buttons.
 *
 * @param stack object
 *   The stack that changed state.
 */
ThemeBuilder.Bar.prototype.stackChanged = function (stack) {
  if (!ThemeBuilder.undoButtons) {
    return;
  }
  var undoStatus = ThemeBuilder.undoButtons.getStatus();
  var $ = jQuery;
  if (!stack || stack === ThemeBuilder.undoStack) {
    var undoSize = ThemeBuilder.undoStack.size();
    if (undoSize <= 0 || undoStatus !== true) {
      $('.themebuilder-undo-button').addClass('undo-disabled')
        .unbind('click');
    }
    else {
      $('.themebuilder-undo-button.undo-disabled').removeClass('undo-disabled')
      .bind('click', ThemeBuilder.undo);
    }
  }
  if (!stack || stack === ThemeBuilder.redoStack) {
    var redoSize = ThemeBuilder.redoStack.size();
    if (redoSize <= 0 || !undoStatus) {
      $('.themebuilder-redo-button').addClass('undo-disabled')
      .unbind('click');
    }
    else {
      $('.themebuilder-redo-button.undo-disabled').removeClass('undo-disabled')
      .bind('click', ThemeBuilder.redo);
    }
  }
};

/**
 * Causes the theme currently being edited to be saved.  This should only be
 * called if there is a theme system name to which the theme should be saved.
 * Otherwise, the user should provide a theme name.  That can be done with the
 * saveas method.
 */
ThemeBuilder.Bar.prototype.save = function () {
  if (!Drupal.settings.themebuilderSaved) {
    this.saveas();
    return;
  }

  var selectedTheme = ThemeBuilder.Theme.getSelectedTheme();
  if (selectedTheme.isPublished()) {
    var saveAnyway = confirm(Drupal.t('Clicking OK will change your published (live) theme. Do you want to continue?'));
    if (saveAnyway !== true) {
      this.saveas();
      return;
    }
  }

  this.disableThemebuilder();
  ThemeBuilder.postBack('themebuilder-save', {},
    ThemeBuilder.bind(this, this._themeSaved),
    ThemeBuilder.bind(this, this._themeSaveFailed));
};

/**
 * Called when the theme has been saved.
 *
 * @private
 *
 * @param {Object} data
 *   The information returned from the server as a result of the theme being
 *   saved.
 */
ThemeBuilder.Bar.prototype._themeSaved = function (data) {
  var $ = jQuery;
  try {
    $('#themebuilder-main').trigger('save', data);
  }
  catch (e) {
  }
  this.enableThemebuilder();
};

/**
 * Called when the the save fails.  This provides an opportunity to recover
 * and allow the user to continue without losing their work.
 *
 * @param {Object} data
 *   The data returned from the failed request.
 */
ThemeBuilder.Bar.prototype._themeSaveFailed = function (data) {
  ThemeBuilder.handleError(data, data.type, 'recoverableError');
  this.enableThemebuilder();
};

/**
 * Causes a dialog box to appear that asks the user for a theme name, and then
 * saves the theme.
 */
ThemeBuilder.Bar.prototype.saveas = function () {
  this.processSaveDialog('themebuilderSaveDialog', false, 'themebuilder-save', ThemeBuilder.bind(this, this._saveDialogCallback, false));
};

/**
 * Called when the user clicks the export link, and causes the theme to be
 * exported.
 */
ThemeBuilder.Bar.prototype.exportTheme = function () {
  this.processSaveDialog('themebuilderExportDialog', false, 'themebuilder-export', ThemeBuilder.bind(this, this._themeExported));
};

/**
 * Called when the user clicks the "Update available" link.
 */
ThemeBuilder.Bar.prototype.updateTheme = function () {
  if (confirm(Drupal.t("There is an update available for your site's theme which contains new features or bug fixes.\nClick OK to preview this update."))) {
    this.showWaitIndicator();
    this.disableThemebuilder();
    // Force the screen to refresh after the update.
    this.forceReload = true;
    ThemeBuilder.postBack('themebuilder-update-theme', {},
      ThemeBuilder.bind(this, this.reloadPage));
  }
};

/**
 * This method is called after the theme is exported.
 *
 * @private
 *
 * @param {Object} data
 *   The information returned from the server as a result of the theme being
 *   exported.
 */
ThemeBuilder.Bar.prototype._themeExported = function (data) {
  this.setStatus(Drupal.t('%theme_name was successfully exported.', {'%theme_name': data.name}));
  window.location = data.export_download_url;
  this.enableThemebuilder();
};

/**
 * Causes the theme to be published.  If the there is no associated system
 * name for the theme to save to, a dialog will appear asking the user for a
 * theme name.
 */
ThemeBuilder.Bar.prototype.publish = function () {
  if (!Drupal.settings.themebuilderSaved) {
    // Only need to save before publishing if the theme has never been saved
    // before and doesn't have a name.  Publishing the theme causes the draft
    // theme to be copied (same as the save functionality).
    this.processSaveDialog('themebuilderPublishDialog', true, 'themebuilder-save', ThemeBuilder.bind(this, this._saveDialogCallback));
  }
  else {
    // Publish the theme.
    this.disableThemebuilder();

    // Publish is really expensive because it rebuilds the theme
    // cache.  Avoid doing that if we are really just saving to the
    // published theme.  Save is way more efficient.
    var appData = ThemeBuilder.getApplicationInstance().getData();
    var publish = appData.selectedTheme !== appData.published_theme;
    ThemeBuilder.postBack('themebuilder-save', {publish: publish},
      ThemeBuilder.bind(this, this._publishCallback));
  }
};

/**
 * This callback is invoked from the save dialog and used to cause the actual
 * save to occur.
 *
 * @private
 *
 * @param {Object} data
 *   The information entered into the save dialog by the user.
 * @param {String} status
 *   The status indicator.  "success" indicates the call was successful.
 * @param {boolean} publish
 *   If true, the saved theme will be published.
 */
ThemeBuilder.Bar.prototype._saveDialogCallback = function (data, status, publish) {
  // If the server informed us that this theme name already exists, prompt
  // for overwrite.
  if (data.themeExists) {
    var overwrite = confirm("A theme with that name already exists. Would you like to overwrite it?");
    if (overwrite) {
      var saveArguments = {
        'name': data.themeName,
        'overwrite': true
      };
      if (true === data.publish) {
        saveArguments.publish = data.publish;
      }
      this.disableThemebuilder();
      ThemeBuilder.postBack('themebuilder-save', saveArguments,
        ThemeBuilder.bind(this, this._saveDialogCallback, publish), ThemeBuilder.bind(this, this._themeSaveFailed));
    }
    else {
      this.enableThemebuilder();
    }
  }
  else {
    if (true === publish) {
      this._publishCallback(data);
    }
    else {
      this._themeSaved(data);
    }
  }
};

/**
 * This callback is invoked after the theme has been published.  This method
 * causes the UI to reflect the current theme name and updates application
 * data to match the new published theme.
 *
 * @private
 *
 * @param {Object} data
 *   The data that is passed from the server upon publishing the theme.
 */
ThemeBuilder.Bar.prototype._publishCallback = function (data) {
  this.setChanged(false);
  this.setStatus(Drupal.t('%theme_name is now live.', {'%theme_name': data.name}));
  this.setInfo(data.name, data.time);
  
  var app = ThemeBuilder.getApplicationInstance();
  
  // This fetch of the app data and setting the published and selected themes
  // to the system_name is necessary for setVisibilityText to work. It's voodoo
  // in my [jbeach] opinion, but it works right now, so we'll go with it.
  var appData = app.getData();
  appData.published_theme = appData.selectedTheme = data.system_name;
  
  // Trigger an app data update
  app.updateData({
    bar_published_theme: ThemeBuilder.Theme.getTheme(data.system_name)
  });

  // Update the cached theme data to reflect the change.
  this.updateThemeData(data);
  
  // We updated the active theme, so reset the message
  ThemeBuilder.Bar.getInstance().setVisibilityText();
  this.enableThemebuilder();
};

/**
 * Updates the cached theme data.  This should be called any time the
 * theme has changed (save, publish).
 *
 * @param {Object} data
 *   The data associated with a save or publish response.
 */
ThemeBuilder.Bar.prototype.updateThemeData = function (data) {
  var theme = ThemeBuilder.Theme.getTheme(data.system_name);
  if (theme) {
    theme.update(data);
  }
  else {
    theme = new ThemeBuilder.Theme(data);
    theme.addTheme();
  }
  var appData = ThemeBuilder.getApplicationInstance().getData();
  appData.selectedTheme = theme.getSystemName();
};

/**
 * Called after the theme is saved.
 *
 * @private
 *
 * @param {DomElement} element
 *   The element from which the callback was triggered.
 * @param {Object} data
 *   The data associated with the save call.
 */
ThemeBuilder.Bar.prototype._saveCallback = function (element, data) {
  // Disable the "save" button until the theme is modified again.
  Drupal.settings.themebuilderSaved = true;
  var $ = jQuery;
  $('#themebuilder-save .save').attr('disabled', true);

  // Update the theme name data
  this.setChanged(false);
  this.setInfo(data.name, data.time);

  if (data.name) {
    Drupal.settings.themeLabel = data.name;
  }
  if (true === data.publish) {
    this.setStatus(Drupal.t('%theme_name was successfully published.', {'%theme_name': data.name}));
  }
  else if (true === data.save_as) {
    // The user clicked "Save as"
    this.setStatus(Drupal.t('%theme_name was successfully copied and saved.', {'%theme_name': data.name}));
  } else {
    // The user clicked "Save"
    this.setStatus(Drupal.t('%theme_name was successfully saved.', {'%theme_name': data.name}));
  }

  // Fix the cached theme data.
  this.updateThemeData(data);
  this.enableThemebuilder();
};

/**
 * Displays and processes a standard ThemeBuilder save dialog.
 *
 * @param {string} dialogName
 *   The name for the dialog (e.g. themebuilderSaveDialog). It should have a
 *   corresponding item in the Drupal.settings object containing the HTML
 *   for the main part of the dialog form (e.g.
 *   Drupal.settings.themebuilderSaveDialog). The HTML needs to contain the
 *   'name' field (i.e. the id for the field must be "edit-name"). Buttons for
 *   "OK" and "Cancel" will be automatically added to the form.
 * @param {boolean} publish
 *   If true, the theme will be published after the save.
 * @param postbackPath
 *   The path to post results to when the "OK" button is clicked; this will be
 *   passed to ThemeBuilder.postBack as the path parameter.
 * @param callback
 *   The callback function to which the results of the POST request will be
 *   passed after the "OK" button is clicked. This will be passed to
 *   ThemeBuilder.postBack as the success_callback parameter.
 */
ThemeBuilder.Bar.prototype.processSaveDialog = function (dialogName, publish, postbackPath, callback) {
  var $ = jQuery;
  var $dialog = this.getDialog(dialogName);
  if ($dialog) {
    $dialog.dialog('open');
  }
  else {
    var dialogForm = Drupal.settings[dialogName];
    $dialog = $(dialogForm).appendTo('body').dialog({
      bgiframe: true,
      autoOpen: true,
      dialogClass: 'themebuilder-dialog',
      modal: true,
      overlay: {
        backgroundColor: '#000',
        opacity: 0.5
      },
      position: 'center',
      width: 335,
      buttons: {
        'OK': ThemeBuilder.bind(this, this._saveDialogOkButtonPressed, dialogName, postbackPath, publish, callback),
        'Cancel': ThemeBuilder.bind(this, this._saveDialogCancelButtonPressed, dialogName)
      },
      close: ThemeBuilder.bindIgnoreCallerArgs(this, this._saveDialogClose, dialogName),
      open: ThemeBuilder.bind(this, this._saveDialogOpen)
    });
    $dialog.find('form').keypress(ThemeBuilder.bind(this, this._handleKeyPress, dialogName));
    // Prevent users from naming a theme with a string longer than 25 characters
    // This addresses https://backlog.acquia.com/browse/AN-26333
    this._enableLiveInputLimit('#themebuilder-bar-save-form #edit-name');
    var input = '#themebuilder-bar-save-form #edit-name';
    this._limitInput(input);
    $(input).bind('paste', ThemeBuilder.bind(this, this._limitInput));

    this.setDialog(dialogName, $dialog);
  }
  // Put the cursor on the form
  $dialog.find('input:first').focus();
};

/**
 * Retrieve a reference to a jQuery UI Dialog.
 *
 * @param {string} dialogName
 *   The name of the dialog.
 *
 * @return {jQuery}
 *   The jQuery object containing the dialog.
 */
ThemeBuilder.Bar.prototype.getDialog = function (dialogName) {
  return this._dialogs[dialogName] || false;
};

/**
 * Save a reference to a jQuery UI Dialog.
 *
 * @param {string} dialogName
 *   The name of the dialog.
 * @param {jQuery} $dialog
 *   The jQuery object containing the dialog.
 *
 * @return {jQuery}
 *   The jQuery object containing the dialog.
 */
ThemeBuilder.Bar.prototype.setDialog = function (dialogName, $dialog) {
  this._dialogs[dialogName] = $dialog;
  return this._dialogs[dialogName];
};

/**
 * Called when the user presses the Ok button in the save dialog.  This method
 * causes the associated post to occur and closes the dialog.
 *
 * @private
 *
 * @param {DomEvent} event
 *   The event associated with the button press.
 * @param postbackPath
 *   The path to post results to when the "OK" button is clicked; this will be
 *   passed to ThemeBuilder.postBack as the path parameter.
 * @param {boolean} publish
 *   If true, the theme will be published after the save.
 * @param callback
 *   The callback function to which the results of the POST request will be
 *   passed after the "OK" button is clicked. This will be passed to
 *   ThemeBuilder.postBack as the success_callback parameter.
 */
ThemeBuilder.Bar.prototype._saveDialogOkButtonPressed = function (event, dialogName, postbackPath, publish, callback) {
  var $ = jQuery;
  var $dialog = this.getDialog(dialogName);
  var $nameField = $('.name:first', $dialog);
  // Validate the theme name field.
  if (!$nameField.val()) {
    if (!$nameField.hasClass("ui-state-error")) {
      $nameField.addClass("ui-state-error");
      $nameField.before("<div class='error-message'>" + Drupal.t("Please enter a theme name.") + "</div>");
    }
  }
  else {
    this.disableThemebuilder();
    var saveArguments = {'name': $nameField.val()};
    if (true === publish) {
      saveArguments.publish = publish;
    }
    ThemeBuilder.postBack(postbackPath, saveArguments, callback, ThemeBuilder.bind(this, this._themeSaveFailed));
    $dialog.dialog('close');
  }
};

/**
 * Called when the user presses the Cancel button in the save dialog.  This
 * method causes the dialog to be closed.
 *
 * @private
 */
ThemeBuilder.Bar.prototype._saveDialogCancelButtonPressed = function (event, dialogName) {
  var $ = jQuery;
  this.getDialog(dialogName).dialog('close');
};

/**
 * Called when the save dialog is opened.
 *
 * @private
 */
ThemeBuilder.Bar.prototype._saveDialogOpen = function () {
  this.maximize();
};

/**
 * Called when the save dialog is closed.
 *
 * @private
 */
ThemeBuilder.Bar.prototype._saveDialogClose = function (dialogName) {
  var $ = jQuery;
  var $dialog = this.getDialog(dialogName);
  // Clear the theme name field.
  $('input', $dialog).val("");
  // Clear any error messages.
  $('.name:first', $dialog).removeClass("ui-state-error");
  $('div.error-message', $dialog).remove();
};

/**
 * Exits themebuilder with an optional user confirmation.
 *
 * @param {boolean} confirm
 *   (Optional) If true, the user is prompted to confirm before exiting the
 *   themebuilder; otherwise the themebuilder exits with no prompt.
 * @param {String} destination
 *   (Optional) The URI to which the browser should be redirected after exit.
 */
ThemeBuilder.Bar.prototype.exit = function (confirm, destination) {
  if (confirm === true && !this.exitConfirm()) {
    return;
  }

  var $ = jQuery;

  // If the themebuilder is in the process of polling the server, stop it now,
  // so that we don't get any weird errors from contacting the server in one
  // thread while the themebuilder is in the process of being closed in
  // another.
  ThemeBuilder.getApplicationInstance().forcePollingToStop();

  this.showWaitIndicator();
  this.disableThemebuilder();
  ThemeBuilder.postBack('themebuilder-exit', {}, ThemeBuilder.bind(this, this._exited, destination));
};

/**
 * This method is called after the themebuilder has exited.  It is responsible
 * for reloading the page after exit to ensure that the correct theme is being
 * used.
 *
 * @private
 *
 * @param {String}
 *   (Optional) The URI to which the browser should be redirected.
 */
ThemeBuilder.Bar.prototype._exited = function (destination) {
  var $ = jQuery;
  $('body').removeClass('themebuilder');

  // Make sure to remove the themebuilder elements so automated tests
  // fail when trying to use the themebuilder after it is closed.
  $('#themebuilder-wrapper').remove();

  // Force reload so that any CSS changes get to the browser.
  if (destination && typeof destination !== "object") {
    parent.location.assign(destination);
  }
  this.reloadPage();
};

/**
 * Prompts the user with a message before the themebuilder exits.
 *
 * @param {String} message
 *   The message that should be displayed to the user.  If no message is
 *   provided, a default message will be used instead.
 */
ThemeBuilder.Bar.prototype.exitConfirm = function (message) {
  if (!message) {
    message = 'You have unsaved changes. Discard?';
  }
  if (this.changed === false || confirm(Drupal.t(message))) {
    return true;
  }
  this.enableThemebuilder();
  return false;
};

/**
 * Sets the data in the info bar.  The info bar indicates the name of the
 * theme and the last time the theme was saved.
 *
 * @param {String} name
 *   The name of the theme currently being edited.
 */
ThemeBuilder.Bar.prototype.setInfo = function (name) {
  var $ = jQuery;
  $('#themebuilder-wrapper .theme-name')
    .html(Drupal.checkPlain(name))
    .truncate({addtitle: true});
  this.setVisibilityText();
};

/**
 * Sets the text that indicates the theme visibility based on the currently published theme and whether the draft is dirty or not.
 */
ThemeBuilder.Bar.prototype.setVisibilityText = function () {
  var $ = jQuery;
  var message;
  var selectedTheme = ThemeBuilder.Theme.getSelectedTheme();
  if (selectedTheme) {
    if (selectedTheme.isPublished() && !this.changed) {
      message = Drupal.t('(Live - everyone can see this)');
    }
    else {
      message = Drupal.t('(Draft - only you can see this)');
    }
    $('#themebuilder-theme-name .theme-visibility').text(message);
  }
};

/**
 * Sets the message of the status bar in the themebuilder.  The status bar
 * appears when there is a new message to display and then hides itself after
 * some period of time.
 *
 * @param {String} message
 *   The message to display.
 * @param {String} type
 *   The type of message, either 'info' or 'warning'.  This parameter is
 *   optional, and if omitted the message will be displayed as an 'info' type.
 */
ThemeBuilder.Bar.prototype.setStatus = function (message, type) {
  var $ = jQuery;
  // If the status bar is still visible, don't allow it to be hidden by the
  // existing timeout
  if (this._statusTimeout) {
    clearTimeout(this._statusTimeout);
    delete this._statusTimeout;
  }

  if (!type) {
    type = 'info';
  }
  $('#themebuilder-status .themebuilder-status-icon').removeClass('info').removeClass('warning').addClass(type);

  // Estimate the required width...  Pull out the tags before counting
  // characters.
  var width = this._guesstimateStatusMessageWidth(message);
  $('#themebuilder-status .themebuilder-status-message').html(message);
  $('#themebuilder-status')
    .width(width + 'px')
    .fadeTo(1000, 0.8);
  // After 10 seconds close the status tab automatically.
  this._statusTimeout = setTimeout(ThemeBuilder.bind(this, this.hideStatus), 10000);
};

/**
 * Estimates the width that the status message should be set to.
 * 
 * The status message is centered in a div that is not in the normal
 * document flow.  This actually presents something of a challenge
 * because we want the text to dictate the width of the element, and
 * the width of the element to be used to center the element in the
 * window.  Since it is not in flow, we have to set the width of the
 * element, and thus we have to do a bit of ridiculous estimation to
 * make this feature match the design.
 * 
 * This method works by figuring out how many characters are in the
 * actual message (by stripping out any tags) and then using a
 * multiplier of the character count.  Since a variable-width font is
 * being used, special attention is paid to space characters to try to
 * achieve a reasonable estimate.
 * 
 * @private
 * @param {String} message
 *   The message markup.
 * @return {int}
 *   The estimated width.
 */
ThemeBuilder.Bar.prototype._guesstimateStatusMessageWidth = function (message) {
  var elementPadding = 47;
  var avgCharWidth = 8;
  var narrowCharOffset = -2.5;
  var wideCharOffset = 3;
  var strippedMessage = message.replace(/<[^>]*>/g, '');
  var narrowCount = strippedMessage.length - strippedMessage.replace(/[ il1]/g, '').length;
  var wideCount = strippedMessage.length - strippedMessage.replace(/[mwMW]/g, '').length;
  var width = (strippedMessage.length * avgCharWidth) + (narrowCount * narrowCharOffset) + (wideCount * wideCharOffset) + elementPadding;
  return width;
};

/**
 * Causes the info bar to indicate the theme has been modified.
 */
ThemeBuilder.Bar.prototype.indicateThemeModified = function () {
  var $ = jQuery;
  var $modified = $('#themebuilder-wrapper .theme-modified');
  if ($modified.length === 0) {
    $('<span class="theme-modified"> *</span>').insertBefore('#themebuilder-wrapper .theme-name');
  }
  this.setVisibilityText();
};

/**
 * Clears the flag that indicates the theme is dirty.
 */
ThemeBuilder.Bar.prototype.clearModifiedFlag = function () {
  var $ = jQuery;
  $('#themebuilder-wrapper .theme-modified').remove();
};

/**
 * Causes the themebuilder status bar to disappear.  This is usually invoked
 * by a timeout that is set when the status bar is displayed.
 */
ThemeBuilder.Bar.prototype.hideStatus = function () {
  var $ = jQuery;
  if (this._statusTimeout) {
    clearTimeout(this._statusTimeout);
    delete this._statusTimeout;
  }
  $('#themebuilder-status').fadeOut(1000);
};

/**
 * Causes the themebuilder to be minimized.
 */
ThemeBuilder.Bar.prototype.minimize = function () {
  var $ = jQuery;
  $('#themebuilder-wrapper').addClass('minimized');
};

/**
 * Causes the themebuilder to be maximized.
 */
ThemeBuilder.Bar.prototype.maximize = function () {
  var $ = jQuery;
  $('#themebuilder-wrapper').removeClass('minimized');
};

/**
 * Causes the themebuilder to toggle from maximized to minimized or from
 * minimized to maximized depending on the current state.
 */
ThemeBuilder.Bar.prototype.toggleMinimize = function () {
  var $ = jQuery;
  $('#themebuilder-wrapper').toggleClass('minimized');
};

/**
 * Prevents clicks on ThemeBuilder elements from propagating outside the ThemeBuilder.
 * Because we assign a click handler to the <body> in ElementPicker.js, we need to prevent
 * certain events that modify the Selector from also triggering _clickItem in ElementPicker.js
 */
ThemeBuilder.Bar.prototype.quarantineEvents = function (event) {
  event.stopPropagation();
};

/**
 * If warranted, this function displays the status message when the
 * themebuilder is initially loaded.  This is useful when a status generating
 * event is performed just before or during a page load, not providing time
 * for the user to view the message before it would be refreshed.  This is
 * accomplished by setting an array containing 'message' and 'type' fields
 * into $_SESSION['init_message'].
 *
 * @static
 *
 * @param {Object} data
 *   The application initialization data.
 */
ThemeBuilder.Bar.showInitialMessage = function (data) {
  if (data && data.initMessage) {
    ThemeBuilder.Bar.getInstance().setStatus(data.initMessage.message, data.initMessage.type);
  }
};

/**
 * If an alert has been passed to the javascript client, display it now.
 *
 * @param {Object} data
 *   Optional parameter tha provides the application initialization data.  If
 *   not provided this method will retrieve the data from the Application
 *   instance.
 */
ThemeBuilder.Bar.prototype.showInitialAlert = function (data) {
  if (!data) {
    data = ThemeBuilder.getApplicationInstance().getData();
  }
  
  if (data && data.initAlert) {
    alert(data.initAlert);
  }
};

/**
 * Creates an element that serves as a veil that blocks all input into the
 * themebuilder.  This is useful for controling the rate of requests the users
 * can submit using the themebuilder.
 */
ThemeBuilder.Bar.prototype._createVeil = function () {
  var $ = jQuery;
  var veil = $('<div id="themebuilder-veil"></div>').appendTo('#themebuilder-wrapper');
};

/**
 * Applies a limit to the length of the input text
 * 
 * @private
 * @param {Event} event
 *   The event that this function handles
 * @param {HTML Object} field
 *   A DOM field.
 *   
 * Prevent users from naming a theme with a string longer than 25 characters
 * This addresses https://backlog.acquia.com/browse/AN-26333
 * 
 * This function trims the string down to 25 characters if it is longer than 25 characters.
 */
ThemeBuilder.Bar.prototype._limitInput = function (field) {
  var $ = jQuery;
  var max = 25;
  // If this method is called by an event, field will be an event
  field = (field.target) ? field.target : field;
  var $field = $(field);
  if ($field.length > 0) {
    // Trim the text down to max if it exceeds
    // The delay is necessary to allow time for the paste action to complete
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this._trimField, $field, max), 200);
  }
};

/**
 * Applies the NobleCount plugin to the supplied field
 * 
 * @private
 * @param {HTML Object} field
 *   A DOM field.
 *   
 * Prevent users from naming a theme with a string longer than 25 characters
 * This addresses https://backlog.acquia.com/browse/AN-26333
 */
ThemeBuilder.Bar.prototype._enableLiveInputLimit = function (field) {
  var $ = jQuery;
  var max = 25;
  var $field = $(field);
  if ($field.length > 0) {
    // Add the NobleCount input limiter
    // This must be given the ID #char-count-save because the save
    // dialog isn't destroyed after it's dismissed. So the id #char-count
    // would conflict with other char-counting fields on the page.
    $('<span>', {
      id: 'char-count-save'
    }).insertAfter($field);
    $field.NobleCount('#char-count-save', {
      max_chars: max,
      block_negative: true
    });
  }
};

/**
 * Trims a field's value down to the max
 * 
 * @private
 * @param {jQuery Object} $field
 *   The HTML field to be trimmed.
 * @param {int} max
 *   The maximum number of characters allowed in this field.
 */
ThemeBuilder.Bar.prototype._trimField = function ($field, max) {
  var value = $field.val();
  if (value.length > max) {
    $field.val(value.substr(0, max));
  }
  // Keydown is called to kick the NobleCounter plugin to refresh
  $field.keydown();
};

/**
 * Disables the themebuilder by displaying the veil which absorbs all input.
 */
ThemeBuilder.Bar.prototype.disableThemebuilder = function () {
  var $ = jQuery;
  $('#themebuilder-veil').addClass('show');
  this.showWaitIndicator();
};

/**
 * Enables the themebuilder by removing the veil.
 */
ThemeBuilder.Bar.prototype.enableThemebuilder = function () {
  var $ = jQuery;
  $('#themebuilder-veil').removeClass('show');
  this.hideWaitIndicator();
};

/**
 * Causes the buttons at the top of the themebuilder to be enabled.
 */
ThemeBuilder.Bar.prototype.enableButtons = function () {
  var $ = jQuery;
  $('#themebuilder-control-veil').removeClass('on');

};

/**
 * Causes the buttons at the top of the themebuilder to be disabled.
 *
 * This is important for reducing the possibility of race conditions
 * in which a commit that takes a bit too long allows the user to save
 * the theme when the theme is incomplete, thus losing css
 * customizations.
 */
ThemeBuilder.Bar.prototype.disableButtons = function () {
  var $ = jQuery;
  $('#themebuilder-control-veil').addClass('on');
};

/**
 * Adds the toolbar to the page.
 *
 * @static
 */
ThemeBuilder.Bar.attachToolbar = function () {
  // This keeps the themebuilder from dying whenever Drupal.attachBehaviors is called.
  if (ThemeBuilder.Bar.attachToolbar.attached !== undefined) {
    return;
  }
  ThemeBuilder.Bar.attachToolbar.attached = true;

  ThemeBuilder.getApplicationInstance();
  //Always add the toolbar
  jQuery('body').append(Drupal.settings.toolbarHtml);
  jQuery('#themebuilder-wrapper:not(.themebuilder-keep)').hide();
};

/**
 * This Drupal behavior causes the themebuilder toolbar to be attached to the
 * page.
 */
Drupal.behaviors.themebuilderBar = {
  attach: ThemeBuilder.Bar.attachToolbar
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global ThemeBuilder: true debug: true window: true*/


/**
 * This class parses the userAgent string to determine which browser is being
 * used.  This class was written because the browser support in jquery is
 * deprecated and has a bug in which some installations of IE8 report
 * compatibility with IE8 and IE6, and the version from jquery's browser
 * object is 6 rather than 8.
 *
 * Further, this object gives us the ability to apply the detection to a
 * specified userAgent string rather than getting it from the browser.  This
 * will help support browsers that we don't even have access to by verifying
 * the user agent string is parsed and taken apart correctly.
 * @class
 */
ThemeBuilder.BrowserDetect = ThemeBuilder.initClass();

/**
 * Instantiates a new instance of the BrowserDetect class with the specified
 * string.  If no string is specified, the navigator.userAgent will be used
 * instead.
 *
 * After instantiation, the caller can look at the browser, version, and OS
 * fields to determine the browser specifics.
 *
 * @param {String} userAgent
 *   (Optional) The user agent string to apply detection to.
 */
ThemeBuilder.BrowserDetect.prototype.initialize = function (userAgent) {
  this.userAgent = userAgent || navigator.userAgent;
  this._populateData();
  this.browser = this._searchString(this.dataBrowser) || "An unknown browser";
  this.version = this._searchVersion(this.userAgent) ||
    this._searchVersion(navigator.appVersion) || "an unknown version";
  this.OS = this._searchString(this.dataOS) || "an unknown OS";
};

ThemeBuilder.BrowserDetect.prototype._searchString = function (data) {
  for (var i = 0; i < data.length; i++)	{
    var dataString = data[i].string;
    var dataProp = data[i].prop;
    this.versionSearchString = data[i].versionSearch || data[i].identity;
    if (dataString) {
      if (dataString.indexOf(data[i].subString) !== -1) {
        return data[i].identity;
      }
    }
    else if (dataProp) {
      return data[i].identity;
    }
  }
};
  
ThemeBuilder.BrowserDetect.prototype._searchVersion = function (dataString) {
  var version = null;
  var index = dataString.indexOf(this.versionSearchString);
  if (index > -1) {
    version = parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    if (isNaN(version)) {
      version = null;
    }
  }
  return version;
};

ThemeBuilder.BrowserDetect.prototype._populateData = function () {
  this.dataBrowser = [
    {
      string: this.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {
      string: this.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      string: this.userAgent,
      prop: window.opera,
      identity: "Opera"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: this.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    { // for newer Netscapes (6+)
      string: this.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: this.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: this.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    { // for older Netscapes (4-)
      string: this.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ];
  this.dataOS = [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
      string: this.userAgent,
      subString: "iPhone",
      identity: "iPhone/iPod"
    },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ];
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/
"use strict";

/**
 * The StartInteraction is an interaction that is responsible for opening the themebuilder.
 * 
 * This act is complicated by several factors including error
 * conditions that cause the open to fail, existing themebuilder
 * sessions in other webnodes, and theme corruption that might require
 * the intervention of the theme elves.
 * @class
 * @extends ThemeBuilder.InteractionController
 */
ThemeBuilder.StartInteraction = ThemeBuilder.initClass();
ThemeBuilder.StartInteraction.prototype = new ThemeBuilder.InteractionController();

ThemeBuilder.StartInteraction._lock = false;

/**
 * Constructor for the StartInteraction.
 * 
 * @param {Object} callbacks
 *   The set of callbacks that will be called upon the completion of this interaction.
 */
ThemeBuilder.StartInteraction.prototype.initialize = function (callbacks) {
  this.setInteractionTable({
    begin: 'prepareUIForOpen',
    userNotified: 'verifyWebnode',

    webnodeConfirmed: 'setCookie',
    cookieSet: 'startThemeBuilder',
    cookieNotSet: 'exitWithMessage',

    failedToGetWebnode: 'setGenericExitMessage',

    themeBuilderStarted: 'reloadPage', // This constitutes the end of this interaction.

    // The themebuilder session is open in another browser.
    editSessionInProgress: 'showTakeOverSessionConfirmation',
    takeoverAccepted: 'takeoverSession',
    takeoverCanceled: 'openCanceled',

    // Exceptions:
    openFailed: 'handleOpenFailure',
    errorOnOpen: 'invokeThemeElves',
    themeElfSuccess: 'startThemeBuilder',
    themeElfFailure: 'setGenericExitMessage',

    // Cancel the open request.
    openCanceled: 'cancelOpen',
    exitMessageSet: 'exitWithMessage',
    exitMessageDismissed: 'cancelOpen'
  });
  this.setCallbacks(callbacks);

  // Create the redirects.
  this.openCanceled = this.makeEventCallback('openCanceled');
  this.errorOnOpen = this.makeEventCallback('errorOnOpen');

  this.errorMap = ['error', 'errorName', 'errorType'];
};

/**
 * Prepares the user interface for opening the themebuilder.
 * 
 * This includes displaying a spinner to indicate the application has
 * accepted the user's request and is working.
 * 
 * If this interaction has been locked, the interaction will stop
 * immediately with no further action taken.  The lock indicates the
 * themebuilder open is already in progress, and prevents the user
 * from being able to cause multiple start processes simultaneously.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.prepareUIForOpen = function (data) {
  var $ = jQuery;
  if (this.isLocked()) {
    // The user is in the middle of opening the themebuilder.  Ignore the request.
    return;
  }
  this.setLock(true);
  var bar = ThemeBuilder.Bar.getInstance();
  bar.showWaitIndicator();
  Drupal.toolbar.collapse();

  // The themebuilder start options provide a mechanism for taking
  // over a themebuilder session.  By default this option is not set
  // so the user will be prompted before a session is taken.
  if (!data) {
    data = {startOptions: {}};
  }
  data.elfInvocations = 0;
  this.event(data, 'userNotified');
};

/**
 * Verifies the webnode that will be used to connect to the themebuilder.
 * 
 * If the webnode provided when the page was loaded is too old, this
 * method will request the webnode from the server.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.verifyWebnode = function (data) {
  // Check that we have a current server name for a cookie.  If not, request
  // one via ajax.  Set the cookie before opening the ThemeBuilder.
  var info = Drupal.settings.themebuilderServer;
  var d = new Date();
  var time = Math.floor(d.getTime() / 1000);
  if (info && info.webnode && time <= info.time) {
    // Set the webnode into the data.
    data.server = info;
    this.event(data, 'webnodeConfirmed');
  }
  else {
    // Request the webnode from the server.
    var map = [
      'server', 'type'
    ];
    ThemeBuilder.postBack('themebuilder-get-server', {}, ThemeBuilder.bind(this, this.event, map, data, 'webnodeConfirmed'), ThemeBuilder.bind(this, this.event, this.errorMap, data, 'failedToGetWebnode'));
  }
};

/**
 * Establishes a cookie that causes all requests to go to the webnode specified
 * in the parameter and causes a themebuilder edit session to open.
 * 
 * The open is accomplished by sending a request to the server, and
 * upon success the page must be reloaded.
 *
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.setCookie = function (data) {
  var $ = jQuery;
  var webnode = data.server.webnode;
  var bar = ThemeBuilder.Bar.getInstance();

  // Note: Do not set the expires to 0.  That is the default, but this
  // results in the cookie not being set in IE.
  $.cookie('ah_app_server', data.server.webnode, {path: '/'});

  // Verify that the cookie exists.  Note that if the cookie was set
  // incorrectly, the problem is not always detectable via JavaScript,
  // but we can at least try knowing that we can't totally trust the
  // results.
  if ($.cookie('ah_app_server') === data.server.webnode) {
    this.event(data, 'cookieSet');
  }
  else {
    data.userMessage = Drupal.t("The ThemeBuilder cannot be started, possibly because your browser's privacy settings are too strict.");
    this.event(data, 'cookieNotSet');
  }
};

/**
 * Opens the themebuilder.
 * 
 * The open is accomplished by sending a request to the server, and
 * upon success the page must be reloaded.
 *
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.startThemeBuilder = function (data) {
  var map = ['start', 'type'];
  ThemeBuilder.postBack('themebuilder-start', data.startOptions,
    ThemeBuilder.bind(this, this.event, map, data, 'themeBuilderStarted'), ThemeBuilder.bind(this, this.event, this.errorMap, data, 'openFailed'));
};

/**
 * Causes the page to refresh.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.reloadPage = function (data) {
  // Reload, which is required even if there are no changes to the
  // theme to make sure the gears work after the themebuilder is
  // closed.
  this.setLock(false);
  parent.location.reload(true);
};

/**
 * Handles any error condition returned from the server.
 * 
 * This method is responsible for inspecting the error and putting
 * this controller into the appropriate state to deal with the
 * problem.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.handleOpenFailure = function (data) {
  if (data.errorName === 'ThemeBuilderEditInProgressException') {
    this.event(data, 'editSessionInProgress');
    this.setLock(false);
  }
  if (data.errorName === 'error') {
    this.event(data, 'errorOnOpen');
  }
  this._clearError(data);
};

/**
 * Shows a confirmation dialog to take over the session.
 * 
 * If an existing TB editing session is underway in another browser and a user
 * tries to enter edit mode, this will fire.  If the user accepts, we will re-try
 * to start the session, this time forcing it to take precedence.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.showTakeOverSessionConfirmation = function (data) {
  var $ = jQuery;
  var message = Drupal.t('An active draft exists from a previous session.  Click Cancel if you do not want to edit the appearance in this browser, otherwise click OK to take over the draft in this window.');

  // This markup will be displayed in the dialog.
  var inputId = 'active-draft-exists';
  var $html = $('<div>').append(
    $('<img>', {
      src: Drupal.settings.themebuilderAlertImage
    }).addClass('alert-icon'),
    $('<span>', {
      html: message
    })
  );
  var dialog = new ThemeBuilder.ui.Dialog($('body'),
    {
      html: $html,
      buttons: [
        {
          label: Drupal.t('OK'),
          action: this.makeEventCallback('takeoverAccepted', data)
        },
        {
          label: Drupal.t('Cancel'),
          action: this.makeEventCallback('takeoverCanceled', data)
        }
      ],
      // The default action, which is invoked if the user hits Esc or
      // the 'x' in the dialog.
      defaultAction: this.makeEventCallback('takeoverCanceled', data)
    }
  );
};

/**
 * Causes the existing themebuilder session to be taken over.
 * 
 * This allows the user to get into the themebuilder even if they
 * already have a session open in a different browser.  The other
 * session in the other browser will be closed as a result.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.takeoverSession = function (data) {
  data.startOptions = {'take_over_session': true};
  this.startThemeBuilder(data);
};

/**
 * Invoked when the themebuilder open is canceled.
 * 
 * This could be due to error conditons or because the user chose 'Cancel' when the message about an existing themebuilder session appears.
 * 
 * This method is responsible for cleaning up the UI such that the
 * user can continue interacting with the site and click the
 * Appearance button again if desired.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.cancelOpen = function (data) {
  var bar = ThemeBuilder.Bar.getInstance();
  bar.hideWaitIndicator();
  Drupal.toolbar.expand();
  this.setLock(false);
};

/**
 * Causes the theme elves to be invoked.
 * 
 * The theme elves are server-side code that detect and correct
 * problems in themes that may prevent the themebuilder from opening.
 * If there is an error that prevents the user from starting the
 * themebuilder, it is a good idea to give the theme elves a chance to
 * fix it and try again.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.invokeThemeElves = function (data) {
  data.elfInvocations++;
  if (data.elfInvocations > 2) {
    // Be careful not to invoke the elves an infinite number of times.
    // It takes a substantial amount of time to run them and it is
    // very unlikely to be useful running them more than twice.
    this.event(data, 'themeElfFailure');
    return;
  }
  var map = ['recovery', 'type'];
  ThemeBuilder.postBack('themebuilder-fix-themes', {}, ThemeBuilder.bind(this, this.event, map, data, 'themeElfSuccess'), ThemeBuilder.bind(this, this.event, this.errorMap, 'themeElfFailure'));
};

/**
 * This method displays a dialog that indicates to the user that the themebuilder was unable to start.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.setGenericExitMessage = function (data) {
  data.userMessage = Drupal.t('An error has occurred. Please let us know what you tried to do in the <a target="_blank" href="http://www.drupalgardens.com/forums">Drupal Gardens forums</a>, and we will look into it.');
  this.event(data, 'exitMessageSet');
};

/**
 * Retrieves the state of the lock.
 *
 * @return {boolean}
 *   true if the lock is set; false otherwise.
 */
ThemeBuilder.StartInteraction.prototype.isLocked = function () {
  return ThemeBuilder.StartInteraction._lock;
};

/**
 * Sets the state of the start lock.
 * 
 * @param {boolean} isLocked
 *   If true, the lock will be set; otherwise the lock will be cleared.
 */
ThemeBuilder.StartInteraction.prototype.setLock = function (isLocked) {
  ThemeBuilder.StartInteraction._lock = isLocked === true;
};

/**
 * Displays a dialog that presents a message stored in data.userMessage.
 * 
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype.exitWithMessage = function (data) {
  var $ = jQuery;
  var dialog = new ThemeBuilder.ui.Dialog($('body'), {
    html: $('<span>').html(data.userMessage),
    buttons: [
      {
        label: Drupal.t('OK'),
        action: this.makeEventCallback('exitMessageDismissed', data)
      }
    ]
  });
};

/**
 * Clears the error from the specified data object.
 * 
 * When an error occurs, there are fields that are added to the data
 * object that must be cleared so the error won't be detected
 * erroneously on subsequent requests.  This method clears those
 * fields so the interaction can continue.
 * 
 * @private
 * @param {Object} data
 *   The data object that is passed in to every state in the
 *   interaction.  This data object collects information from the
 *   system state and the user's choices and facilitates moving the
 *   application into the opened state.
 */
ThemeBuilder.StartInteraction.prototype._clearError = function (data) {
  delete data.error;
  delete data.errorName;
  delete data.errorType;
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global window : true jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder = ThemeBuilder || {};

/**
 * ThemeBuilder.ui is a namespace for all User Interface wrappers that augment
 * the basic functionality of ThemeBuilder components.
 * It includes UI widgets such as Sliders, Tabs and Carousels
 * @namespace
 */
ThemeBuilder.ui = ThemeBuilder.ui || {};

/**
 * The dialog wraps a message in a jquery ui dialog with hooks for the OK and Cancel button callbacks
 * @class
 */
ThemeBuilder.ui.Dialog = ThemeBuilder.initClass();

/**
 * The constructor of the Dialog class.
 *
 * @param {DomElement} element
 *   The element is a pointer to the jQuery object that will be wrapped in the 
 *   dialog.
 * @param {Object} options
 *   Options for the dialog. May contain the following optional properties:
 *   - text: Text for the message displayed in the dialog. HTML or plain text
 *     can be passed in. Defaults to 'Continue?'.
 *   - actionButton: Text displayed in the action button. Defaults to 'OK'.
 *   - cancelButton: Text displayed in the cancellation button. Defaults to
 *     'Cancel'.
 * @param {Object} callbacks
 *   Button callback functions for the dialog. May contain the following
 *   optional properties (if either of these are not set, the dialog will
 *   simply be closed when the corresponding button is clicked):
 *   - action: Callback to invoke when the action button is clicked.
 *   - cancel: Callback to invoke when the cancellation button is clicked.
 * @return {Boolean}
 *   Returns true if the dialog initializes.
 */
ThemeBuilder.ui.Dialog.prototype.initialize = function (element, options) {
  
  // This UI element depends on jQuery Dialog
  if (!jQuery.isFunction(jQuery().dialog)) {
    return false;
  }
  
  if (!options.buttons) {
    return false;
  }
  
  var $ = jQuery;
  this._$element = (element) ? element : $('body');
  this._$dialog = null;
  this._buttons = options.buttons;
  this._html = options.html;
  this._type = 'Dialog';
  if (options.defaultAction) {
    this._default = options.defaultAction;
  }
  else if (options.buttons.length === 1) {
    // If there is only one option, use that as the default.
    this._default = options.buttons[0].action;
  }
  // Build the DOM element
  this._build();
  
  return true;
};

ThemeBuilder.ui.Dialog.prototype._build = function () {
  var $ = jQuery;
  var $wrapper = $('<div>', {
    id: "themebuilder-confirmation-dialog",
    html: this._html
  }).addClass('message');
  var buttons = {};
  for (var i = 0; i < this._buttons.length; i++) {
    var handler = ThemeBuilder.bind(this, this._respond, this._buttons[i].action);
    buttons[this._buttons[i].label] = handler;
  }
  $wrapper.appendTo(this._$element);
  var dialogOptions = {
    bgiframe: true,
    autoOpen: true,
    dialogClass: 'themebuilder-dialog tb',
    modal: true,
    overlay: {
      backgroundColor: '#000',
      opacity: 0.5
    },
    position: 'center',
    width: 335,
    buttons: buttons
  };
  if (this._default) {
    dialogOptions.beforeclose = this._default;
  }
  this._$dialog = $wrapper.dialog(dialogOptions);
};

/**
 * Destroys the dialog DOM element
 */
ThemeBuilder.ui.Dialog.prototype._close = function () {
  this._$dialog.remove();
};

/**
 * Returns the form data to the interaction control that instantiated this dialog
 * 
 * @param {Event} event
 *   The dialog button click event
 * @param {function} action
 *   The callback associated with the button, defined by the instantiating 
 *   interaction control.
 */
ThemeBuilder.ui.Dialog.prototype._respond = function (event, action) {
  var $ = jQuery,
      data = {}, 
      $form = $(event.target).closest('.ui-dialog').find('.ui-dialog-content');
  // Scrape all of the form data out of the dialog and store as key/value pairs
  // Input elements
  $(':input', $form).each(function (index, item) {
    var $this = $(this),
        name = $this.attr('name');
    if (name) {
      data[name] = $this.val();
    }
  });
  this._close();
  action(data);
};

/**
 * Returns a jQuery pointer to this object
 *
 * @return {object}
 *   Returns null if the carousel has no pointer.
 */
ThemeBuilder.ui.Dialog.prototype.getPointer = function () {
  if (this._$dialog) {
    return this._$dialog;
  } 
  else {
    return null;
  }
};

/**
 * Utility function to remove 'px' from calculated values.  The function assumes that
 * that unit 'value' is pixels.
 *
 * @param {String} value
 *   The String containing the CSS value that includes px.
 * @return {int}
 *   Value stripped of 'px' and casted as a number or NaN if 'px' is not found in the string.
 */
ThemeBuilder.ui.Dialog.prototype._stripPX = function (value) {
  var index = value.indexOf('px');
  if (index === -1) {
    return NaN;
  }
  else {
    return Number(value.substring(0, index));
  }
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true debug: true window: true*/
/*
 * Turns a list of links into a contextual flyout menu.
 * The menu is associated with an element on the page.
 * 
 * Author: Acquia, @jessebeach
 * Website: http://acquia.com, http://qemist.us
 *
 * items = {
 *  [
 *    {
 *      label: string,
 *      href: string (optional),
 *      itemClasses: array (optional),
 *      linkClasses: array (optional),
 *      linkWrapper: string (default: <a>, optional)
 *    }
 *  ]
 *  ...
 * }
 *
 */
(function ($) {

  // replace 'pluginName' with the name of your plugin
  $.fn.flyoutList = function (options) {

    // debug(this);

    // build main options before element iteration
    var opts = $.extend({}, $.fn.flyoutList.defaults, options);

    // iterate over matched elements
    return this.each(function () {
      var $this = $(this);
      // build element specific options. Uses the Metadata plugin if available
      // @see http://docs.jquery.com/Plugins/Metadata/metadata
      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
      // implementations
      
      if (o.items) {
        var $flyoutList = $.fn.flyoutList.buildFlyoutList(o.items).prependTo($this);
      
        var $context = o.context ? $(o.context) : $this;
        $context.css({
          position: 'relative'
        })
        .addClass('flyout-list-context');
      
        // Place the dotted outline just outside the context element
        $.fn.flyoutList.buildContextOutline($context);
      }
    });
  };
    
  // plugin defaults
  $.fn.flyoutList.defaults = {};

  // private functions definition
  $.fn.flyoutList.buildFlyoutList = function (items) {
    var $list = $('<ul>').addClass('flyout-list clearfix');
    var len = items.length;
    for (var i = 0; i < len; i++) {
      var itemClasses = ['item-' + i];
      if (items[i].itemClasses) {
        $.merge(itemClasses, items[i].itemClasses);
      }
      var linkClasses = ['action', $.fn.flyoutList.makeSafeClass('action-' + items[i].label)];
      if (items[i].linkClasses) {
        $.merge(linkClasses, items[i].linkClasses);
      }
      var linkWrapper = (items[i].linkWrapper) ? '<' + items[i].linkWrapper + '>' : '<a>';
      var linkProperties = {};
      if (items[i].label) {
        linkProperties.text = items[i].label;
      }
      else {
        linkProperties.text = "missing label";
      }
      if (items[i].href) {
        linkProperties.href = items[i].href;
      }
      
      $list.append($('<li>', {
        html: $(linkWrapper, linkProperties).addClass(linkClasses.join(' '))
      }).addClass(itemClasses.join(' ')));
    }
    return $list;
  };
  
  $.fn.flyoutList.makeSafeClass = function (s) {
    var className = s.toString().replace(new RegExp("[^a-zA-Z0-9_-]", 'g'), "-").toLowerCase();
    return className;
  };
  
  $.fn.flyoutList.buildContextOutline = function ($context) {
    $('<div>').addClass('flyout-list-outline top').prependTo($context);
    $('<div>').addClass('flyout-list-outline right').prependTo($context);
    $('<div>').addClass('flyout-list-outline bottom').prependTo($context);
    $('<div>').addClass('flyout-list-outline left').prependTo($context);
  };

  // private function for debugging
  function debug() {
    var $this = $(this);
    if (window.console && window.console.log) {
      window.console.log('selection count: ' + $this.size());
    }
  }

}(jQuery));;
(function ($) {
  // Plugins should not declare more than one namespace in the $.fn object.
  // So we declare methods in a methods array
    var methods = {
      init : function (options) {
        // build main options before element iteration
        var o = mergeOptions(options);
        // iterate over matched elements
        return this.each(function () {
          // implementations
          var visible = (!$(this).hasClass('smart-hidden'));
          if (visible) {
            hide(this, o);
          }
          else {
            show(this, o);
          }
        });
      },
      show : function (options) {
        // build main options before element iteration
        var o = mergeOptions(options);
        // iterate over matched elements
        return this.each(function () {
          show(this, o);
        });
      },
      hide : function (options) {
        // build main options before element iteration
        var o = mergeOptions(options);
        // iterate over matched elements
        return this.each(function () {
          hide(this, o);
        });
      }
    };

    // replace 'smartToggle' with the name of your plugin
    $.fn.smartToggle = function (method) {
  
      // debug(this);
      
      // Method calling logic
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || ! method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('Method ' +  method + ' does not exist on jQuery.smartToggle');
      }
    };
    
    // plugin defaults
    $.fn.smartToggle.defaults = {
      vClass: "smart-visible",
      hClass: "smart-hidden",
      speed: 750
    };
    
    // private functions definition
    function mergeOptions (options) {
      return $.extend({}, $.fn.smartToggle.defaults, options);
    }
    function show (element, options) {
      var $this = $(element);
      $this.hide(0).removeClass('smart-hidden').fadeIn(options.speed);
    }
    function hide (element, options) {
      var $this = $(element);
      $this.fadeOut(options.speed).addClass('smart-hidden').show(0);
    }
  
    // private function for debugging
    function debug() {
      var $this = $(this);
      if (window.console && window.console.log) {
        window.console.log('selection count: ' + $this.size());
      }
    }
  }
)(jQuery);;
(function(h){function j(c,a,d,b,e,f,h){var i,g;h?(i=d===0?"":a.slice(-d),g=a.slice(-b)):(i=a.slice(0,d),g=a.slice(0,b));if(e.html(g+f).width()<e.html(i+f).width())return b;g=parseInt((d+b)/2,10);i=h?a.slice(-g):a.slice(0,g);e.html(i+f);if(e.width()===c)return g;e.width()>c?b=g-1:d=g+1;return j(c,a,d,b,e,f,h)}h.fn.truncate=function(c){c=h.extend({width:"auto",token:"&hellip;",center:!1,addclass:!1,addtitle:!1},c);return this.each(function(){var a=h(this),d={fontFamily:a.css("fontFamily"),fontSize:a.css("fontSize"),
fontStyle:a.css("fontStyle"),fontWeight:a.css("fontWeight"),"font-variant":a.css("font-variant"),"text-indent":a.css("text-indent"),"text-transform":a.css("text-transform"),"letter-spacing":a.css("letter-spacing"),"word-spacing":a.css("word-spacing"),display:"none"},b=a.text();d=h("<span/>").css(d).html(b).appendTo("body");var e=d.width(),f=!isNaN(parseFloat(c.width))&&isFinite(c.width)?c.width:a.width();e>f&&(d.text(""),c.center?(f=parseInt(f/2,10)+1,e=b.slice(0,j(f,b,0,b.length,d,c.token,!1))+c.token+
b.slice(-1*j(f,b,0,b.length,d,"",!0))):e=b.slice(0,j(f,b,0,b.length,d,c.token,!1))+c.token,c.addclass&&a.addClass(c.addclass),c.addtitle&&a.attr("title",b),a.html(e));d.remove()})}})(jQuery);;
/* jQuery.NobleCount v 1.0 http://tpgblog.com/noblecount/
compiled by http://yui.2clics.net/ */
(function(c){c.fn.NobleCount=function(i,h){var j;var g=false;if(typeof i=="string"){j=c.extend({},c.fn.NobleCount.settings,h);if(typeof h!="undefined"){g=((typeof h.max_chars=="number")?true:false)}return this.each(function(){var k=c(this);f(k,i,j,g)})}return this};c.fn.NobleCount.settings={on_negative:null,on_positive:null,on_update:null,max_chars:140,block_negative:false,cloak:false,in_dom:false};function f(g,m,n,h){var l=n.max_chars;var j=c(m);if(!h){var k=j.text();var i=(/^[1-9]\d*$/).test(k);if(i){l=k}}b(g,j,n,l,true);c(g).keydown(function(o){b(g,j,n,l,false);if(a(o,g,n,l)==false){return false}});c(g).keyup(function(o){b(g,j,n,l,false);if(a(o,g,n,l)==false){return false}})}function a(k,g,l,j){if(l.block_negative){var h=k.which;var i;if(typeof document.selection!="undefined"){i=(document.selection.createRange().text.length>0)}else{i=(g[0].selectionStart!=g[0].selectionEnd)}if((!((e(g,j)<1)&&(h>47||h==32||h==0||h==13)&&!k.ctrlKey&&!k.altKey&&!i))==false){return false}}return true}function e(g,h){return h-(c(g).val()).length}function b(g,i,l,j,h){var k=e(g,j);if(k<0){d(l.on_negative,l.on_positive,g,i,l,k)}else{d(l.on_positive,l.on_negative,g,i,l,k)}if(l.cloak){if(l.in_dom){i.attr("data-noblecount",k)}}else{i.text(k)}if(!h&&jQuery.isFunction(l.on_update)){l.on_update(g,i,l,k)}}function d(i,g,h,j,l,k){if(i!=null){if(typeof i=="string"){j.addClass(i)}else{if(jQuery.isFunction(i)){i(h,j,l,k)}}}if(g!=null){if(typeof g=="string"){j.removeClass(g)}}}})(jQuery);;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true window: true*/

var ThemeBuilder = ThemeBuilder || {};

/**
 * Singleton class that manages the advanced CSS/JS tab.
 * @class
 */
ThemeBuilder.AdvancedTab = ThemeBuilder.initClass();

/**
 * Static method to retrieve the singleton instance of the AdvancedTab.
 *
 * @return
 *   The ThemeBuilder.AdvancedTab instance.
 */
ThemeBuilder.AdvancedTab.getInstance = function () {
  if (!ThemeBuilder.AdvancedTab._instance) {
    ThemeBuilder.AdvancedTab._instance = new ThemeBuilder.AdvancedTab();
  }
  return ThemeBuilder.AdvancedTab._instance;
};

/**
 * Constructor for the ThemeBuilder.AdvancedTab class.
 */
ThemeBuilder.AdvancedTab.prototype.initialize = function () {
  if (ThemeBuilder.AdvancedTab._instance) {
    throw "ThemeBuilder.AdvancedTab is a singleton that has already been instantiated.";
  }
  this.panes = {};
  this.subtabs = [];
  this.subtabs.push({id: 'themebuilder-advanced-history',
    obj: ThemeBuilder.History.getInstance()});
  this.subtabs.push({id: 'themebuilder-advanced-css',
    obj: ThemeBuilder.CodeEditor.getInstance()});
  this.currentSubtab = 0;
};

/**
 * Initializes the UI of the advanced tab.  Called automagically from
 * ThemeBuilder.Bar.prototype.tabResourcesLoaded.
 */
ThemeBuilder.AdvancedTab.prototype.init = function () {
  var $ = jQuery;
  var tabs = $('#themebuilder-advanced');
  tabs.tabs({
    show: ThemeBuilder.bind(this, this.showSubtab),
    select: ThemeBuilder.bind(this, this.selectSubtab)
  });

  // Initialize the subtabs
  for (var i = 0, len = this.subtabs.length; i < len; i++) {
    this.subtabs[i].obj.init();
  }
};

/**
 * Invoked when the Advanced tab is selected.
 */
ThemeBuilder.AdvancedTab.prototype.show = function () {
  this.subtabs[this.currentSubtab].obj.show();
};

/**
 * Invoked when the user traverses to a different tab.
 */
ThemeBuilder.AdvancedTab.prototype.hide = function () {
  return this.subtabs[this.currentSubtab].obj.hide();
};

/**
 * Invoked when the contents of the advanced tab are loaded.
 */
ThemeBuilder.AdvancedTab.prototype.loaded = function () {
  for (var i = 0; i < this.subtabs.length; i++) {
    if (this.subtabs[i].obj.loaded) {
      this.subtabs[i].obj.loaded();
    }
  }
};

/**
 * This is the callback that is invoked when a subtab is shown.  This
 * method figures out which tab was selected and informs the old tab
 * and the new tab of the change.  This allows cleanup to occur.
 *
 * @param {Event} event
 *   The event
 * @param {Tab} tab
 *   The jquery-ui tab object, which reveals which tab is being shown.
 */
ThemeBuilder.AdvancedTab.prototype.showSubtab = function (event, tab) {
  var newTab = this._getTab(tab);
  if (newTab !== -1) {
    this._switchTabs(this.currentSubtab, newTab);
  }
};

/**
 * This callback is invoked when a tab is selected.  Selection occurs
 * before the tab is shown, and is an opportunity for a tab controller
 * to prompt the user to commit changes if needed.
 *
 * @param {Event} event
 *   The event
 * @param {Tab} tab
 *   The jquery-ui tab object, which reveals which tab is being selected.
 * @return {boolean}
 *   true if it is ok to traverse away from the current tab; false otherwise.
 */
ThemeBuilder.AdvancedTab.prototype.selectSubtab = function (event, tab) {
  var obj = this.subtabs[this.currentSubtab].obj;
  if (obj.select) {
    return obj.select(event, tab);
  }
  return true;
};

/**
 * Returns the tab index associated with the specified tab.
 *
 * @private
 * @param {Tab} tab
 *   The jquery-ui tab object.
 * @return {int}
 *   The tab index associated with the specified tab.
 */
ThemeBuilder.AdvancedTab.prototype._getTab = function (tab) {
  var newTab = -1;
  if (tab && tab.panel && tab.panel.id) {
    for (var i = 0, len = this.subtabs.length; i < len; i++) {
      if (this.subtabs[i].id === tab.panel.id) {
	// This is the new tab.
        newTab = i;
        break;
      }
    }
  }
  return newTab;
};

/**
 * Switches tabs from the old file to the new file.
 *
 * @private
 * @param {int} oldTab
 *   The index of the tab that is being hidden.
 * @param {int} newTab
 *   The index of the tab that is being shown.
 */
ThemeBuilder.AdvancedTab.prototype._switchTabs = function (oldTab, newTab) {
  if (oldTab !== newTab) {
    this.subtabs[oldTab].obj.hide();
  }
  if (newTab >= 0 && newTab < this.subtabs.length) {
    this.currentSubtab = newTab;
    this.subtabs[newTab].obj.show();
  }
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true window: true*/

var ThemeBuilder = ThemeBuilder || {};

/**
 * Singleton class that manages the advanced CSS subtab.  This class
 * is a singleton because it manages a particular textarea in the DOM
 * and is written in such a way that there can only be one such
 * textarea.
 * @class
 */
ThemeBuilder.CodeEditor = ThemeBuilder.initClass();

/**
 * Static method to retrieve the singleton instance of the CodeEditor.
 *
 * @return
 *   The ThemeBuilder.CodeEditor instance.
 */
ThemeBuilder.CodeEditor.getInstance = function () {
  if (!ThemeBuilder.CodeEditor._instance) {
    ThemeBuilder.CodeEditor._instance = new ThemeBuilder.CodeEditor();
  }
  return ThemeBuilder.CodeEditor._instance;
};

/**
 * Constructor for the ThemeBuilder.CodeEditor class.  This
 * constructor should not be called directly, but instead the
 * getInstance static method should be used.
 */
ThemeBuilder.CodeEditor.prototype.initialize = function () {
  if (ThemeBuilder.CodeEditor._instance) {
    throw "ThemeBuilder.CodeEditor is a singleton that has already been instantiated.";
  }
  var $ = jQuery;
  this.panes = {};
  this.modifications = {};
  this.history = ThemeBuilder.History.getInstance();
};

/**
 * Initializes the UI of the advanced tab. Retrieves CSS from the
 * server, initializes the CSS textarea, and sets up event handlers.
 */
ThemeBuilder.CodeEditor.prototype.init = function () {
  var $ = jQuery;
  this.panes.css = new ThemeBuilder.EditPane($('#themebuilder-advanced-css textarea'), this);

  // Allow modifications to preview the CSS live in the browser by creating
  // an empty stylesheet and a way to update it on the fly.
  var stylesheet = ThemeBuilder.styles.Stylesheet.getInstance('advanced.css.live');
  this.updateStylesheet = ThemeBuilder.bind(this, this._updateStylesheet, stylesheet);

  // Handle the custom 'update' jQuery event.
  this.panes.css.editor.bind('update', ThemeBuilder.bind(this, this.handleUpdate));

  // TODO: AN-25510 - Enable the custom scroll bar.  The markup for
  // the textarea needs to change, moving the scrollpane class to an
  // enclosing div, and we need to force the height of the textarea
  // element such that it will not have its own scrollbar.
  // $('#themebuilder-wrapper .scrollpane').jScrollPane();
  // $('#themebuilder-advanced-css .scrollpane').bind('keyup', ThemeBuilder.bind(this, this.keyUp));

  // Create the palette cheat sheet, and update it when the palette changes.
  this.loadPalette();
  $('#themebuilder-style').bind('paletteChange', ThemeBuilder.bind(this, this.loadPalette));

  $('#advanced-update-button').click(ThemeBuilder.bind(this, this.updateButtonPressed));
  ThemeBuilder.addModificationHandler(ThemeBuilder.codeEditorModification.TYPE, this);
  this.loadAdvancedCss();
};

// Not used yet, in preparation for custom themed scrollbars.
ThemeBuilder.CodeEditor.prototype.keyUp = function (event) {
  var $ = jQuery;
  var $textarea = $('#themebuilder-advanced-css textarea');
  $textarea.css('height', '1px');
  $textarea.css('height', (String(25 + $textarea.attr('scrollHeight') + 'px')));
  $('#themebuilder-advanced-css .scrollpane').data('jsp').reinitialise();
};

/**
 * Causes the advanced.css file to be loaded, and its contents to be placed in
 * the editor.
 */
ThemeBuilder.CodeEditor.prototype.loadAdvancedCss = function () {
  var $ = jQuery;
  $.get(Drupal.settings.basePath + Drupal.settings.themeEditorPaths[Drupal.settings.currentTheme] + '/advanced.css',
    ThemeBuilder.bind(this, this.advancedCssLoaded));
};

/**
 * A callback function that puts the specified css text into the editor and
 * initializes the Modification instance for undo purposes.
 *
 * @param {String} cssText
 *   The css text to put into the editor.
 */
ThemeBuilder.CodeEditor.prototype.advancedCssLoaded = function (cssText) {
  var $ = jQuery;
  $('#themebuilder-advanced-css textarea').val(cssText);
  this.modifications.css = new ThemeBuilder.codeEditorModification('css');
  this.modifications.css.setPriorState(cssText);
};

/**
 * Handle the custom 'update' event.
 *
 * Note that we only trigger the update event when the user has deliberately
 * made a change to the textarea, by typing or clicking on a palette swatch.
 * It is not automatically triggered when the textarea value changes
 * programmatically (such as after the user clicks 'undo').
 *
 * @param {object} event
 *   The event that carries the new value in the text area.
 */
ThemeBuilder.CodeEditor.prototype.handleUpdate = function (event) {
  event.stopPropagation();
  this.modifications.css.setNewState(event.currentTarget.value);
  // Disable undo until the user has sent their changes to the server.
  if (this.isDirty()) {
    if (!this.statusKey) {
      this.statusKey = ThemeBuilder.undoButtons.disable();
    }
  }
  else if (this.statusKey) {
    ThemeBuilder.undoButtons.clear(this.statusKey);
    delete this.statusKey;
  }
  this.setUpdateButtonState();
  this.preview(this.modifications.css.getNewState());
};

/**
 * Updates the stylesheet to match the specified CSS document.
 *
 * @private
 * @param {string} cssText
 *   The text representing the CSS document to apply.
 * @param {object} stylesheet
 *   The stylesheet to which the modifications will be applied.
 */
ThemeBuilder.CodeEditor.prototype._updateStylesheet = function (cssText, stylesheet) {
  stylesheet.setCssText(cssText);
};

/**
 * Invoked when a different tab is selected.
 */
ThemeBuilder.CodeEditor.prototype.hide = function () {
  return this.select();
};

/**
 * Invoked when the Advanced tab is selected.  This function is used to cause
 * the advanced css text to be loaded and an appropriate modification object
 * initialized representing the advanced css prior state.
 */
ThemeBuilder.CodeEditor.prototype.show = function () {
  var $ = jQuery;
  $('#themebuilder-wrapper #themebuilder-advanced .palette-cheatsheet').removeClass('hidden');
  if ($('#themebuilder-wrapper #themebuilder-advanced .layout-cheatsheet')) {
    $('#themebuilder-wrapper #themebuilder-advanced .layout-cheatsheet').addClass('hidden');
  }
  this.setUpdateButtonState();
};

/**
 * Invoked when the Custom CSS subtab is clicked, before the panel is
 * shown.  This callback is used to check to see if the textarea is
 * dirty, and if so, prompt the user to save or lose changes.
 *
 * @return {Boolean}
 *   Always returns true, indicating it is ok to move off of the tab.
 */
ThemeBuilder.CodeEditor.prototype.select = function () {
  var updateChanges = false;
  var $ = jQuery;
  if (this.isDirty()) {
    updateChanges = confirm(Drupal.t('Would you like to commit your changes?'));
  }
  if (updateChanges) {
    this.updateButtonPressed();
  }
  else if (this.modifications.css) {
    // The user chose not to save the changes.  Revert the changes.
    this.preview(this.modifications.css.getPriorState());
    $('#themebuilder-advanced-css textarea').val(this.modifications.css.getPriorState().code);
  }
  if (this.statusKey) {
    // Allow undo and redo buttons to be used again.
    ThemeBuilder.undoButtons.clear(this.statusKey);
    delete this.statusKey;
  }
  this.setUpdateButtonState();
  return true;
};

/**
 * Preview the changes.
 *
 * @param {object} state
 *   The state of the modification to preview.
 * @param {Modification} modification
 *   Optional parameter that provides the modification object.  This will be
 *   provided when undoing or redoing a change.
 */
ThemeBuilder.CodeEditor.prototype.preview = function (state, modification) {
  if (this.panes[state.selector].editor.val() !== state.code) {
    this.panes[state.selector].changed = true;
    this.panes[state.selector].buffer = state.code;
  }

  this.updateStylesheet(state.code);

  // The modification needs to be reset if this is the result of an
  // undo.
  if (modification) {
    this.panes[state.selector].editor.val(state.code);
    this.modifications.css = new ThemeBuilder.codeEditorModification('css');
    this.modifications.css.setPriorState(state.code);
    this.modifications.css.setNewState(state.code);
    this.setUpdateButtonState();
  }
};

/**
 * Load the current palette colors into the palette cheatsheet.
 */
ThemeBuilder.CodeEditor.prototype.loadPalette = function () {
  var $ = jQuery;
  var colorManager = ThemeBuilder.getColorManager();
  if (!colorManager.isInitialized()) {
    // Cannot initialize yet.  We need the color manager to be fully initialized
    // first.
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this.loadPalette), 50);
    return;
  }
  this.addColorSwatches($('#themebuilder-advanced .palette-cheatsheet table.palette-colors'), colorManager.getPalette().mainColors, 'palette-swatch-');
  this.addColorSwatches($('#themebuilder-advanced .palette-cheatsheet table.custom-colors'), colorManager.getCustom().colors, 'custom-swatch-');
};

/**
 * Adds the specified color swatches to the specified table.
 *
 * @param {jQuery} $table
 *   The jQuery object representing the table to add the color swatches to.
 * @param {Object} colors
 *   An object containing the set of colors to add.
 * @param {String} classPrefix
 *   The prefix to use for the classname for each of the color items.
 */
ThemeBuilder.CodeEditor.prototype.addColorSwatches = function ($table, colors, classPrefix) {
  var $ = jQuery;
  $table.html('');
  var current_row = $('<tr></tr>').appendTo($table);
  var i = 0;
  var key, td, hex;
  for (key in colors) {
    if (typeof(key) === 'string') {
      // Create a table cell with a palette color swatch in it.
      td = $('<td class="index"><div class="color-swatch palette-swatch-' + i + '" style="background-color:#' + colors[key].hex + '"></div><div class="color-swatch-label ' + classPrefix + i + '">#' + colors[key].hex + '</div></td>\n');
      td.appendTo(current_row);
/*
      // Update the textarea when the palette swatch is clicked.
      hex = '#' + colors[key].hex;
      $('.' + classPrefix + i).bind('click', ThemeBuilder.bindIgnoreCallerArgs(this, this.insertText, hex, 'css'));
*/
      // Add another table row if necessary.
      if (i % 2 !== 0) {
        current_row = $('<tr></tr>').appendTo($table);
      }
      i++;
    }
  }
};

/**
 * Insert text into one of the editPane instances.
 *
 * @param {string} text
 *   The text to be inserted.
 * @param {string} type
 *   The type of editPane (e.g. 'css') into which to insert the text.
 */
ThemeBuilder.CodeEditor.prototype.insertText = function (text, type) {
  if (this.panes[type]) {
    var pane = this.panes[type];
    pane.insertAtCursor(text);
    pane.editor.trigger('update');
  }
};

/**
 * Invoked when the update button is clicked.  This method will commit any
 * changes to the server.
 */
ThemeBuilder.CodeEditor.prototype.updateButtonPressed = function () {
  var prior = this.modifications.css.getPriorState().code;
  var next = this.modifications.css.getNewState().code;
  if (prior !== next) {
    ThemeBuilder.applyModification(this.modifications.css);
    this.modifications.css = this.modifications.css.getFreshModification();
    this.modifications.css.setNewState(next);
  }
  if (this.statusKey) {
    // The user just committed a change.  It is ok for them to undo that
    // change now.  You cannot undo during active edit though.  Only when
    // there are no uncommitted changes.
    ThemeBuilder.undoButtons.clear(this.statusKey);
    delete this.statusKey;
  }
  this.setUpdateButtonState();
};

/**
 * Enables or disables the update button depending on if the editor contents
 * have been changed.
 */
ThemeBuilder.CodeEditor.prototype.setUpdateButtonState = function () {
  var $ = jQuery;
  if (this.isDirty()) {
    $('#advanced-update-button').removeClass('disabled');
  }
  else {
    $('#advanced-update-button').addClass('disabled');
  }
};

/**
 * Indicates if the current editor contents differ from the last saved contents.
 * This is useful in knowing whether the undo / redo buttons should be enabled
 * or if we should hassle the user about updating before traversing away from
 * the advanced editor tab.
 *
 * @return {boolean}
 *   True if the editor contents have not been committed to the server; false
 *   otherwise.
 */
ThemeBuilder.CodeEditor.prototype.isDirty = function () {
  if (this.modifications.css) {
    var $ = jQuery;

    var textAreaValue = $('#themebuilder-advanced-css textarea').val();
    textAreaValue = this._standardizeLineEndings(textAreaValue);

    var priorState = this.modifications.css.getPriorState().code;
    priorState = this._standardizeLineEndings(priorState);

    return textAreaValue !== priorState;
  }
  return false;
};

/**
 * Convert all line endings in the given text to Unix newlines (\n).
 *
 * @private
 * @param {string} text
 *   The text to standardize.
 *
 * @return {string}
 *   The text with Unix line endings.
 */
ThemeBuilder.CodeEditor.prototype._standardizeLineEndings = function (text) {
  // Windows line endings are carriage return + line feed (\r\n). See if
  // a carriage return exists in the text.
  var textAreaValueIndex = text.indexOf('\r');
  // Convert Windows line endings to Unix line endings (\n) by removing any
  // carriage returns.
  if (textAreaValueIndex !== -1) {
    var strReplace = text;
    while (textAreaValueIndex !== -1) {
      strReplace = strReplace.replace('\r', '');
      textAreaValueIndex = strReplace.indexOf('\r');
    }
    text = strReplace;
  }
  return text;
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true */

var ThemeBuilder = ThemeBuilder || {};

/**
 * The editPane class represents a textarea in which users can enter code.
 * @class
 */
ThemeBuilder.EditPane = ThemeBuilder.initClass();

/**
 * Initializes a new code editing pane.
 *
 * @param {jQuery} editingTextArea
 *   A jQuery object representing the textarea.
 * @param {CodeEditor} codeEditor
 *   The ThemeBuilder.CodeEditor object associated with this textarea.
 */
ThemeBuilder.EditPane.prototype.initialize = function (editingTextArea, codeEditor) {
  this.codeEditor = codeEditor;
  this.editor = editingTextArea; //This is the actual textarea we are operating on.
  this.buffer = null;
  this.changed = false;
  this.timer = 0;
  this.editor.bind('keyup', ThemeBuilder.bind(this, this.handleKeyUp));
  this.editor.bind('change', ThemeBuilder.bind(this, this.update));
  this.editor.keydown(ThemeBuilder.bind(this, this.handleKeyDown));
};

/**
 * Handle the keyup event.
 */
ThemeBuilder.EditPane.prototype.handleKeyUp = function () {
  clearTimeout(this.timer); // Clear the timeout if a keypress occurs before the timer callback fired
  var keyPressUpdate = ThemeBuilder.bindIgnoreCallerArgs(this, this.update);
  this.timer = setTimeout(keyPressUpdate, 450); // Update the page after 450ms
};

/**
 * Handler for the keydown event. Inserts two spaces if the tab key is pressed.
 *
 * @param {event} e
 *   The keydown event.
 *
 * @return {boolean}
 *   False if the tab key was pressed, true if any other key was pressed.
 */
ThemeBuilder.EditPane.prototype.handleKeyDown = function (e) {
  if (e.keyCode === 9) {
    this.insertAtCursor('  ');
    // Prevent the default tab key event from propagating (we don't want to
    // move to the next tabindex).
    return false;
  }
  return true;
};

/**
 * Called after every keyUp; triggers the custom 'update' event on the textarea.
 */
ThemeBuilder.EditPane.prototype.update = function () {
  if (this.buffer === this.editor.val()) {
    // No change, so nothing to do.
    return true;
  }

  this.changed = true;
  this.buffer = this.editor.value;
  this.editor.trigger('update');
};

/**
 * Insert text into the textarea at the current cursor location.
 *
 * @param {string} text
 *    The text to be inserted.
 */
ThemeBuilder.EditPane.prototype.insertAtCursor = function (text) {
  var textarea = this.editor.get(0);
  var top = textarea.scrollTop;
  var where = this._caret();
  if (document.selection) {
    textarea.focus();
    var sel = document.selection.createRange();
    sel.text = text;
  }
  else if (textarea.selectionStart || textarea.selectionStart === '0') {
    var startPos = textarea.selectionStart;
    var endPos = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos, textarea.value.length);
  } else {
    textarea.value += text;
  }
  textarea.scrollTop = top;
  this._setSelRange(where + text.length, where + text.length);
};

/**
 * Determine the current location of the cursor.
 *
 * @private
 */
ThemeBuilder.EditPane.prototype._caret = function () {
  var node = this.editor.get(0);
  if (node.selectionStart) {
    return node.selectionStart;
  }
  else if (!document.selection) {
    return 0;
  }
  var c = String.fromCharCode(1);
  var sel = document.selection.createRange();
  var dul = sel.duplicate();
  var len = 0;
  dul.moveToElementText(node);
  sel.text = c;
  len = (dul.text.indexOf(c));
  sel.moveStart('character', -1);
  sel.text = "";
  return len;
};

/**
 * Set the current selection in the textarea.
 *
 * @param selStart
 *   The beginning of the desired selection.
 * @param selEnd
 *   The end of the desired selection.
 *
 * @private
 */
ThemeBuilder.EditPane.prototype._setSelRange = function (selStart, selEnd) {
  var inputEl = this.editor.get(0);
  if (inputEl.setSelectionRange) {
    inputEl.focus();
    inputEl.setSelectionRange(selStart, selEnd);
  } else if (inputEl.createTextRange) {
    var range = inputEl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selEnd);
    range.moveStart('character', selStart);
    range.select();
  }
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true window: true*/

var ThemeBuilder = ThemeBuilder || {};

/**
 * The CustomStyleManager class is responsible for requesting and managing the update of custom styles.
 * @class
 */
ThemeBuilder.CustomStyleManager = ThemeBuilder.initClass();

/**
 * Returns the CustomStyleManager instance.  If the instance has not
 * been created yet, it will be created as a result of this call.
 * 
 * @return {CustomStyleManager}
 *   The CustomStyleManager instance.
 */
ThemeBuilder.CustomStyleManager.getInstance = function () {
  if (!ThemeBuilder.CustomStyleManager._instance) {
    ThemeBuilder.CustomStyleManager._instance = new ThemeBuilder.CustomStyleManager();
  }
  return ThemeBuilder.CustomStyleManager._instance;
};

/**
 * Constructor for the CustomStyleManager class.
 *
 * @private
 */
ThemeBuilder.CustomStyleManager.prototype.initialize = function () {
  var $ = jQuery;
  $(window).bind('ModificationCommitted', ThemeBuilder.bind(this, this._commit));
};

/**
 * Requests all custom styles from the server.
 *
 * These styles cannot be taken from the stylesheet alone because the
 * styles for properties dealing with color all appear in the palette
 * stylesheet only, which is a mixture of custom styles and styles
 * from the base theme.
 *
 * When the styles are retrieved, interested parties will be notified
 * by sending a 'css-history-contents-changed' event, which is
 * attached to the themebuilder wrapper element.
 */
ThemeBuilder.CustomStyleManager.prototype.requestCustomStyles = function () {
  if (Drupal.settings.themebuilderGetCustomCss) {
    var history = ThemeBuilder.History.getInstance();
    ThemeBuilder.postBack(Drupal.settings.themebuilderGetCustomCss, {}, ThemeBuilder.bind(this, this._cssDataReceived));
  }
};

/**
 * Called when the custom style data is received from the server.
 *
 * @private
 * @param {Object} data
 *   An object containing selectors mapped to objects representing all
 *   of the properties and values associated with those selectors.
 */
ThemeBuilder.CustomStyleManager.prototype._cssDataReceived = function (data) {
  this.styles = new ThemeBuilder.CustomStyles(data);
  var $ = jQuery;
  $('#themebuilder-wrapper').trigger('css-history-contents-changed', this.styles);
};


/**
 * This method is called when a modification is committed.
 * 
 * When this method is called, the specified modification is
 * integrated into the Css history data, and the changes are pushed to
 * interested listeners (such as the History UI).
 *
 * @private
 * @param {Event} event
 *   The event associated with the commit.  This event generally is not used.
 * @param {Modification} modification
 *   The modification that was committed.
 * @param {String} operation
 *   One of 'apply', 'redo', or 'undo', which indicates whether the
 *   modification is being applied or reverted.
 */
ThemeBuilder.CustomStyleManager.prototype._commit = function (event, modification, operation) {
  var data = this.styles.getData();
  switch (operation) {
  case 'apply':
  case 'redo':
    if (modification.getType() === ThemeBuilder.CssModification.TYPE ||
       modification.getType() === ThemeBuilder.GroupedModification.TYPE) {
      this._applyModificationState(modification.getNewState(), data);
    }
    break;
  case 'undo':
    if (modification.getType() === ThemeBuilder.CssModification.TYPE ||
       modification.getType() === ThemeBuilder.GroupedModification.TYPE) {
      this._applyModificationState(modification.getPriorState(), data);
    }
    break;    
  }
  setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this._cssDataReceived, data), 100);
};

/**
 * Applies the specified modification state (either next or prev) to the specified data set.
 * 
 * This method is responsible for updating the data to reflect the
 * modification that was just applied.
 * 
 * @private
 * @param {Object} state
 *   The modification state to apply to the specified data set.
 * @param {Object} data
 *   The data set to apply the modification state to.
 * @return {Object}
 *   The updated data.
 */
ThemeBuilder.CustomStyleManager.prototype._applyModificationState = function (state, data) {
  if (state instanceof Array) {
    // The state could be an array of the original modification was of
    // type GroupedModification.
    for (var i = 0, len = state.length; i < len; i++) {
      data = this._applyModificationState(state[i], data);
    }
  }
  else {
    // This is a single modification.
    if (state.value) {
      // Ensure there is an object associated with the selector.
      if (!data[state.selector]) {
        data[state.selector] = {};
      }
      data[state.selector][state.property] = state.value;
    }
    else {
      // The state indicates the property should be entirely removed
      // from custom styling.
      if (data[state.selector]) {
        delete data[state.selector][state.property];
      }

      // If the selector has no properties associated with it, remove
      // the selector from the data also.
      var count = 0;
      for (var property in data[state.selector]) {
        if (data[state.selector].hasOwnProperty(property)) {
          count++;
	  // No point in processing all of them; one is enough to keep
	  // the selector.
          break;
        }
      }
      if (count === 0) {
        // All of the properties have been deleted.
        delete data[state.selector];
      }
    }
  }
  return data;
};

/**
 * The CustomStyles class is responsible for containing raw style data and exposing it in a useful manner.
 * 
 * One of the most interesting responsibilities of this class is to
 * provide the data in a useful order.
 * @class
 */
ThemeBuilder.CustomStyles = ThemeBuilder.initClass();

/**
 * The constructor.
 *
 * @private
 * @param {Object} data
 *   The object containing the raw custom style data.
 */
ThemeBuilder.CustomStyles.prototype.initialize = function (data) {
  this.setData(data);
};

/**
 * Sets the data into this CustomStyles instance.
 *
 * Sorts the data and adjusts the internal state of this instance to
 * correspond to the new data set.
 * 
 * @param {Object} data
 *   the object containing the raw custom style data.
 */
ThemeBuilder.CustomStyles.prototype.setData = function (data) {
  var scoreMap = {};    
  var selectors = [];
  for (var selector in data) {
    if (data.hasOwnProperty(selector)) {
      scoreMap[selector] = ThemeBuilder.Specificity.getScore(selector);
      selectors.push(selector);
    }
  }
  this.data = data;
  this.selectors = selectors;
  this.scoreMap = scoreMap;

  this.selectors.sort(ThemeBuilder.bind(this, this.selectorSort));
};

/**
 * Returns the internal data used by this CustomStyles instance.
 *
 * @return {Object}
 *   The raw data.
 */
ThemeBuilder.CustomStyles.prototype.getData = function () {
  return this.data;
};

/**
 * Comparison function used for sorting selectors.
 *
 * The selectors must have been populated into this instance before
 * using this function.  The specified selectors are not actually
 * compared, but rather their specificity scores are compared to
 * determine the appropriate order.
 *
 * @param {String} a
 *   The first selector.
 * @param {String} b
 *   The second selector.
 */
ThemeBuilder.CustomStyles.prototype.selectorSort = function (a, b) {
  var result = String(this.scoreMap[a]).localeCompare(this.scoreMap[b]);
  if (result === 0) {
    if (this.scoreMap[a].toString() === '000,000,000,001') {
      // They have the same specificity and the selector represents an
      // element or a pseudoelement.
      result = this.getElementRank(a) - this.getElementRank(b);
    }
    if (result === 0) {
      // They have the same specificity.  Sort by length instead (shortest first).
      result = a.length - b.length;
      if (result === 0) {
        // They have the same length.  Sort in alphabetical order instead.
        result = String(a).localeCompare(b);
      }
    }
  }
  return result;
};

ThemeBuilder.CustomStyles._elementRanks = [
  // Document
  'html',
  'body',

  // Block
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'address',
  'blockquote',
  'del',
  'hr',
  'pre',
  'ins',
  'noscript',
  'center',
  'table',
  'legend',
  'thead',
  'tfoot',
  'col',
  'colgroup',
  'th',
  'tbody',
  'tr',
  'td',
  'caption',
  'form',
  'fieldset',
  'textarea',

  // Inline
  'menu',
  'input',
  'select',
  'option',
  'optgroup',
  'button',
  'label',
  'img',
  'a',
  'span',
  'abbr',
  'acronym',
  'cite',
  'em',
  'i',
  'strong',
  'b',
  'sub',
  'sup',
  'small',
  'big',
  'strike',
  'q',
  'var',
  'samp',
  'code',
  'br',
  'font'
];

/**
 * Returns the rank of the specified element.
 * 
 * This is used to sort selectors that have a specificity of
 * 000,000,000,001 such that the most general elements appear near the
 * top and more specific ones appear later.
 * 
 * @param {String} element
 *   The selector describing an element.
 * @return {int}
 *   The rank.
 */
ThemeBuilder.CustomStyles.prototype.getElementRank = function (element) {
  var result;
  if (!ThemeBuilder.CustomStyles._elementRankMap) {
    // Build a map that makes it efficient to rank the elements.
    var rank = 0;
    ThemeBuilder.CustomStyles._elementRankMap = {};
    for (var i = 0, len = ThemeBuilder.CustomStyles._elementRanks.length; i < len; i++) {
      ThemeBuilder.CustomStyles._elementRankMap[ThemeBuilder.CustomStyles._elementRanks[i]] = rank++;
    }
  }
  result = ThemeBuilder.CustomStyles._elementRankMap[element];
  if (undefined === result) {
    result = ThemeBuilder.CustomStyles._elementRankMap.length + 1;
  }
  return result;
};

/**
 * Returns an iterator that can be used to visit each of the selectors in the custom CSS data in either ascending or descending order.
 * 
 * @param {Boolean} asc
 *   Optional argument that indicates whether the sort should be
 *   ascending (true) or descending (false).  Ascending sort is
 *   done by default.
 * @return {Iterator}
 *   An iterator that traverses over the set of selectors.
 */
ThemeBuilder.CustomStyles.prototype.getIterator = function (asc) {
  return new ThemeBuilder.CustomStyleSelectorIterator(this, asc);
};

/**
 * Returns an iterator that can be used to visit each of the properties of the specified selector.
 * 
 * @param {Boolean} selector
 *   The selector
 * @return {Iterator}
 *   An iterator that traverses over the set of properties.
 */
ThemeBuilder.CustomStyles.prototype.getPropertyIterator = function (selector) {
  return new ThemeBuilder.PropertyIterator(this.data[selector]);
};

/**
 * The CustomStyleSelectorIterator iterates over a set of selectors.
 * @class
 */
ThemeBuilder.CustomStyleSelectorIterator = ThemeBuilder.initClass();

/**
 * Constructor for the CustomStyleSelectorIterator.
 *
 * The iterator traverses over the set of selectors in ascending or
 * descending order based on the selector's specificity.
 *
 * @param {CustomStyles} styles
 *   The CustomStyles instance this iterator uses as data.
 * @param {Boolean} asc
 *   If true, the selectors will be traversed in ascending order.
 *   Otherwise the traversal will be in descending order.
 */
ThemeBuilder.CustomStyleSelectorIterator.prototype.initialize = function (styles, asc) {
  if (true !== asc && false !== asc) {
    asc = true;
  }
  this.asc = asc;
  this.styles = styles;
  this.index = (this.asc ? 0 : styles.selectors.length - 1);
};

/**
 * Indicates whether there is another selector in the set.
 * 
 * @return {Boolean}
 *   true if there is another element; false otherwise.
 */
ThemeBuilder.CustomStyleSelectorIterator.prototype.hasNext = function () {
  var hasNext = this.index >= 0 && this.index < this.styles.selectors.length;
  return hasNext;
};

/**
 * Returns the next selector in the list.
 * 
 * @return {Object}
 *   The next selector and its associated properties.  This is in the
 *   form of an object that contains fields for the selector {String}
 *   and the properties {iterator}.
 */
ThemeBuilder.CustomStyleSelectorIterator.prototype.next = function () {
  if (this.hasNext()) {
    var selector = this.styles.selectors[this.index];
    var properties = this.styles.data[selector];
    this.index = this.asc ? this.index + 1 : this.index - 1;

    return {selector: selector, properties: new ThemeBuilder.PropertyIterator(properties)};
  }
  return null;
};

/**
 * The PropertyIterator class is responsible for iterating over the set of properties associated with a single CSS selector.
 * @class
 */
ThemeBuilder.PropertyIterator = ThemeBuilder.initClass();

/**
 * Constructor for the PropertyIterator class.
 * 
 * @param {Object} properties
 *   Raw property data associated with a particular CSS selector.
 */
ThemeBuilder.PropertyIterator.prototype.initialize = function (propertyData) {
  this.propertyData = propertyData;
  this.properties = [];
  for (var property in this.propertyData) {
    if (this.propertyData.hasOwnProperty(property)) {
      this.properties.push(property);
    }
  }
  this.properties.sort();
  this.index = 0;
};

/**
 * Indicates whether there is another property in the set.
 * 
 * @return {Boolean}
 *   true if there is another element; false otherwise.
 */
ThemeBuilder.PropertyIterator.prototype.hasNext = function () {
  var hasNext = this.index >= 0 && this.index < this.properties.length;
  return hasNext;
};

/**
 * Returns the next property in the list.
 * 
 * @return {Object}
 *   The next property name and value.  This is in the
 *   form of an object that contains fields for the name {String}
 *   and the value {String}.
 */
ThemeBuilder.PropertyIterator.prototype.next = function () {
  if (this.hasNext()) {
    var name = this.properties[this.index];
    this.index++;
    return {name: name, value: this.propertyData[name]};
  }
  return null;
};

/**
 * The Specificity object has static methods that calculate the specificity value for a given selector.
 */
ThemeBuilder.Specificity = {};

/**
 * Calculates the specificity score for the specified selector.
 *
 * This score is returned in object form, but has a toString method
 * that will provide a suitable form with which specificities can be
 * compared with a simple string sort.  The object also has a compare
 * method that allows you to easily compare the value with another
 * specificity score.
 *
 * @param {String} selector
 *   The CSS selector to calculate the specificity score from.
 * @return {SpecificityScore}
 *   An object containing specificity components a (style from the
 *   element), b (number of ids in the selector), c (the number of
 *   classes in the selector, including pseudoclasses), and d (the
 *   number of elements in the selector, including pseudoelements).
 *   This object also contains a toString method that provides the
 *   data in an easily comparable string format.
 */
ThemeBuilder.Specificity.getScore = function (selector) {
  var score = new ThemeBuilder.SpecificityScore(0, 0, 0, 0);
  /* @see AN-16195 - selector occassionally arrives set to an empty string. */ 
  if (selector) {
    var chunks = ThemeBuilder.Specificity._getSelectorChunks(selector.toLowerCase());
    for (var i = 0, len = chunks.length; i < len; i++) {
      var chunk = chunks[i];
      ThemeBuilder.Specificity._addChunk(chunk, score);
    }
  }
  return score;
};

/**
 * Breaks the specified selector into selector chunks.
 *
 * For example, the selector 'h2 .active li' would return ['h2',
 * '.active', 'li'].  Another example shows a more complex selector:
 * 'h2 a#id.active>li' returns ['h2', 'a#id.active', 'li'].  This
 * breaks down the problem into discreet chunks that can be evaluated.
 * The total specificity score is simply the sum of its constituent
 * chunks.
 *
 * @private
 * @param {String} selector
 *   The CSS selector.
 * @return {Array}
 *   An array with each element containing the discreet parts of the
 *   selector.
 */
ThemeBuilder.Specificity._getSelectorChunks = function (selector) {
  var chunks = selector.match(new RegExp("([^\\s+>~]+)", 'g'));
  return chunks;
};

/**
 * Calculates the specificity value for the specified chunk and then increments the specified specificity score accordingly.
 *
 * This is where all the magic happens.  The guts of this selector
 * chunk are parsed and the value determined.  This value is added to
 * the specified value, creating the running total.
 *
 * @private
 * @param {String} chunk
 *   The css chunk.
 * @param {SpecificityScore} score
 *   This object contains the cumulative specificity value for the
 *   entire selector.  Each selector chunk should be passed through
 *   this function and the total value of the selector is the sum of
 *   the values of all of the chunks.
 */
ThemeBuilder.Specificity._addChunk = function (chunk, score) {
  var name;

  for (var i = 0, len = chunk.length; i < len; i++) {
    switch (chunk.charAt(i)) {
      
    case '*':
      break;

    case '#':
      // Element id
      score.b++;
      break;

    case '.':
      // Element class
      score.c++;
      break;

    case '[':
      // Element attribute (counted as a class)
      var bIndex = chunk.indexOf(']', i);
      if (bIndex > i) {
        i = bIndex;
        score.c++;
      }
      break;

    case ':':
      // Pseudoelement or pseudoclass.
      if (chunk.substr(i, 2) === '::') {
        // This is a pseudoelement, not a pseudoclass.  Skipping past the
        // extra ':' because browsers must continue to support the
        // single colon form.
        i++;
      }
      name = ':';
      var n = i + 1;
      for (; n < len && chunk.charAt(n) !== '#' &&
             chunk.charAt(n) !== '.' && chunk.charAt(n) !== ':'; i++, n++) {
        name += chunk.charAt(n);
      }
      if (ThemeBuilder.Specificity._isPseudoClass(name)) {
        score.c++;
      }
      else if (ThemeBuilder.Specificity._isPseudoElement(name)) {
        score.d++;
      }
      break;

    default:
      // Element by tag name
      if (i === 0) {
        score.d++;
      }
    }
  }
};

/**
 * These are the pseudoclasses.
 *
 * There are actually a few more but we probably don't need them and
 * this simple parser wasn't written to handle the ones that contain
 * parenthesis, so they were omitted from this list.
 */
ThemeBuilder.Specificity._pseudoclasses = [
  ':link',
  ':visited',
  ':hover',
  ':active',
  ':focus',
  ':target',
  ':enabled',
  ':disabled',
  ':checked',
  ':indeterminate',
  ':root',
  ':first-child',
  ':last-child',
  ':first-of-type',
  ':last-of-type',
  ':only-child',
  ':empty'
];

/**
 * These are the pseudoelements.
 *
 * Pseudoelements are supposed to be prefixed with 2 colons, but
 * browsers must accept the single colon form also.  In the parser we
 * are detecting the second colon and throwing it away to make the
 * comparison simpler and to make it handle both cases.
 */
ThemeBuilder.Specificity._pseudoelements = [
  ':first-line',
  ':first-letter',
  ':first-child',
  ':before',
  ':after'
];

/**
 * Returns true if the specified class name represents a pseudoclass
 *
 * @private
 * @param {String} name
 *   A name, possibly representing a pseudoclass.
 * @return {boolean}
 *   true if the name represents a pseudoclass; false otherwise.
 */ 
ThemeBuilder.Specificity._isPseudoClass = function (name) {
  return ThemeBuilder.Specificity._pseudoclasses.contains(name);
};

/**
 * Returns true if the specified class name represents a pseudoelement
 *
 * @private
 * @param {String} name
 *   A name, possibly representing a pseudoelement.
 * @return {boolean}
 *   true if the name represents a pseudoelement; false otherwise.
 */ 
ThemeBuilder.Specificity._isPseudoElement = function (name) {
  return ThemeBuilder.Specificity._pseudoelements.contains(name);
};

/**
 * The SpecificityScore is an object used to hold and compare specificity values for a given CSS selector.
 * @class
 */
ThemeBuilder.SpecificityScore = ThemeBuilder.initClass();

/**
 * Initializes a new instance of SpecificityScore with the specified values.
 *
 * @param {int} a
 *   1 if the element has an inline style; 0 otherwise.
 * @param {int} b
 *   The count of ids in a particular selector.
 * @param {int} c
 *   The count of classes and pseudoclasses in a particular selector.
 * @param {int} d
 *   The count of elements and pseudoelements in a particular selector.
 */
ThemeBuilder.SpecificityScore.prototype.initialize = function (a, b, c, d) {
  a = (a === undefined ? 0 : a);
  b = (b === undefined ? 0 : b);
  c = (c === undefined ? 0 : c);
  d = (d === undefined ? 0 : d);
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
};

/**
 * Compares this score with the specified specificity score.
 *
 * @param {SpecificityScore} a
 *   The first specificity score.
 * @param {SpecificityScore} b
 *   The second specificity score.
 *
 * @return {int}
 *   An integer that reveals equality or the difference in weight of
 *   the two specificity values.  A result of 0 indicates equality.
 *   '1' indicates a is greater than b, and '-1' indicates b is
 *   greater than a.
 */
ThemeBuilder.SpecificityScore.prototype.compare = function (s) {
  var components = ['a', 'b', 'c', 'd'];
  var delta;
  for (var i = 0; i < components.length; i++) {
    delta = this[components[i]] - s[components[i]];
    if (delta !== 0) {
      return delta > 0 ? 1 : -1;
    }
  }
  return 0;
};

/**
 * Converts this specificity score to a string with a format that makes comparisons easy.
 *
 * This function is not to be called directly, but rather as part of
 */
ThemeBuilder.SpecificityScore.prototype.toString = function () {
  var value = this._padNumber(this.a, 3, '0') + ',' +
  this._padNumber(this.b, 3, '0') + ',' +
  this._padNumber(this.c, 3, '0') + ',' +
  this._padNumber(this.d, 3, '0');
  return value;
};

/**
 * Pads the specified value to the specified length.
 *
 * @private
 * @param {mixed} value
 *   The value to pad.
 * @param {int} len
 *   The desired length of the value.
 * @param {String} pad
 *   The character used to pad the result.
 * @return {String}
 *   A string representation of the specified value padded to the
 *   specified length.
 */
ThemeBuilder.SpecificityScore.prototype._padNumber = function (value, len, pad) {
  var out = '' + value;
  while (out.length < len) {
    out = pad + out;
  }
  return out;
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true window: true*/

var ThemeBuilder = ThemeBuilder || {};

/**
 * @class
 */
ThemeBuilder.History = ThemeBuilder.initClass();

/**
 * Returns the only instance of the History class.
 * 
 * The History class is implemented as a singleton because it operates
 * on a particular DOM element which is referenced by ID, and as such
 * there can only be one.
 */
ThemeBuilder.History.getInstance = function () {
  if (ThemeBuilder.History._instance) {
    return ThemeBuilder.History._instance;
  }
  return new ThemeBuilder.History();
};

/**
 * Constructor for the History class.
 */
ThemeBuilder.History.prototype.initialize = function () {
  if (ThemeBuilder.History._instance) {
    throw 'ThemeBuilder.History is a singleton that has already been instantiated.';
  }
  ThemeBuilder.History._instance = this;
  var $ = jQuery;
  this.customCount = 0;
  this.hiddenCount = 0;
  if ($('#themebuilder-wrapper').length > 0) {
    $('#themebuilder-wrapper').bind('css-history-contents-changed', ThemeBuilder.bind(this, this.contentsChanged));
  }
  this.domNavigator = new ThemeBuilder.styles.PowerNavigator();
  this.domNavigator.advanced = false;
  this.hiddenModifications = {};
};

/**
 * Initializes the History object.  This entails getting the custom
 * styles to populate the display.
 */
ThemeBuilder.History.prototype.init = function () {
  if (!this.customStyleManager) {
    this.customStyleManager = ThemeBuilder.CustomStyleManager.getInstance();
    this.customStyleManager.requestCustomStyles();
  }
};

/**
 * Called when the History panel is shown.
 */
ThemeBuilder.History.prototype.show = function () {
  var $ = jQuery;
  $('#themebuilder-wrapper #themebuilder-advanced .palette-cheatsheet').addClass('hidden');
  setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this.highlight, ThemeBuilder.util.getSelector()), 500);
};

/**
 * Called when the History panel is hidden.
 * 
 * If the user moves off of this tab with hidden properties, this
 * method prompts them to show or delete those properties.
 * 
 * @return {boolean}
 *   true, indicating it is legal to move off of this tab.
 */
ThemeBuilder.History.prototype.hide = function () {
  var $ = jQuery;
  this.domNavigator.unhighlightSelection();
  var count = this.hiddenCount;
  if (count > 0) {
    var message = Drupal.formatPlural(count,
      "You left 1 attribute hidden.  Select 'OK' to delete it so that your theme remains as shown.",
      "You left @count attributes hidden. Select 'OK' to delete them so that your theme remains as shown.",
      {'@count': count});
    if (confirm(message)) {
      this.deleteAllHidden();
    }
    else {
      this.showAll();
    }
  }
  return true;
};

/**
 * Called when the contents of the history tab are loaded.
 */
ThemeBuilder.History.prototype.loaded = function () {
  var $ = jQuery;
  $('#history-show-all').click(ThemeBuilder.bind(this, this.showAll));
  $('#history-hide-all').click(ThemeBuilder.bind(this, this.hideAll));
  $('#history-delete-all-hidden').click(ThemeBuilder.bind(this, this.deleteAllHidden));
};

/**
 * This callback is called any time the history contents are
 * refreshed.  This occurs when the page is loaded and any time new
 * properties are added or deleted.
 *
 * @param {Event} event
 *   The event associated with the trigger.
 * @param {CustomStyles} styles
 *   The custom styles.
 */
ThemeBuilder.History.prototype.contentsChanged = function (event, styles) {
  var $ = jQuery;
  this.styles = styles;
  var id, selector, properties, property, $propertyRow, $selectorRow;
  var $table = $('#css-history table.body');
  if ($table.length !== 1) {
    // The history contents have arrived before the markup for the
    // advanced tab has been added to the DOM.
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this.contentsChanged, event, styles), 50);
    return;
  }

  if (!this.contentsClicked) {
    // This will only be executed once.
    this.contentsClicked = ThemeBuilder.bind(this, this._contentsClicked);
    $table.bind('click', this.contentsClicked);
  }

  // When rewriting the table contents, we insert a marker row that
  // represents the current insertion point.  We don't simply clear
  // the table and start over because the status of each row will be
  // lost (ie. whether it is being hidden or not).  We instead reuse
  // each row, moving this marker row as we go, and at the end remove
  // the marker row and all subsequent rows.
  var $markerRow = $('<tr id="history-current-row">');
  if ($table.children().first().size() === 0) {
    // Need to append the marker
    $markerRow.appendTo($table);
  }
  else {
    // Need to insert the marker
    $markerRow.insertBefore($table.children().first());
  }

  // Clear the custom count; it will be incremented as each property is added.
  this.customCount = 0;

  // Add the new contents.
  var selectors = styles.getIterator();
  var $row;
  while (selectors.hasNext()) {
    var selectorData = selectors.next();
    id = ThemeBuilder.util.getSafeClassName(selectorData.selector);
    $row = $('#selector-' + id);
    if ($row.size() === 1) {
      $row.insertBefore($markerRow);
    }
    else {
      var row =
        '<tr class="history-table-row history-selector-row" id="selector-' + id + '">' +
	'  <th title="' + Drupal.t('Highlight the CSS selector') + '" class="history-selector history-element-text">' + selectorData.selector + '</th>' +
	'  <td class="operations">' +
	'    <div title="' + Drupal.t('Delete all attributes for this CSS selector') + '" class="history-operation history-delete">' + Drupal.t('delete') + '</div>' +
	'    <div title="' + Drupal.t('Hide all attributes for this CSS selector') + '" class="history-operation history-hide">' + Drupal.t('hide') + '</div>' +
	'    <div title="' + Drupal.t('Show all attributes for this CSS selector') + '" class="history-operation history-show">' + Drupal.t('show') + '</div>' +
	'  </td>' +
	'</tr>';

      $(row).insertBefore($markerRow);
    }
    this.renderProperties(selectorData.selector, selectorData.properties);
  }

  // Remove the marker row and all subsequent rows (these represent
  // deleted properties and selectors).
  $markerRow.nextAll().remove();
  $markerRow.remove();

  // If there is no current selection, change the title of the history panel.
  if ($('.history-selected').size() === 0) {
    $('#history-title-selector').text('');
  }

  this.fixSelectorOperations();
  this.fixGlobalButtons();
};

/**
 * Renders the specified properties.
 * 
 * @param {String} selector
 *   The CSS selector the properties are associated with.
 * @param {Iterator} properties
 *   The iterator used to visit an ordered list of the properties associated with a CSS selector.
 */
ThemeBuilder.History.prototype.renderProperties = function (selector, properties) {
  var $ = jQuery;
  var id, property, $propertyRow;
  var $markerRow = $('#history-current-row');
  var colorManager = ThemeBuilder.getColorManager();
  var palette = (colorManager.isInitialized() ? colorManager.getPalette() : undefined);
  while (properties.hasNext()) {
    property = properties.next();
    if (palette && property.name.indexOf('color') !== -1) {
      var colorIndex = colorManager.cleanIndex(property.value);
      if (colorManager.isValidIndex(colorIndex)) {
        var newColor = palette.paletteIndexToHex(colorIndex);
        if (newColor !== false) {
          property.value = '#' + newColor;
        }
        else if (colorManager.custom) {
          property.value = '#' + colorManager.custom.paletteIndexToHex(colorIndex);
        }
      }
    }
    id = ThemeBuilder.util.getSafeClassName(selector + '-' + property.name);
    var $e = $('#selector-' + id);
    if ($e.size() === 1) {
      $e.find('.history-property-value').text(property.value);
      $e.insertBefore($markerRow);
      this.customCount++;
    }
    else {
      var row = 
	'<tr class="history-table-row history-property" id="selector-' + id + '">' +
	'  <td><span class="history-property-name history-element-text">' + property.name + '</span><span class="history-separator history-element-text">: </span><span class="history-property-value history-element-text">' + property.value + '</span></td>' +
	'  <td class="operations">' +
	'    <div title="' + Drupal.t('Delete this attribute') + '" class="history-operation history-delete">' + Drupal.t('delete') + '</div>' +
	'    <div title="' + Drupal.t('Hide this attribute') + '" class="history-operation history-hide">' + Drupal.t('hide') + '</div>' +
	'  </td>' +
	'</tr>';
    
      $(row).insertBefore($markerRow);
      this.customCount++;
    }
  }
};

/**
 * The click event handler.
 * 
 * There is only one click event handler for the entire history
 * display.  This is much more efficient than attaching event handlers
 * to every interesting DOM element and cleaning up those handlers
 * when we clear the table.
 * 
 * This click event handler determines what the user's intentions are
 * based on the particular element that was clicked, and causes the
 * corresponding changes to occur.
 * 
 * @param {Event} event
 *   The event associated with the user's click.
 */
ThemeBuilder.History.prototype._contentsClicked = function (event) {
  var $ = jQuery;
  var action = this.interpretEvent(event);
  var id = this.getActionId(action);
  var modification, $target;
  switch (action.action) {
  case 'delete':
    modification = this.buildModification(action);
    if (modification) {
      ThemeBuilder.applyModification(modification);
    }
    this.removeHiddenModification(modification);
    // The custom count is recalculated after delete.
    break;

  case 'hide':
    modification = this.buildModification(action);
    if (modification) {
      ThemeBuilder.preview(modification);
      this.disableRows(this.rowHideGetAffectedRows(id));
      this.addHiddenModification(modification);
      this.fixSelectorOperations();
      this.fixGlobalButtons();
    }
    break;

  case 'show':
    modification = this.getHiddenModification(action.selector, action.property);
    if (modification) {
      ThemeBuilder.preview(modification, false);
      this.enableRows(this.rowHideGetAffectedRows(id));
      this.removeHiddenModification(modification);
      this.fixSelectorOperations();
      this.fixGlobalButtons();
    }
    break;

  case 'highlight':
    ThemeBuilder.util.setSelector(action.selector);
    this.highlight(action.selector);
    break;

  default:
  }
};

/**
 * Returns an object that indicates what action should be taken for the specified event within the CSS history display.
 * 
 * @param {Event} event
 *   The click event.
 * @return {Object}
 *   An object that indicates the action, the selector, property, and
 *   value.  Each of these is determined from the DOM element that the
 *   user clicked within the history view.
 */
ThemeBuilder.History.prototype.interpretEvent = function (event) {
  var $ = jQuery;
  var result = {
    action: 'none'
  };

  var $target = $(event.target);
  if ($target.hasClass('history-selector') || $target.hasClass('history-selector-row')) {
    // this is a selector.
    result.action = 'highlight';
    result.target = 'selector';
    if ($target.hasClass('history-selector-row')) {
      result.selector = $target.find('.history-selector').text();
    }
    else {
      result.selector = $target.text();
    }
  }
  else {
    var $row = $target.closest('.history-table-row');
    if ($row.hasClass('history-property')) {
      // This is a property
      result.property = $row.find('.history-property-name').text();
      result.value = $row.find('.history-property-value').text();
      result.selector = $row.closest('tr').prevAll('.history-selector-row').first().find('.history-selector').text();
    }
    else if ($row.hasClass('history-selector-row')) {
      // this is a selector
      result.selector = $row.find('.history-selector').text();
    }

    // Figure out what the requested operation was
    if ($target.hasClass('history-hide')) {
      // Hide
      result.action = 'hide';
    }
    else if ($target.hasClass('history-show')) {
      // Show
      result.action = 'show';
    }
    else if ($target.hasClass('history-delete')) {
      // delete;
      result.action = 'delete';
    }
    else {
      // Selected a property row;
      result.action = 'highlight';
      result.target = 'selector';
      delete result.property;
    }
  }
  return result;
};

/**
 * Returns the ID associated with the selector and optional property within the specified action object.
 * 
 * @param {Object} action
 *   The object that represents the action the user wishes to take,
 *   based on a click event within the history table.
 * @return {String}
 *   The element id.
 */
ThemeBuilder.History.prototype.getActionId = function (action) {
  var name = 'selector-' + action.selector;
  if (action.property) {
    name += '-' + action.property;
  }
  name = ThemeBuilder.util.getSafeClassName(name);
  return name;
};

/**
 * Creates a Modification instance based on the specified action.
 * 
 * The modification can be applied or reverted and represents the
 * deletion of one or more CSS properties from the custom.css file.
 * This is done using a Modification instance so these changes will
 * work with undo and redo.
 * 
 * @param {Object} action
 *   An object representing the action to be taken.  This is obtained
 *   by passing a history click event into this.interpretEvent.
 * @return {Modification}
 *   The modificaton.
 */
ThemeBuilder.History.prototype.buildModification = function (action) {
  if (!action.property) {
    // A selector was chosen.
    return this.buildGroupedModification(action.selector);
  }
  var modification = new ThemeBuilder.CssModification(action.selector);
  modification.setPriorState(action.property, action.value); // TODO: What about resources?
  modification.setNewState(action.property, '');
  return modification;
};

/**
 * Disables the specified rows in the history view.
 * 
 * A disabled row is on for which the user clicked the 'hide' button.
 * The custom css still exists in the theme files, but has been
 * removed from the browser's stylesheets so the user can see what the
 * theme looks like without the style(s).
 * 
 * @param {Array} $rows
 *   An array of jQuery objects, each of which represents a row in the
 *   history view that should be disabled.
 */
ThemeBuilder.History.prototype.disableRows = function ($rows) {
  for (var i = 0, len = $rows.length; i < len; i++) {
    this.disableRow($rows[i]);
  }
};

/**
 * Disables the specified row in the history view.
 * 
 * @param {jQuery} $row
 *   A jQuery object which represents a non-hidden row in the history view
 *   that should be hidden.
 */
ThemeBuilder.History.prototype.disableRow = function ($row) {
  var $ = jQuery;
  if (!$row.filter) {
    $row = $($row);
  }
  $row.addClass('hide');

  // If this is a property row, change hide to show.
  if ($row.hasClass('history-property')) {
    $row.find('.history-hide')
      .removeClass('history-hide')
      .addClass('history-show')
      .text(Drupal.t('show'))
      .attr('title', Drupal.t('Show this attribute'));
  }
};

/**
 * Adds the specified modification to the list of hidden modifications maintained by this History instance.
 * 
 * If the modification is a GroupedModification, all child
 * modifications will be added to the list.
 * 
 * @param {Modification} modification
 *   The modification to add to the list of hidden modifications.
 */
ThemeBuilder.History.prototype.addHiddenModification = function (modification) {
  if (modification instanceof ThemeBuilder.GroupedModification) {
    var children = modification.getChildren();
    for (var attribute in children) {
      if (children.hasOwnProperty(attribute)) {
        this.addHiddenModification(children[attribute]);
      }
    }
    return;
  }
  var priorState = modification.getPriorState();
  var selector = priorState.selector;
  var property = priorState.property;
  if (!this.hiddenModifications[selector]) {
    this.hiddenModifications[selector] = {};
  }
  if (!this.hiddenModifications[property]) {
    this.hiddenCount++;
  }
  this.hiddenModifications[selector][property] = modification;
};

/**
 * Removes the specified modification from the list of hidden modifications maintained by this History instance.
 * 
 * If the modification is a GroupedModification, all child
 * modifications will be removed from the list.
 * 
 * @param {Modification} modification
 *   The modification to remove from the list of hidden modifications.
 */
ThemeBuilder.History.prototype.removeHiddenModification = function (modification) {
  if (modification instanceof ThemeBuilder.GroupedModification) {
    var children = modification.getChildren();
    for (var attribute in children) {
      if (children.hasOwnProperty(attribute)) {
        this.removeHiddenModification(children[attribute]);
      }
    }
    return;
  }
  var priorState = modification.getPriorState();
  var selector = priorState.selector;
  var property = priorState.property;
  var $ = jQuery;
  if (this.hiddenModifications[selector] &&
      this.hiddenModifications[selector][property]) {
    delete this.hiddenModifications[selector][property];
    this.hiddenCount--;
    if ($.isEmptyObject(this.hiddenModifications[selector])) {
      delete this.hiddenModifications[selector];
    }
  }
};

/**
 * Determines which rows should be affected in the CSS History display if the property associated with the specified row id is hidden.
 * 
 * This method returns an array of jQuery objects, each of which
 * should be marked as hidden on the display when the row associated with the
 * specified id is deleted.
 * 
 * @param {String} id
 *   The element id associated with a row being hidden.
 * @return {Array}
 *   An array of jQuery objects, each of which represents a row in the
 *   CSS History table that should be marked as hidden.
 */
ThemeBuilder.History.prototype.rowHideGetAffectedRows = function (id) {
  var $ = jQuery;
  var $row, $property;
  var result = [];
  $row = $('#' + id);
  result.push($row);
  if ($row.hasClass('history-selector-row')) {
    // This is a selector.  Make sure to hide all of the properties.
    $property = $row.next();
    while ($property.length > 0 && $property.hasClass('history-property')) {
      result.push($property);
      $property = $property.next();
    }
  }
  return result;
};

/**
 * Returns a single modification that represents the hidden modification filtered by the specified selector and property.
 * 
 * If no property is provided, a GroupedModification will be created
 * that contains all currently hidden properties for the specified
 * selector.
 * 
 * If no selector is provided, a GroupedModification will be created
 * that contains all currently hidden properties for all selectors.
 * 
 * @param {String} selector
 *   An optional parameter that identifies the selector, which is used
 *   to filter the hidden modifications that are returned.
 * @param {String} property
 *   An optional parameter that identifies the property, which is used
 *   to return a specific modification using the specified selector
 *   and property.  In this case the result will not be a
 *   GroupedModification.
 * @return {Modification}
 *   A Modification instance that represents all currently hidden
 *   attributes filtered by the optional selector and property.
 */
ThemeBuilder.History.prototype.getHiddenModification = function (selector, property) {
  var $ = jQuery;
  var modification;
  if (!$.isEmptyObject(this.hiddenModifications)) {
    if (!property) {
      var selectors = [];
      var s;
      if (!selector) {
	// We want a modification that will apply to all hidden items.
        for (s in this.hiddenModifications) {
          if (this.hiddenModifications.hasOwnProperty(s)) {
            selectors.push(s);
          }
        }
      }
      else {
        selectors.push(selector);
      }
      // We will generate a grouped modification that includes all
      // currently hidden properties under the specified selector.
      modification = new ThemeBuilder.GroupedModification();
      for (var i = 0, len = selectors.length; i < len; i++) {
        if (this.hiddenModifications.hasOwnProperty(selectors[i])) {
          for (var attribute in this.hiddenModifications[selectors[i]]) {
            if (this.hiddenModifications[selectors[i]].hasOwnProperty(attribute)) {
              modification.addChild(selectors[i] + '-' + attribute, this.hiddenModifications[selectors[i]][attribute]);
            }
          }
        }
      }
    }
    else {
      modification = this.hiddenModifications[selector][property];
    }
  }
  return modification;
};

/**
 * Gets the selector rows in sync with the state of their associated property rows.
 * 
 * This method is responsible for managing the display of the
 * hide/show controls on the selector row and for showing the selector
 * is disabled or enabled.
 */
ThemeBuilder.History.prototype.fixSelectorOperations = function () {
  var $ = jQuery;
  var $selectorRow;
  var $rows;
  var hiddenRows;
  var $selectorRows = $('.history-selector-row');
  for (var i = 0, len = $selectorRows.size(); i < len; i++) {
    $selectorRow = $selectorRows.eq(i);
    $rows = $selectorRow.nextUntil('.history-selector-row');
    hiddenRows = $rows.filter('.hide').size();
    if (hiddenRows === 0) {
      // Show should not be available.
      $selectorRow.find('.history-show').hide()
        .removeClass('hide');
    }
    else {
      $selectorRow.find('.history-show').show();
    }
    if (hiddenRows === $rows.size()) {
      // hide should be disabled.
      $selectorRow
        .addClass('hide')
	.find('.history-hide').hide();
    }
    else {
      $selectorRow
	.removeClass('hide')
        .find('.history-hide').show();
    }
  }
};

ThemeBuilder.History.prototype.fixGlobalButtons = function () {
  var $ = jQuery;
  var $showButton = $('#history-show-all');
  var $hideButton = $('#history-hide-all');
  var $deleteButton = $('#history-delete-all-hidden');
  if (this.hiddenCount < this.customCount) {
    // There are some properties that are showing.  Ok to show the
    // hide button.
    $hideButton.removeClass('disabled');
  }
  else {
    // Disable the hide button.
    $hideButton.addClass('disabled');
  }
  if (this.hiddenCount > 0) {
    // There are some properties that are hidden.  Ok to show the show
    // and delete buttons.
    $showButton.removeClass('disabled');
    $deleteButton.removeClass('disabled');
  }
  else {
    // Disable the show and delete buttons.
    $showButton.addClass('disabled');
    $deleteButton.addClass('disabled');
  }
};

/**
 * Highlights the elements in the DOM associated with the specified selector, but only if it is present in custom.css.
 * 
 * @param {String} selector
 *   The selector
 */
ThemeBuilder.History.prototype.highlight = function (selector) {
  var $ = jQuery;
  var id = this.getActionId({selector: selector});
  var $rows = this.rowHideGetAffectedRows(id);
  $('#themebuilder-wrapper .history-table-row.history-selected').removeClass('history-selected');
  if (id && $('#' + id).size() > 0) {
    this.domNavigator.highlightSelection(selector);
    $('#' + id).addClass('history-selected');
    for (var i = 0, len = $rows.length; i < len; i++) {
      $rows[i].addClass('history-selected');
    }
    $('#history-title-selector').text(selector);
  }
  else {
    this.domNavigator.unhighlightSelection();
    $('#history-title-selector').text('');
  }
};

/**
 * Hides all custom CSS.
 * 
 * Hides every custom css property.  The difference between hide and
 * disable is that hide applies to the actual css property and causes
 * the associated style rule to be removed from the stylesheet, while
 * disable causes the associated row to be themed so it looks like the
 * associated style is disabled.
 */
ThemeBuilder.History.prototype.hideAll = function () {
  var $ = jQuery;

  // Create a modification for every custom property that is not currently hidden.
  var modification = new ThemeBuilder.GroupedModification();
  var children = [];
  var property;
  var selectors = this.styles.getIterator();
  while (selectors.hasNext()) {
    var selectorData = selectors.next();
    var selector = selectorData.selector;
    var properties = selectorData.properties;
    while (properties.hasNext()) {
      property = properties.next();
      if (!this.hiddenModifications[selector] || !this.hiddenModifications[selector][property.name]) {
	// The attribute is not already hidden, so add it.
        modification.addChild(selector + '-' + property.name, this.buildModification({selector: selector, property: property.name, value: property.value}));
      }
    }
  }

  // Cause the custom css to be hidden.
  ThemeBuilder.preview(modification);
  this.addHiddenModification(modification);

  // Display all rows as hidden
  this.disableRows($('.history-table-row'));
  this.fixSelectorOperations();
  this.fixGlobalButtons();
};

/**
 * Enables all currently hidden rows in the history panel.
 */
ThemeBuilder.History.prototype.enableAllRows = function () {
  var $ = jQuery;
  var $rows = $('#themebuilder-wrapper .history-table-row.hide');
  for (var i = 0, len = $rows.size(); i < len; i++) {
    this.enableRow($($rows[i]));
  }
};

/**
 * Enables the specified rows in the history view.
 * 
 * @param {Array} $rows
 *   An array of jQuery objects, each of which represents a row in the
 *   history view that should be enabled.
 */
ThemeBuilder.History.prototype.enableRows = function ($rows) {
  for (var i = 0, len = $rows.length; i < len; i++) {
    this.enableRow($rows[i]);
  }
};

/**
 * Enables the specified row in the history view.
 * 
 * @param {jQuery} $row
 *   A jQuery object which represents a hidden row in the history view
 *   that should be enabled.
 */
ThemeBuilder.History.prototype.enableRow = function ($row) {
  $row.removeClass('hide');

  // If this is a property row, change show to hide.
  if ($row.hasClass('history-property')) {
    $row.find('.history-show')
      .removeClass('history-show')
      .addClass('history-hide')
      .text(Drupal.t('hide'))
      .attr('title', Drupal.t('Show this attribute'));
  }
};

/**
 * Shows all currently hidden custom css properties and enables the associated rows.
 */
ThemeBuilder.History.prototype.showAll = function () {
  var modification = this.getHiddenModification();
  if (modification) {
    ThemeBuilder.preview(modification, false);
    this.removeHiddenModification(modification);

    // Show the rows again by removing the hide
    this.enableAllRows();
    this.fixSelectorOperations();
    this.fixGlobalButtons();
  }
};

/**
 * Deletes all currently hidden custom CSS properties.
 */
ThemeBuilder.History.prototype.deleteAllHidden = function (event) {
  event.preventDefault();
  var modification = this.getHiddenModification();
  if (modification) {
    ThemeBuilder.applyModification(modification);
    this.removeHiddenModification(modification);
    this.fixSelectorOperations();
    this.fixGlobalButtons();
    // Note that the row display will be fixed when the modfication is processed.
  }
};

/**
 * Removes the specified rows in the history view.
 * 
 * @param {Array} $rows
 *   An array of jQuery objects, each of which represents a row in the
 *   history view that should be removed.
 */
ThemeBuilder.History.prototype.removeRows = function ($rows) {
  for (var i = 0, len = $rows.length; i < len; i++) {
    this.removeRow($rows[i]);
  }
};

/**
 * Removes the specified row in the history view.
 * 
 * @param {Element} $row
 *   A DOM element or a jQuery object representing a row in the
 *   history view that should be removed.
 */
ThemeBuilder.History.prototype.removeRow = function (row) {
  var $ = jQuery;
  var $row = row;
  if (!row.filter) {
    $row = $(row);
  }
  $row.remove();
};

/**
 * Creates a grouped modification that represents the removal of all properties associated with the specified selector.
 *
 * @param {String} selector
 *   The selector.
 * @return {Modification}
 *   The modification that will remove all customized properties
 *   associated with the specified selector.
 */
ThemeBuilder.History.prototype.buildGroupedModification = function (selector) {
  var children = [];
  var property;
  var properties = this.styles.getPropertyIterator(selector);
  var modification = new ThemeBuilder.GroupedModification();
  while (properties.hasNext()) {
    property = properties.next();
    modification.addChild(selector + '-' + property.name, this.buildModification({selector: selector, property: property.name, value: property.value}));
  }
  return modification;
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global ThemeBuilder: true debug: true */

/**
 * The UndoStatusSwitch allows any code in the system to file a reason for
 * which the undo/redo buttons should be disabled and determines when the
 * buttons should be enabled again.
 *
 * The idea is pretty simple.  Code that has a need to disable the buttons
 * can call an instance of this class to disable the buttons, and receive
 * an opaque key in return.  When that reason for disabling the buttons
 * is resolved (for example, the user dismisses a dialog), the reason key
 * can be cleared with this object.  When there are no reasons for the buttons
 * to be disabled, the buttons will again become enabled.
 *
 * This is necessarily more complex than simply causing the buttons to be
 * disabled and enabled at certain points within the code because of the
 * asynchronous nature of the themebuilder.  The undo/redo buttons should be
 * disabled while the user is interacting with the color dialog box.  It should
 * also be disabled between the time the user clicks the undo button and the
 * time the server response is received.  If such events overlap, it is not
 * feasible to handle the enabling and disabling of these buttons inline.
 * @class
 */
ThemeBuilder.UndoStatusSwitch = ThemeBuilder.initClass();

/**
 * Initializes the UndoStatusSwitch instance.
 */
ThemeBuilder.UndoStatusSwitch.prototype.initialize = function () {
  // This is a set of reasons for the undo / redo buttons to be disabled.  When
  // the set is empty, the buttons should be enabled, provided there are
  // modifications in each of the stacks.
  this._reasons = {};
  this._listeners = [];
};

/**
 * Indicates the current status of undo and redo functionality.  A true result
 * indicates the buttons and functionality should be enabled, and false indicates
 * disabled.
 *
 * @return {boolean}
 *   true indicates enabled; false disabled.
 */
ThemeBuilder.UndoStatusSwitch.prototype.getStatus = function () {
  return !this._hasReasons();
};

/**
 * Registers a reason for disabling the undo and redo buttons.  If there are
 * no other reasons registered, this call will cause event listeners to be
 * called, which will result in the buttons being disabled.
 *
 * @return {string}
 *   A unique, opaque key that must be used to clear the disabling later.
 */
ThemeBuilder.UndoStatusSwitch.prototype.disable = function () {
  var key = this._generateUniqueKey();
  var wasEmpty = !this._hasReasons();
  this._reasons[key] = true;
  if (wasEmpty) {
    this.notifyListeners(false);
  }
  return key;
};

/**
 * Clears the reason associated with the specified key.  this key is returned
 * from the disable method.  If this key represents the last reason to disable
 * the undo and redo buttons, the event listeners will be notified that the buttons
 * should now be enabled.
 *
 * @param {string} key
 *   The key returned from the disable method that represents the reason for
 *   disabling the buttons.
 */
ThemeBuilder.UndoStatusSwitch.prototype.clear = function (key) {
  delete this._reasons[key];
  if (!this._hasReasons()) {
    this.notifyListeners(true);
  }
};

/*
 * @param listener object
 *   An object with a  method.
 */
ThemeBuilder.UndoStatusSwitch.prototype.addStatusChangedListener = function (listener) {
  this._listeners.push(listener);
};

/**
 * Removes the specified listener from the switch.
 *
 * @param listener object
 *   The listener to remove.
 */
ThemeBuilder.UndoStatusSwitch.prototype.removeStatusChangedListener = function (listener) {
  var listeners = [];
  for (var i = 0; i < this._listeners.length; i++) {
    if (this._listeners[i] !== listener) {
      listeners.push(this._listener[i]);
    }
  }
  this._listeners = listeners;
};

/**
 * Notifies the listeners that a change to the status of the undo and redo
 * buttons has occurred.
 *
 * @param {boolean} status
 *   If true, the listeners are notified that the buttons are going from the
 *   disabled state to the enabled state. false indicates the opposite.
 */
ThemeBuilder.UndoStatusSwitch.prototype.notifyListeners = function (status) {
  for (var i = 0; i < this._listeners.length; i++) {
    this._listeners[i].undoStatusChanged(status);
  }
};

/**
 * Indicates whether or not there are registered reasons for not enabling the
 * undo and redo buttons.
 *
 * @return {boolean}
 *   true if there are registered reasons for not enabling the buttons; false
 *   otherwise.
 */
ThemeBuilder.UndoStatusSwitch.prototype._hasReasons = function () {
  for (var i in this._reasons) {
    if (this.hasOwnProperty(i)) {
      return true;
    }
  }
  return false;
};

/**
 * Generates a unique key that represents a reason.  This key will be used
 * to clear the reason from this switch when the reason no longer applies.
 */
ThemeBuilder.UndoStatusSwitch.prototype._generateUniqueKey = function () {
  var key = 'reason_key_' + Math.floor(Math.random() * 25000);
  while (this._reasons[key]) {
    key = 'reason_key_' + Math.floor(Math.random() * 25000);
  }
  return key;
};
ThemeBuilder.undoButtons = new ThemeBuilder.UndoStatusSwitch();
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global window : true jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder = ThemeBuilder || {};

ThemeBuilder.ui = ThemeBuilder.ui || {};

/**
 * The horizontal slider wraps a specified element with a left/right scrolling controlling
 * that employs buttons to slide the content rather than a scroll bar.
 * @class
 */
ThemeBuilder.ui.HorizontalCarousel = ThemeBuilder.initClass();

/**
 * The constructor of the HorizontalCarousel class.
 *
 * @param {DomElement} element
 *   The element is a pointer to the jQuery object that will be wrapped in the 
 *   horizontal carousel.
 * @param {int} [optional] steps
 *   A Number indicating the number of clicks a user will need to make in order
 *   scroll the carousel from one end of the content items to the other
 * @param {int} [optional] tolerance
 *   A pixel distance.  The amount of distance from the ends of the scroller that should
 *   disregarded when a user has scrolled near the extreme left or right of the content.
 * @param {int} [optional] duration
 *   The number of milliseconds that the slide animation should last.
 * @return {Boolean}
 *   Returns true if the carousel initializes
 */
ThemeBuilder.ui.HorizontalCarousel.prototype.initialize = function (element, steps, tolerance, duration) {
  
  var $ = jQuery;
  
  this._element = {};
  this._type = '';
  this._steps = steps || 3;
  this._tolerance = tolerance || 20;
  this._animationDuration = duration || 220;
  this._currentOffset = NaN;
  this._scrollContentWidth = 0;
  this._scrollPaneWidth = 0;
  this._scrollRemainder = 0;
  // Private functions
  this.stripPX = ThemeBuilder.bind(this, this._stripPX);
  
  if (element) {
    this._element = element;
  } 
  else {
    return false;
  }
  
  this._type = 'HorizontalCarousel';

  this._element
    .addClass('scroll-content ui-widget ui-widget-header ui-corner-all');
  this._scrollContent = $('.scroll-content');
  this._scrollContent
    .addClass('clearfix');
  
  this._scrollPane = this._scrollContent
    .wrap('<div class="scroll-pane"></div>')
    .parent()
    .addClass('clearfix');
    
  this._horizontalCarousel = this._scrollPane
    .wrap('<div class="horizontal-carousel"></div>')
    .parent()
    .addClass('clearfix');
  
  this._decrementButton = this._horizontalCarousel
    .prepend('<a href="#" class="decrement button"></a>')
    .children().first()
    .bind('click', ThemeBuilder.bind(this, this.slideCarousel));
    
  this._incrementButton = this._horizontalCarousel
    .prepend('<a href="#" class="increment button"></a>')
    .children().first()
    .bind('click', ThemeBuilder.bind(this, this.slideCarousel));
  
  this._handleHelper = $('.ui-handle-helper-parent', this._horizontalCarousel);
  this._buttons = $('.button', this._horizontalCarousel);
  
  this._scrollPane.css({
    overflow: 'hidden' // change overflow to hidden now that the carousel handles the scrolling
  });
  
  this._trackWindowSize(); // update the UI when the window size changes
  return true;
};

/**
 * Handles the click event from the carousel controls.
 *
 * @param {Event} event
 *   Event object from the click of the carousel controls.
 * @return {Boolean} false
 *   Returns false to prevent default anchor tag behavior.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype.slideCarousel = function (event) {
  var $ = jQuery;
  event.preventDefault();
  
  this._scrollContentWidth = this._getContentWidth();
  this._scrollPaneWidth = this._getPaneWidth();
  this._scrollRemainder = this._scrollPaneWidth - this._scrollContentWidth;
  var increment = Math.floor(this._scrollContentWidth / this._steps);
  var trigger = $(event.currentTarget);
  
  if (trigger.hasClass('increment')) { 
    if (trigger.hasClass('disabled')) {
      return false;
    }
    this._shiftContent((this._currentOffset - increment), true, 'increment');
    return false;
  }
  if (trigger.hasClass('decrement')) {
    if (trigger.hasClass('disabled')) {
      return false;
    }
    this._shiftContent((this._currentOffset + increment), true, 'decrement');
    return false;
  }
  return false;
};

/**
 * Rerenders the carousel.
 * Called externally to recreate the content of the carousel.
 *
 * @return {Boolean} true
 *   Returns true in call cases.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype.updateUI = function () {
  var $ = jQuery;
  
  var scrollContentWidthOrig = this._scrollContentWidth;
  var scrollPaneWidthOrig = this._scrollPaneWidth;
  var currentOffsetOrig = this._currentOffset;
  var scrollRemainderOrig = this._scrollRemainder;

  this._scrollPaneWidth = this._getPaneWidth();
  this._scrollPane.add(this._scrollContent).width('auto');
  this._scrollContentWidth = this._getContentWidth();
  
  if (this._scrollContentWidth === 'auto') {
    return false;  // don't update the UI if it doesn't have content
  }
  //Set the widths of the content and pane
  this._scrollContent.width(this._scrollContentWidth);
  this._scrollPane.width(this._scrollPaneWidth);
  this._scrollRemainder = this._scrollPaneWidth - this._scrollContentWidth;
  this._scrollRemainder = typeof(this._scrollRemainder) === 'number' ? this._scrollRemainder : 0;
  // When the user selects a new element, shift the scrollContent to maximum offset.
  if (isNaN(this._currentOffset)) { // Initial updateUI call.
    this._shiftContent(this._scrollRemainder, false);
    return true;
  }
  if (scrollPaneWidthOrig > scrollContentWidthOrig) { // They weren't scrolling, so shift to the left.
    this._shiftContent(this._scrollRemainder, false);
    return true;
  }
  if (this._currentOffset === 0) { // They scrolled all the way left, keep this offset of zero.
    this._shiftContent(0, false);
    return true;
  }
  if (currentOffsetOrig > scrollRemainderOrig) { // They scrolled somewhere in between the ends of the content.
    var shift = currentOffsetOrig + (scrollContentWidthOrig - this._scrollContentWidth);
    this._shiftContent(shift, false);
    return true;
  }
  this._shiftContent(this._scrollRemainder, false); // Just shift it completely to the left.
  return true;
};

/**
 * Returns a jQuery pointer to this object
 *
 * @return {object}
 *   Returns null if the carousel has no pointer.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype.getPointer = function () {
  if (this._horizontalCarousel) {
    return this._horizontalCarousel;
  } 
  else {
    return null;
  }
};

/**
 * Content position relative to the offset parent.
 *
 * @return {Object}
 *   position contains left and top position values
 */
ThemeBuilder.ui.HorizontalCarousel.prototype.getContentPos = function () {
  var contentPositionLeft = this._stripPX(this._scrollContent.css('left'));
  var contentPositionTop = this._stripPX(this._scrollContent.css('top'));
  return {left: contentPositionLeft, top: contentPositionTop};
};

/**
 * Handles window resizing 
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._reFlow = function () {
  var $ = jQuery;
  
  var scrollRemainderCurrent = this._scrollRemainder || 0;
  this._scrollPaneWidth = this._getPaneWidth();
  this._scrollPane.width(this._scrollPaneWidth);
  this._scrollRemainder = this._scrollPaneWidth - this._scrollContentWidth;
  if (isNaN(this._scrollRemainder)) {
    this._scrollRemainder = 0;
    this._currentOffset = 0;
  }
  var delta = this._scrollRemainder - scrollRemainderCurrent;
  var shift = this._currentOffset + delta;
  this._shiftContent(shift, false);
};

/**
 * Content width is calculated as the sum of the outerWidths of all child elements.
 *
 * @return {int}
 *   Returns the width of the content, or zero if the content does not have width.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._getContentWidth = function () {

  var scrollContentItems = this._scrollContent.children();
  var scrollContentItemNum = scrollContentItems.size();
  
  if (scrollContentItemNum > 0 && scrollContentItems.eq(0).is(':visible')) {
    var computedSize = 0;
    while (scrollContentItemNum--) {
      var item = scrollContentItems.eq(scrollContentItemNum);
      var marginLeft = this._stripPX(item.css('margin-left'));
      var marginRight = this._stripPX(item.css('margin-right'));
      computedSize += Math.ceil(item.outerWidth() + Number(marginLeft) + Number(marginRight));
    }
    // Add 2px for the angels - JBeach.
    return Number(computedSize) + 2;
  }
  return 'auto';
};

/**
 * Pane width is calculated as the space inside the carousel excluding
 * the width of the controls.
 *
 * @return {int}
 *   Returns the width of the scrollPane.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._getPaneWidth = function () {
  return this._horizontalCarousel.width() - (this._incrementButton.outerWidth(true) + this._decrementButton.outerWidth(true));
};

/**
 * Utility function to set the offset of scrollContent
 *
 * @param {int} offset
 *   The offset value to move scrollContent.
 * @param {Boolean} animate
 *   Whether or not setting the offset should animate the movement of the content.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._setOffset = function (offset, animate) {
  if (animate) {
    this._scrollContent.animate({
      'left': offset + 'px'
    }, this._animationDuration, 'swing');
  }
  else {
    this._scrollContent.css({
      'left': offset + 'px'
    });
  }
  this._currentOffset = offset;
};

/**
 * Utility function to remove 'px' from calculated values.  The function assumes that
 * that unit 'value' is pixels.
 *
 * @param {String} value
 *   The String containing the CSS value that includes px.
 * @return {int}
 *   Value stripped of 'px' and casted as a number or NaN if 'px' is not found in the string.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._stripPX = function (value) {
  var index = value.indexOf('px');
  if (index === -1) {
    return NaN;
  }
  else {
    return Number(value.substring(0, index));
  }
};
 
 
 /**
  * Controls the update of the UI after a shifting event such as a click or reFlow
  *
  * @param {int} offset
  *   The offset value to move scrollContent.
  * @param {Boolean} animate
  *   Whether or not setting the offset should animate the movement of the content.
  * @param {string} direction
  *   'increment' or 'decrement'.
  */
ThemeBuilder.ui.HorizontalCarousel.prototype._shiftContent = function (offset, animate, direction) {
  this._snapScroll(offset, animate, direction);
  this._setButtonState();
};
 
/**
 * Snaps the scroll content to the edges of the visible pane area when the content
 * is displaced outside the visible pane area by less than the provided tolerance
 * value. Tolerance is set to 20 by default.  Snap scroll is also responsible
 * for keeping the scroll pane from exceeding its boundaries.  The left edge of the content
 * pane cannot scroll farther right than a zero offset and the right edge
 * of the content scroll pane cannot be translated farther left than the delta
 * between of the content scroll pane and the containing pane.
 *
 *   Illegal Cases - snapping must occur regardless of tolerance
 *   case 1: left edge of content is at a positive offset or the scrollRemainder is positive
 *   case 2: left edge of content is at a negative offset, greater than the scrollRemainer
 *
 *   Snap Cases - Snapping might occur depending on the value of tolerance (default 10px)
 *   case 3: the absolute value of offset is at tolerance or less
 *   case 4: the absolute difference between offset and scrollRemainder is at tolerance or less.
 *
 * @param {int} offset
 *   The offset value to move scrollContent.
 * @param {Boolean} animate
 *   Whether or not setting the offset should animate the movement of the content.
 * @param {string} direction
 *   'increment' or 'decrement'.
 * @return {Boolean}
 *   Returns true of the offset was altered before being sent to setOffset
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._snapScroll = function (offset, animate, direction) {
  var tol = this._tolerance;
  // Correct illegal cases first.  We can quit the method when either case 3 or case 4 are resolved
  // after updating button state.
  // case 1
  if (this._scrollRemainder > 0) {
    this._setOffset(0, animate);
    return true;
  }
  // case 1
  if (offset > 0) {
    this._setOffset(0, animate);
    return true;
  }
  //case 2
  if ((this._scrollRemainder - offset) >= 0) {
    this._setOffset(this._scrollRemainder, animate);
    return true;
  }
  // The direction that the scrollContent is traveling is important because we only
  // want to snap the edge of the content that was just acted on, i.e. increment side
  // or decrement side.
  if (direction) {
    switch (direction) {
    case 'decrement': // <| decrement
      // case 3
      if (Math.abs(offset) <= tol) {
        this._setOffset(0, animate);
        return true;
      }
      // if no case applies, pass offset through to setOffset
      this._setOffset(offset, animate);
      return false;
    case 'increment': // increment |>
      //case 4
      if ((Math.abs(this._scrollRemainder - offset)) <= tol) {
        this._setOffset(this._scrollRemainder, animate);
        return true;
      }
      // if no case applies, pass offset through to setOffset
      this._setOffset(offset, animate);
      return false;
    default:
      break;
    }
  }
  // case 3
  // We want the left edge of the scrollContent to snap to zero in the default case
  if (tol >= Math.abs(offset) > 0) {
    this._setOffset(0, animate);
    return true;
  }
  // if no case applies, pass offset through to setOffset
  this._setOffset(offset, animate);
  return false;
};

/**
 * Set the slider button enabled state.  The state is determined
 * by the position of the content container inside the scroll pane.
 *
 *   case 1: left edge of content is at offset 0, and scrollContent length is less than scrollPane
 *      <| Decrement (disabled) ... Increment (disabled) |>
 *   case 2: left edge of content is at offset 0, and scrollContent length is greater than scrollPane
 *      <| Decrement (disabled) ... Increment |>
 *   case 3: left edge of content is at a negative offset, less than the scrollRemainder,
        and the scrollPaneWidth is bigger than scrollContentWidth
 *      <| Decrement ... Increment |>
 *   case 4: left edge of content is at a negative offset, equal to the scrollRemainder
 *      <| Decrement ... Increment (disabled) |>
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._setButtonState = function () {
  var $ = jQuery;
  
  // decrement button
  //case 1 and case 2
  if (this._currentOffset === 0 || this._scrollRemainder > 0) {
    this._decrementButton.addClass('disabled');
  }
  else {
    this._decrementButton.removeClass('disabled');
  }
  // increment button
  //case 1
  if (this._scrollRemainder > 0) { // content has sufficient space
    this._incrementButton.addClass('disabled');
  }
  //case 4
  else if (this._currentOffset === this._scrollRemainder) { // shifted completely left
    this._incrementButton.addClass('disabled');
  }
  else {
    this._incrementButton.removeClass('disabled');
  }
};

/**
 * Causes window resizes to be detected, and resizes the themebuilder panel
 * accordingly.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._trackWindowSize = function () {
  var $ = jQuery;
  $(window).resize(ThemeBuilder.bind(this, this._windowSizeChanged));
  this._windowSizeChanged();
};

/**
 * When the window size changes, reset the max-width property of the
 * themebuilder.  Certain properties applied to the body tag will have an
 * effect on the layout of the themebuilder.  These include padding and
 * margin.  Because they change the size of the actual window, this type of
 * CSS "leakage" could not be fixed by the css insulator or iframe alone.
 *
 * @param {Event} event
 *   The window resize event.
 */
ThemeBuilder.ui.HorizontalCarousel.prototype._windowSizeChanged = function (event) {
  this._reFlow();
};;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.themes = ThemeBuilder.themes || {};

/**
 * @class
 * @extends ThemeBuilder.InteractionController
 */
ThemeBuilder.themes.FeaturedThemeInteraction = ThemeBuilder.initClass();
ThemeBuilder.themes.FeaturedThemeInteraction.prototype = new ThemeBuilder.InteractionController();

/**
 * Constructor for the FeaturedThemeInteraction.
 */
ThemeBuilder.themes.FeaturedThemeInteraction.prototype.initialize = function (callbacks, data) {
  var $ = jQuery;

  this.setInteractionTable({
    // Show the name dialog
    begin: 'setState',
    ready: 'showModalDialog',
    themeAccepted: 'saveTheme',
    dialogCanceled: 'cancelDialog',
    done: 'hideModalDialog'
  });
  // Set the callbacks
  this.setCallbacks(callbacks);
  // Make UI elements
  this.speed = 250;
  this.ui = {};
  // Store the panels
  this.ui.panels = {
    mythemes: $('#themebuilder-themes-mythemes'),
    featured: $('#themebuilder-themes-featured')
  };
  // Store the actions
  this.ui.actions = {
    pointer: $('#themebuilder-themes-actions')
  };
  var appData = ThemeBuilder.getApplicationInstance().getData();
  this.selectedTheme = appData.selectedTheme;
  this.currentCustomTheme = appData.selectedTheme;
};

ThemeBuilder.themes.FeaturedThemeInteraction.prototype.setCustomTheme = function (theme) {
  this.currentCustomTheme = theme;
};

/**
 * Hides the modal dialog and brings the mythemes carousel back
 */
ThemeBuilder.themes.FeaturedThemeInteraction.prototype.hideModalDialog = function (event) {
  if (this.ui.modal) {
    this.ui.modal.pointer.remove();
    delete this.ui.modal;
  }
  this.ui.panels.featured.smartToggle('hide', {speed: this.speed});
  this.ui.actions.pointer.smartToggle('show', {speed: this.speed});
  this.ui.panels.mythemes.smartToggle('show', {speed: this.speed});
};

/**
 * Adds the featuredTheme state information to the application
 */
ThemeBuilder.themes.FeaturedThemeInteraction.prototype.setState = function (event) {
  var bar = ThemeBuilder.Bar.getInstance();
  var obj = bar.getTabInfo();
  var customState = {
    interactions: {
      featuredTheme: 'showModalDialog'
    },
    currentCustomTheme: this.currentCustomTheme
  };
  bar.saveState(obj.id, customState);
  this.event({event: event}, 'ready');
};

/**
 * Removes the featuredTheme state information from the application.
 *
 * @param {function} callback
 *   A function to call when the state has been successfully saved.
 */
ThemeBuilder.themes.FeaturedThemeInteraction.prototype.removeState = function (callback) {
  var bar = ThemeBuilder.Bar.getInstance();
  var obj = bar.getTabInfo();
  bar.saveState(obj.id, {}, callback);
};

/**
 * Handle the Cancel button on the modal.
 */
ThemeBuilder.themes.FeaturedThemeInteraction.prototype.cancelDialog = function (event) {
  if (this.selectedTheme !== this.currentCustomTheme) {
    this.removeState(ThemeBuilder.bind(this, this.switchToCustomTheme));
  }
  else {
    this.removeState();
    this.event({event: event}, 'done');
  }
};

/**
 * Switch to the custom theme that was open before the modal.
 */
ThemeBuilder.themes.FeaturedThemeInteraction.prototype.switchToCustomTheme = function () {
  ThemeBuilder.themeSelector.switchTheme(this.currentCustomTheme);
};

/**
 * Shows the featured theme selction modal dialog and the featured theme carousel
 * 
 * @param {Object} data
 *   An optional object that may have fields that customize the
 *   creation of the dialog.
 */
ThemeBuilder.themes.FeaturedThemeInteraction.prototype.showModalDialog = function (event) {
  if (!this.ui.modal) {
    this._buildModal();
  }
  this.ui.actions.pointer.smartToggle('hide', {speed: this.speed});
  this.ui.panels.mythemes.smartToggle('hide', {speed: this.speed});
  this.ui.modal.pointer.smartToggle('show', {speed: this.speed});
  this.ui.panels.featured.smartToggle('show', {speed: this.speed});
  
};

/**
 * Builds the HTML for the Cancel/Choose featured themes modal interaction flow.
 */
ThemeBuilder.themes.FeaturedThemeInteraction.prototype._buildModal = function () {
  var $ = jQuery;
  // Modal buttons
  // Check if the current active theme is the published theme.
  // Disabled the save button if it is
  var saveLinkClasses = ['themebuilder-button', 'primary'];
  var app = ThemeBuilder.getApplicationInstance();
  var settings = app.applicationData;
  if (settings.published_theme === settings.selectedTheme) {
    saveLinkClasses.push('disabled');
  }
  var buttons = new ThemeBuilder.ui.ActionList(
    {
      wrapper: {
        classes: ['horizontal']
      },
      actions: [
        {
          label: Drupal.t('Cancel'),
          action: this.makeEventCallback('dialogCanceled'),
          linkClasses: ['themebuilder-button']
        },
        {
          label: Drupal.t('Choose'),
          action: this.makeEventCallback('themeAccepted'),
          linkClasses: saveLinkClasses
        }
      ]
    }
  );
  // Add the buttons to the wrapper
  var $modal = $('<div>', {
    id: 'themebuilder-themes-featured-modal'
  }).prependTo($('#themebuilder-main'));
  
  $modal.append(
    $('<p>', {
      html: Drupal.t('Choose a theme. They can be customized later.')
    }),
    buttons.getPointer()
  );
    
  // Store the ui elements in this instance
  this.ui.modal = {
    obj: buttons,
    pointer: $('#themebuilder-themes-featured-modal')
  };
};

ThemeBuilder.themes.FeaturedThemeInteraction.prototype.saveTheme = function (event) {
  ThemeBuilder.Bar.getInstance().save();
  this.removeState();
  this.event({event: event}, 'done');
};

/**
 * A static method that puts the FeaturedThemeInteraction in the ready state and skips the begin state.
 *
 * This is invoked after a page refresh when the modal interaction is still valid, but we don't need to
 * initialize it again.
 */
ThemeBuilder.themes.FeaturedThemeInteraction.invoke = function () {
  var invoke = false;
  var customTheme;
  var state = ThemeBuilder.Bar.getInstance().getSavedState();
  if (state.info && state.info.interactions) {
    var interactions = state.info.interactions;
    for (var i in interactions) {
      if (interactions.hasOwnProperty(i)) {
        // We might eventually want a map of available interactions. For the moment,
        // we'll just call up the ones we know about directly.
        if (i === 'featuredTheme') {
          invoke = (interactions[i] === 'showModalDialog');
        }
      }
    }
    customTheme = state.info.currentCustomTheme;
  }
  if (invoke) {
    var modal = new ThemeBuilder.themes.FeaturedThemeInteraction();
    if (customTheme) {
      modal.setCustomTheme(customTheme);
    }
    modal.start();
  }
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global window : true jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder = ThemeBuilder || {};

ThemeBuilder.ui = ThemeBuilder.ui || {};

/**
 * The ActionList wraps a message in a jquery ui ActionList with hooks for the OK and Cancel button callbacks
 * @class
 */
ThemeBuilder.ui.ActionList = ThemeBuilder.initClass();

/**
 * The constructor of the ActionList class.
 *
 * @param {DomElement} element
 *   The element is a pointer to the jQuery object that will be wrapped in the 
 *   ActionList.
 * @param {Object} options
 *   Options for the ActionList. May contain the following optional properties:
 *   - text: Text for the message displayed in the ActionList. HTML or plain text
 *     can be passed in. Defaults to 'Continue?'.
 *   - actionButton: Text displayed in the action button. Defaults to 'OK'.
 *   - cancelButton: Text displayed in the cancellation button. Defaults to
 *     'Cancel'.
 * @param {Object} callbacks
 *   Button callback functions for the ActionList. May contain the following
 *   optional properties (if either of these are not set, the ActionList will
 *   simply be closed when the corresponding button is clicked):
 *   - action: Callback to invoke when the action button is clicked.
 *   - cancel: Callback to invoke when the cancellation button is clicked.
 * @return {Boolean}
 *   Returns true if the ActionList initializes.
 */
ThemeBuilder.ui.ActionList.prototype.initialize = function (options) {
  
  if (!options && !options.actions) {
    return null;
  }
  
  var $ = jQuery;
  this._$pointer = null;
  this._actions = options.actions;
  this._wrapperId = '';
  this._wrapperClasses = [];
  if (options.wrapper) {
    this._wrapperId = (options.wrapper.id) ? options.wrapper.id : '';
    this._wrapperClasses = (options.wrapper.classes) ? options.wrapper.classes : [];
  }
  this._type = 'ActionList';
  
  // Build the DOM element
  this._build();
  
  return this;
};

ThemeBuilder.ui.ActionList.prototype._build = function () {
  var $ = jQuery;
  // Make a wrapper for the UI element
  var wrapperClasses = ['actions'];
  $.merge(wrapperClasses, this._wrapperClasses);
  var $wrapper = $('<ul>', {
    id: ((this._wrapperId) ? this._wrapperId : "themebuilder-actionlist")
  }).addClass(wrapperClasses.join(' '));
  // Loop through the actions and create action items for each one
  for (var i = 0; i < this._actions.length; i++) {
    var itemClasses = [];
    var linkClasses = ['action'];
    var handler = ThemeBuilder.bind(this, this._respond, this._actions[i].action);
    var label = this._actions[i].label;
    if (!label) {
      $.error(Drupal.t('No label provided for ') + this._actions[i]);
    }
    // Create a class name from the label and add to the linkClasses
    $.merge(linkClasses, [ThemeBuilder.util.getSafeClassName(label)]);
    // Check for item linkClasses
    if (this._actions[i].linkClasses) {
      $.merge(linkClasses, this._actions[i].linkClasses);
    }
    // Check for itemClasses
    if (this._actions[i].itemClasses) {
      $.merge(itemClasses, this._actions[i].itemClasses);
    }
    var $item = $('<li>', {
      html: $('<a>', {
        html: $('<span>', {
          html: label
        }),
        click: handler
      }).addClass(linkClasses.join(' '))
    }).addClass(itemClasses.join(' '));
    $item.appendTo($wrapper);
  }
  // Save a pointer to the jQuery object
  this._$pointer = $wrapper;
};

/**
 * Destroys the ActionList DOM element
 */
ThemeBuilder.ui.ActionList.prototype._close = function () {
  this._$pointer.remove();
};

/**
 * Returns the form data to the interaction control that instantiated this ActionList
 * 
 * @param {Event} event
 *   The ActionList button click event
 * @param {function} action
 *   The callback associated with the button, defined by the instantiating 
 *   interaction control.
 */
ThemeBuilder.ui.ActionList.prototype._respond = function (event, action) {
  action(event);
};

/**
 * Returns a jQuery pointer to this object
 *
 * @return {object}
 *   Returns null if the carousel has no pointer.
 */
ThemeBuilder.ui.ActionList.prototype.getPointer = function () {
  if (this._$pointer) {
    return this._$pointer;
  } 
  else {
    return null;
  }
};

/**
 * Utility function to remove 'px' from calculated values.  The function assumes that
 * that unit 'value' is pixels.
 *
 * @param {String} value
 *   The String containing the CSS value that includes px.
 * @return {int}
 *   Value stripped of 'px' and casted as a number or NaN if 'px' is not found in the string.
 */
ThemeBuilder.ui.ActionList.prototype._stripPX = function (value) {
  var index = value.indexOf('px');
  if (index === -1) {
    return NaN;
  }
  else {
    return Number(value.substring(0, index));
  }
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true debug: true*/

var ThemeBuilder = ThemeBuilder || {};

/**
 * This class is responsible for displaying the available layouts and allowing
 * the user to choose among them.
 * @class
 */
ThemeBuilder.LayoutEditor = ThemeBuilder.initClass();

/**
 * The LayoutEditor is a singleton, and this static method is used to retrieve
 * the instance.
 */
ThemeBuilder.LayoutEditor.getInstance = function () {
  if (!ThemeBuilder.LayoutEditor._instance) {
    ThemeBuilder.LayoutEditor._instance = new ThemeBuilder.LayoutEditor();
  }
  return ThemeBuilder.LayoutEditor._instance;
};

/**
 * This is the constructor for the LayoutEditor class.
 */
ThemeBuilder.LayoutEditor.prototype.initialize = function () {
  var $ = jQuery;
  Drupal.settings.layoutWidth = 'all';
  Drupal.settings.layoutCols = 'all';
  Drupal.settings.originalLayoutIndex = Drupal.settings.layoutIndex || Drupal.settings.layoutGlobal;
  this.currentPage = window.location.pathname.substring(Drupal.settings.basePath.length);
  if (this.currentPage === "") {
    // This is the Front page.
    this.currentPage = '<front>';
  }
  this.localmod = new ThemeBuilder.layoutEditorModification(this.currentPage);
  this.localmod.setPriorState(this.layoutNameToClass(Drupal.settings.layoutIndex));

  this.globalmod = new ThemeBuilder.layoutEditorModification('<global>');
  this.globalmod.setPriorState(this.layoutNameToClass(Drupal.settings.layoutGlobal));
  ThemeBuilder.addModificationHandler(ThemeBuilder.layoutEditorModification.TYPE, this);
};

/**
 * Called when the contents for this tab have been loaded.  If the showOnLoad
 * method has been called, this will invoke the show method.
 */
ThemeBuilder.LayoutEditor.prototype.loaded = function () {
  this._isLoaded = true;
  if (this._showOnLoad === true) {
    this.show();
  }
};

/**
 * Returns a flag that indicates whether the contents for this tab have been
 * loaded.
 *
 * @return {boolean}
 *   true if the contents have been loaded; false otherwise.
 */
ThemeBuilder.LayoutEditor.prototype.isLoaded = function () {
  return this._isLoaded === true;
};

/**
 * Sets a flag that causes this tab to be displayed as soon as the contents
 * have been loaded.
 */
ThemeBuilder.LayoutEditor.prototype.showOnLoad = function () {
  this._showOnLoad = true;
};

/**
 * Puts the layouts into a carousel.  This can only happen after the contents
 * have been loaded.
 */
ThemeBuilder.LayoutEditor.prototype.initializeLayouts = function () {
  var $ = jQuery;
  $('#layouts_carousel').jcarousel({scroll: 2,
        initCallback: ThemeBuilder.bind(this, this.setCarousel)});
  $('#layouts_carousel .layout-shot .options div').click(ThemeBuilder.util.stopEvent);
	// The Cancel button needs to stop the event propogation as well, otherwise the .layout-shot will get a click event in IE and reapply the cancelled layout
  $('#layouts_carousel .layout-shot .cancel').click(ThemeBuilder.util.stopEvent);
};

/**
 * Sets the carousel for this LayoutEditor instance.
 *
 * @param carousel
 *   The new carousel instance.
 */
ThemeBuilder.LayoutEditor.prototype.setCarousel = function (carousel) {
  this.carousel = carousel;
};

/**
 * This function is part of the modfunc scheme introduced for the styles tab.
 * It is not used here and will soon be removed.
 */
ThemeBuilder.LayoutEditor.prototype.processModification = function (modification, state) {
};

/**
 * Called when the associated tab is selected by the user and the tab's
 * contents are to be displayed.
 */
ThemeBuilder.LayoutEditor.prototype.show = function () {
  if (!this.isLoaded()) {
    // Not ready to actually show anything yet.
    this.showOnLoad();
  }
  else if (!this.carousel) {
    this.initializeLayouts();
  }
};

/**
 * Called when a different tab is selected by the user and this tab's contents
 * are to be hidden.
 */
ThemeBuilder.LayoutEditor.prototype.hide = function () {
  this.cancelPreview();
  return true;
};

/**
 * Provides the class name associated with the specified layout.  The class
 * can be attached to the body tag in the document to cause the specified
 * layout to be realized.
 *
 * @param {String} layoutName
 *   The name of the layout.
 *
 * @return {String}
 *   The class name corresponding to the specified layout.
 */
ThemeBuilder.LayoutEditor.prototype.layoutNameToClass = function (layoutName) {
  var result = '';
  if (layoutName) {
    result = 'body-layout-' + layoutName;
  }
  return result;
};

/**
 * Provides a basic layout name given the body class that represents the layout.
 *
 * @param {String} classname
 *   The body class that represents the layout
 * @return
 *   A string containing the layout name.
 */
ThemeBuilder.LayoutEditor.prototype.classToLayoutName = function (classname) {
  var name = classname.split('body-layout-')[1]
    .split(' ')[0];
  return name;
};

/**
 * Returns the name of the layout based on the body class associated with the current page.
 *
 * Note that this isn't the full layout class, but rather the name of the layout only.
 *
 * @return
 *   The name of the layout.
 */
ThemeBuilder.LayoutEditor.prototype.getPageLayoutName = function () {
  var $ = jQuery;
  var name = this.classToLayoutName($('body', parent.document)
    .attr('class'));
  return name;
};

/**
 * This method is responsible for changing the layout for preview mode, a
 * global layout change, and a single page layout change.
 *
 * @param {String} layoutName
 *   The name of the layout being selected.
 * @param {String} scope
 *   Indicates the scope of the change being applied.  "all" indicates the
 *   change should be committed for all pages.  "single" indicates the change
 *   should be committed only for the current page.  Anything else indicates
 *   the change should be previewed only (not committed.
 */
ThemeBuilder.LayoutEditor.prototype.pickLayout = function (layoutName, scope) {
  var $ = jQuery;
  var layout = this.layoutNameToClass(layoutName);
  var elem = $('#themebuilder-main .layout-' + layoutName);
  if (scope === 'all' || scope === 'single') {
    $('div', elem).not('.applied').fadeOut('fast', function () {
        elem.removeClass('preview');
        $('div', elem).css('opacity', '').css('display', '');
        $('#themebuilder-main .layout-shot.preview').removeClass('preview');
      });
  } else {
    $('#themebuilder-main .layout-shot.preview').removeClass('preview');
  }
  // Make a dialog.
  switch (scope) {
  case 'all':
    this.saveLayoutSelection(layout, '<global>');
    break;
  case 'single':
    this.saveLayoutSelection(layout, this.currentPage);
    break;
  default:
    elem.addClass('preview');
    this.previewSelection(layoutName);
    break;
  }
};

/**
 * Causes the specified layout to be set in preview mode (i.e. not committed
 * to the server.
 *
 * @param {String} layoutName
 *   The name of the layout to preview.
 */
ThemeBuilder.LayoutEditor.prototype.previewSelection = function (layoutName) {
  var $ = jQuery;
  var name = this.getPageLayoutName();
  var layoutClass = this.layoutNameToClass(name);
  $('body', parent.document).removeClass(layoutClass);
  // change this
  $('body', parent.document).addClass(this.layoutNameToClass(layoutName));
  this.shuffleRegionMarkup(layoutName);
};

/**
 * Returns an object that reveals the display order given the specified layout
 * name.
 *
 * @param {String} layoutName
 *   The string that identifies the order in which the columns should be
 *   displayed
 * @return
 *   An object with fields 'left' and 'right' that indicate each of the
 *   columns that should be visible in the specified layout, and whether those
 *   should be floated to the left or to the right.
 */
ThemeBuilder.LayoutEditor.prototype.getSidebarOrdering = function (layoutName) {
  var layoutIndex = layoutName.lastIndexOf('-');
  if (layoutIndex === -1) {
    ThemeBuilder.logCallback('Error - ThemeBuilder.LayoutEditor.getSidebarOrdering failed to determine the layout order for the layout ' + layoutName);
    return null;
  }
  var layout = layoutName.slice(layoutIndex + 1);
  var layoutArray = layout.split('');
  var result = {left: [],  right: []};
  var side = result.left;
  for (var i = 0; i < layoutArray.length; i++) {
    if (layoutArray[i] === 'c') {
      // Switch sides
      side = result.right;
    }
    else {
      side.push(layoutArray[i]);
    }
  }
  return result;
};

/**
 * Moves the markup around to support previewing a layout.  The order is
 * revealed in the specified order object, in which the order of the columns
 * is identified in fields 'left' and 'right'.  Note that these orders
 * represent the desired display orders, but not necessarily the order in
 * which the column markup should be written.  (float right requires that the
 * right-most column be written before the column just to the left of it, if
 * both are floated right).
 *
 * @param {jQueryElement} $parentElement
 *   The parent within which the columns to be moved are placed.
 * @param {Object} order
 *   An object with fields left and right that reveal the desired display
 *   order of the columns.  Note that the content column ('c') should not
 *   appear in the arrays.
 */
ThemeBuilder.LayoutEditor.prototype.shuffleRegionMarkup = function (layoutName) {
  var $ = jQuery;
  var sidebarMap = {};
  var useTbPrefix = false;
  var $parentElement = $('.tb-preview-shuffle-regions');
  if ($parentElement.length <= 0) {
    // This theme adjusts the layout based solely on the body tag.  No further
    // manipulation required.
    return;
  }
  if ($parentElement.length > 1) {
    // The themebuilder can not currently handle more than one parent that
    // requires children to be shuffled.  This could be supported at a later
    // time assuming we include a scheme in which the user can select which
    // part of the layout is being modified.
    throw 'Found ' + $parentElement.length + ' tb-preview-shuffle-regions elements in the markup.  The themebuilder cannot currently handle this.';
  }
  // 1 shuffle region.
  var order = this.getSidebarOrdering(layoutName);
  if (!order) {
    return;
  }

  var $sidebars = $parentElement.find('.tb-sidebar');
  for (var i = 0; i < $sidebars.length; i++) {
    if (!useTbPrefix && $sidebars[i].id.indexOf('tb-') === 0) {
      useTbPrefix = true;
    }
    sidebarMap['#' + $sidebars[i].id] = $sidebars[i];
  }
  var $content = $parentElement.find('.tb-primary');
  // Write the left columns in order, applying tb-left to float it left.
  for (i = 0; i < order.left.length; i++) {
    var id = '#' + (useTbPrefix ? 'tb-' : '') + 'sidebar-' + order.left[i];
    $(id).appendTo($parentElement)
      .removeClass('tb-right right')
      .addClass('tb-left left')
      .removeClass('tb-hidden');
    delete sidebarMap[id];
  }

  // Write the right columns in *reverse* order, applying tb-right to float it right.
  for (i = order.right.length - 1; i >= 0; i--) {
    id = '#' + (useTbPrefix ? 'tb-' : '') + 'sidebar-' + order.right[i];
    $(id).appendTo($parentElement)
      .removeClass('tb-left left')
      .addClass('tb-right right')
      .removeClass('tb-hidden');
    delete sidebarMap[id];
  }

  // Write the remaining (hidden) columns.
  for (id in sidebarMap) {
    if (typeof(id) === 'string') {
      $(id).appendTo($parentElement)
        .removeClass('tb-left left')
        .addClass('tb-right right')
        .addClass('tb-hidden');
    }
  }
  // Append content.  Note that the content region must always go last.
  $content.appendTo($parentElement);
};

/**
 * Cancels the current preview, causing the layout currently committed for the
 * current page to be used.
 *
 * @param {DomEvent} event
 *   (Optional) The event used to trigger the cancelPreview.  If provided, the
 *   event will be stopped.
 */
ThemeBuilder.LayoutEditor.prototype.cancelPreview =  function (event) {
  var $ = jQuery;
  event = event || window.event;
  if (!Drupal.settings.layoutIndex) {
    this.previewSelection(Drupal.settings.layoutGlobal);
  }
  else {
    this.previewSelection(Drupal.settings.layoutIndex);
  }
  $('#themebuilder-main .layout-shot.preview').removeClass('preview');
  if (event) {
    return ThemeBuilder.util.stopEvent(event);
  }
};

/**
 * Saves the layout.
 *
 * @param {string} layout
 *   The name of the layout to apply.
 * @param {string} url_pattern
 *   The url pattern for which this theme should apply.  "<global>" indicates
 *   this layout should be used for the entire site; any other string will
 *   be used as a url pattern for which the specified layout will apply.
 */
ThemeBuilder.LayoutEditor.prototype.saveLayoutSelection = function (layout, url_pattern) {
  if (url_pattern !== '<global>') {
    this.localmod.setNewState(layout);
    ThemeBuilder.applyModification(this.localmod);
    this.localmod = this.localmod.getFreshModification();
  }
  else {
    this.globalmod.setNewState(layout);
    this.localmod.setNewState('');
    var modification = new ThemeBuilder.GroupedModification();
    modification.addChild(this.currentPage, this.localmod);
    modification.addChild('<global>', this.globalmod);
    ThemeBuilder.applyModification(modification);
    this.globalmod = this.globalmod.getFreshModification();
    this.localmod = this.localmod.getFreshModification();
  }
};

/**
 * Applies the specified modification description to the client side only.
 * This allows the user to preview the modification without committing it
 * to the theme.
 *
 * @param {Object} desc
 *   The modification description.  To get this value, you should pass in
 *   the result of Modification.getNewState() or Modification.getPriorState().
 * @param {Modification} modification
 *   The modification that represents the change in the current state that
 *   should be previewed.
 */
ThemeBuilder.LayoutEditor.prototype.preview = function (desc, modification) {
  var $ = jQuery;
  // Get the layout name...
  var name = this.getPageLayoutName();
  var layoutClass = this.layoutNameToClass(name);
  var newName = desc.layout.split('body-layout-')[1];

  // Highlight the appropriate image in the layout selector.
  var screenshot = $('#themebuilder-main .layout-' + newName);
  var scope = desc.selector === '<global>' ? 'all' : 'single';
  $('#themebuilder-main .layout-shot.' + scope).removeClass(scope);
  if (desc.selector === this.currentPage) {
    $('#themebuilder-main .layout-shot.single').removeClass('single');
    screenshot.addClass('single');
    Drupal.settings.layoutIndex = newName;
  }
  else if (desc.selector === '<global>') {
    $('#themebuilder-main .layout-shot.all').removeClass('all');
    screenshot.addClass('all');
    Drupal.settings.layoutGlobal = newName;
  }
  else {
    //not handling yet
  }

  // Fix the body class to set the new layout.
  $('body', parent.document).removeClass(layoutClass);
  if (desc.layout) {
    $('body', parent.document).addClass(desc.layout);
    this.shuffleRegionMarkup(this.classToLayoutName(desc.layout));
  }
  else {
    $('body', parent.document).addClass(this.layoutNameToClass(Drupal.settings.layoutGlobal));
    this.shuffleRegionMarkup(Drupal.settings.layoutGlobal);
  }
};
;
/**
 * jQuery.Rule - Css Rules manipulation, the jQuery way.
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 02/27/2008
 * Compatible with jQuery 1.2.x, tested on FF 2, Opera 9, Safari 3, and IE 6, on Windows.
 *
 * @author Ariel Flesler
 * @version 1.0.1
 *
 * @id jQuery.rule
 * @param {Undefined|String|jQuery.Rule} The rules, can be a selector, or literal CSS rules. Many can be given, comma separated.
 * @param {Undefined|String|DOMElement|jQuery) The context stylesheets, all of them by default.
 * @return {jQuery.Rule} Returns a jQuery.Rule object.
 *
 * @example $.rule('p,div').filter(function(){ return this.style.display != 'block'; }).remove();
 *
 * @example $.rule('div{ padding:20px;background:#CCC}, p{ border:1px red solid; }').appendTo('style');
 *
 * @example $.rule('div{}').append('margin:40px').css('margin-left',0).appendTo('link:eq(1)');
 *
 * @example $.rule().not('div, p.magic').fadeOut('slow');
 *
 * @example var text = $.rule('#screen h2').add('h4').end().eq(4).text();
 */
;(function( $ ){	
	
   /**
	* Notes
	*	Some styles and animations might fail, please report it.
	*	The plugin needs a style node to stay in the DOM all along to temporarily hold rules. DON'T TOUCH IT.
	*	Opera requires this style to have alternate in the rel to allow disabling it.
	*	Rules in IE don't have .parentStylesheet. We need to find it each time(slow).
	*	Animations need close attention. Programatically knowing which rule has precedence, would require a LOT of work.
	*	This plugin adds $.rule and also 4 methods to $.fn: ownerNode, sheet, cssRules and cssText
	*	Note that rules are not directly inside nodes, you need to do: $('style').sheet().cssRules().
	*/
	
	var storageNode = $('<style rel="alternate stylesheet" type="text/css" />').appendTo('head')[0],//we must append to get a stylesheet
		sheet = storageNode.sheet ? 'sheet' : 'styleSheet',
		storage = storageNode[sheet],//css rules must remain in a stylesheet for IE and FF
		rules = storage.rules ? 'rules' : 'cssRules',
		remove = storage.deleteRule ? 'deleteRule' : 'removeRule',
		owner = storage.ownerNode ? 'ownerNode' : 'owningElement',		
		reRule = /^([^{]+)\{([^}]*)\}/m,
		reStyle = /([^:]+):([^;}]+)/;	

	storage.disabled = true;//let's ignore your rules 
	
	var $rule = $.rule = function( r, c ){
		if(!(this instanceof $rule))
			return new $rule( r, c );

		this.sheets = $rule.sheets(c);
		if( r && reRule.test(r) )
			r = $rule.clean( r );
		if( typeof r == 'object' && !r.exec )
			return this.setArray( r.get ? r.get() : r.splice ? r : [r] );
		this.setArray( this.sheets.cssRules().get() );
		return r ? this.filter( r ) : this;
	};
	
	$.extend( $rule, {
		sheets:function( c ){
			var o = c;
			if( typeof o != 'object' )
				o = $.makeArray(parent.document.styleSheets);
			o = $(o).not(storage);//skip our stylesheet
			if( typeof c == 'string' )
				o = o.ownerNode().filter(c).sheet();
			return o;
		},
		rule:function( str ){
			if( str.selectorText )/* * */
				return [ '', str.selectorText, str.style.cssText ];
			return reRule.exec( str );
		},
		appendTo:function( r, ss, skip ){
			switch( typeof ss ){//find the desired stylesheet
				case 'string': ss = this.sheets(ss);
				case 'object':
					if( ss[0] ) ss = ss[0];
					if( ss[sheet] ) ss = ss[sheet];
					if( ss[rules] ) break;//only if the stylesheet is valid
				default:
					if( typeof r == 'object' ) return r;//let's not waist time, it is parsed
					ss = storage;
			}
			var p;
			if( !skip && (p = this.parent(r)) )//if this is an actual rule, and it's appended.
				r = this.remove( r, p );
				
			var rule = this.rule( r );			
			if( ss.addRule )
				ss.addRule( rule[1], rule[2]||';' );//IE won't allow empty rules
			else if( ss.insertRule )
				ss.insertRule( rule[1] + '{'+ rule[2] +'}', ss[rules].length );
			
			return ss[rules][ ss[rules].length - 1 ];//return the added/parsed rule
		},
		remove:function( r, p ){
			p = p || this.parent(r);
			if( p != storage ){//let's save some unnecesary cycles.
				var i = p ? $.inArray( r, p[rules] ) : -1;
				if( i != -1 ){//if not stored before removal, IE will crash eventually, and some rules in FF get messed up
					r = this.appendTo( r, 0 /*storage*/, true );//is faster and shorter to imply storage
					p[remove](i);
				}
			}
			return r;
		},
		clean:function( r ){
			return $.map( r.split('}'), function( txt ){
				if( txt )
					return $rule.appendTo( txt + '}' /*, storage*/ );//parse the string, storage implied
			});
		},
		parent:function( r ){//CSS rules in IE don't have parentStyleSheet attribute
			if( typeof r == 'string' || !$.browser.msie )//if it's a string, just return undefined.
				return r.parentStyleSheet;

			var par;
			this.sheets().each(function(){
				if( $.inArray(r, this[rules]) != -1 ){
					par = this;	
					return false;
				}
			});
			return par;
		},
		outerText:function( rule ){
			return !rule ? '' : [rule.selectorText+'{', '\t'+rule.style.cssText,'}'].join('\n');//.toLowerCase();
		},
		text:function( rule, txt ){
			if( txt !== undefined )
				rule.style.cssText = txt;
			return !rule ? '' : rule.style.cssText;//.toLowerCase();
		}
	});
	
	$rule.fn = $rule.prototype = {
		pushStack:function( rs, sh ){
			var ret = $rule( rs, sh || this.sheets );
			ret.prevObject = this;
			return ret;
		},
		end:function(){
			return this.prevObject || $rule(0,[]);
		},
		filter:function( s ){
			var o;
			if( !s ) s = /./;//just keep them all.
			if( s.split ){
				o = $.trim(s).toLowerCase().split(/\s*,\s*/);
				s = function(){
          var to_grep;
          if (this.selectorText) {
            to_grep = this.selectorText.toLowerCase().split(/\s*,\s*/);
          } else {
            to_grep = [];
          }
					var grep_result = $.grep( to_grep, function( sel ){
						return $.inArray( sel, o ) != -1;
					});
					return (grep_result.length > 0);
				};
			}
      else if( s.exec ){//string regex, or actual regex
				o = s;
				s = function(){ return o.test(this.selectorText); };
			}
			return this.pushStack($.grep( this, function( e, i ){
				return s.call( e, i );
			}));
		},
		add:function( rs, c ){
			return this.pushStack( $.merge(this.get(), $rule(rs, c)) );	
		},
		is:function( s ){
			return !!(s && this.filter( s ).length);
		},
		not:function( n, c ){
			n = $rule( n, c );
			return this.filter(function(){
				return $.inArray( this, n ) == -1;
			});
		},
		append:function( s ){
			var rules = this, rule;
			$.each( s.split(/\s*;\s*/),function(i,v){
				if(( rule = reStyle.exec( v ) ))
					rules.css( rule[1], rule[2] );
			});
			return this;
		},
		text:function( txt ){
			return !arguments.length ? $rule.text( this[0] )
				: this.each(function(){	$rule.text( this, txt ); });
		},
		outerText:function(){
			return $rule.outerText(this[0]);	
		}
	};
	
	$.each({
		ownerNode:owner,//when having the stylesheet, get the node that contains it
		sheet:sheet, //get the stylesheet from the node
		cssRules:rules //get the rules from the stylesheet.
	},function( m, a ){
		var many = a == rules;//the rules need some more processing
		$.fn[m] = function(){
			return this.map(function(){
				return many ? $.makeArray(this[a]) : this[a];
			});
		};
	});
	
	$.fn.cssText = function(){
		return this.filter('link,style').eq(0).sheet().cssRules().map(function(){
			return $rule.outerText(this);							   
		}).get().join('\n');
	};
	
	$.each('remove,appendTo,parent'.split(','),function( k, f ){
		$rule.fn[f] = function(){
			var args = $.makeArray(arguments), that = this;
			args.unshift(0);
			return this.each(function( i ){
				args[0] = this;
				that[i] = $rule[f].apply( $rule, args ) || that[i];
			});
		};
	});
		
	$.each(('each,index,toArray,get,size,eq,slice,map,attr,andSelf,css,show,hide,toggle,'+
			'queue,dequeue,stop,animate,fadeIn,fadeOut,fadeTo').split(','),function( k, f ){
		$rule.fn[f] = $.fn[f];																				  
	});

	// patch for jquery 1.4.2: (use old setArray function from jquery 1.4.1 which disappeared in 1.4.2)
	$rule.fn.setArray=function( elems ) {
		// Resetting the length to 0, then using the native Array push
		// is a super-fast way to populate an object with array-like properties
		this.length = 0;
		Array.prototype.push.apply( this, elems );
		return this;
	};
	
	var curCSS = $.curCSS;
	$.curCSS = function( e, a ){//this hack is still quite exprimental
		return ('selectorText' in e ) ?
			e.style[a] || $.prop( e, a=='opacity'? 1 : 0,'curCSS', 0, a )//TODO: improve these defaults
		: curCSS.apply(this,arguments);
	};
	
	/**
	 * Time to hack jQuery.data for animations.
	 * Only IE really needs this, but to keep the behavior consistent, I'll hack it for all browsers.
	 * TODO: This kind of id doesn't seem to be good enough
	 * TODO: Avoid animating similar rules simultaneously
	 * TODO: Avoid rules' precedence from interfering on animations ?
	 */
	$rule.cache = {};
	var mediator = function( original ){
		return function( elm ){
			var id = elm?elm.selectorText:null;
			if( id )
				arguments[0] = $rule.cache[id] = $rule.cache[id] || {};
			return original.apply( $, arguments );	
		};
	};
	$.data = mediator( $.data );
	$.removeData = mediator( $.removeData );
	
	$(window).unload(function(){
		$(storage).cssRules().remove();//empty our rules bin
	});
	
})( jQuery );
;
/**
 *
 * Color picker
 * Author: Stefan Petre www.eyecon.ro
 * 
 * Dual licensed under the MIT and GPL licenses
 * 
 */
(function ($) {
	var ColorPicker = function () {
		var
			ids = {},
			inAction,
			charMin = 65,
			visible,
			tpl = '<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',
			defaults = {
				eventName: 'click',
				onShow: function () {},
				onBeforeShow: function(){},
				onHide: function () {},
				onChange: function () {},
				onSubmit: function () {},
				color: 'ff0000',
				livePreview: true,
				flat: false
			},
			fillRGBFields = function  (hsb, cal) {
				var rgb = HSBToRGB(hsb);
				$(cal).data('colorpicker').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function  (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(4).val(hsb.h).end()
					.eq(5).val(hsb.s).end()
					.eq(6).val(hsb.b).end();
			},
			fillHexFields = function (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(0).val(HSBToHex(hsb)).end();
			},
			setSelector = function (hsb, cal) {
				$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
				$(cal).data('colorpicker').selectorIndic.css({
					left: parseInt(150 * hsb.s/100, 10),
					top: parseInt(150 * (100-hsb.b)/100, 10)
				});
			},
			setHue = function (hsb, cal) {
				$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
			},
			setCurrentColor = function (hsb, cal) {
				$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			setNewColor = function (hsb, cal) {
				$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			keyDown = function (ev) {
				var pressedKey = ev.charCode || ev.keyCode || -1;
				if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
					return false;
				}
				var cal = $(this).parent().parent();
				if (cal.data('colorpicker').livePreview === true) {
					change.apply(this);
				}
			},
			change = function (ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colorpicker').color = col = fixHSB({
						h: parseInt(0 + cal.data('colorpicker').fields.eq(4).val(), 10),
						s: parseInt(0 + cal.data('colorpicker').fields.eq(5).val(), 10),
						b: parseInt(0 + cal.data('colorpicker').fields.eq(6).val(), 10)
					});
				} else {
					cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
						r: parseInt(0 + cal.data('colorpicker').fields.eq(1).val(), 10),
						g: parseInt(0 + cal.data('colorpicker').fields.eq(2).val(), 10),
						b: parseInt(0 + cal.data('colorpicker').fields.eq(3).val(), 10)
					}));
				}
				if (ev) {
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
			},
			blur = function (ev) {
				var cal = $(this).parent().parent();
				cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
			},
			focus = function () {
				charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
				$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				$(this).parent().addClass('colorpicker_focus');
			},
			downIncrement = function (ev) {
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colorpicker_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colorpicker').livePreview					
				};
				$(parent.document).bind('mouseup', current, upIncrement);
				$(parent.document).bind('mousemove', current, moveIncrement);
			},
			moveIncrement = function (ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colorpicker_slider').find('input').focus();
				$(parent.document).unbind('mouseup', upIncrement);
				$(parent.document).unbind('mousemove', moveIncrement);
				return false;
			},
			downHue = function (ev) {
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(parent.document).bind('mouseup', current, upHue);
				$(parent.document).bind('mousemove', current, moveHue);
			},
			moveHue = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upHue = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(parent.document).unbind('mouseup', upHue);
				$(parent.document).unbind('mousemove', moveHue);
				return false;
			},
			downSelector = function (ev) {
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(parent.document).bind('mouseup', current, upSelector);
				$(parent.document).bind('mousemove', current, moveSelector);
			},
			moveSelector = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(6)
						.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
						.end()
						.eq(5)
						.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upSelector = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(6)
						.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
						.end()
						.eq(5)
						.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(parent.document).unbind('mouseup', upSelector);
				$(parent.document).unbind('mousemove', moveSelector);
				return false;
			},
			enterSubmit = function (ev) {
				$(this).addClass('colorpicker_focus');
			},
			leaveSubmit = function (ev) {
				$(this).removeClass('colorpicker_focus');
			},
			clickSubmit = function (ev) {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').color;
				cal.data('colorpicker').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
			},
			show = function (ev) {
				var cal = $('#' + $(this).data('colorpickerId'), parent.window);
				cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
				var pos = $(this).offset();
				var viewPort = getViewport();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				if (top + 176 > viewPort.t + viewPort.h) {
					top -= this.offsetHeight + 176;
				}
				if (left + 356 > viewPort.l + viewPort.w) {
					left -= 356;
				}
				cal.css({left: left + 'px', top: top + 'px'});
				if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
					cal.show();
				}
				$(parent.document).bind('mousedown', {cal: cal}, hide);
				return false;
			},
			hide = function (ev) {
				if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
					if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
						ev.data.cal.hide();
					}
					$(parent.document).unbind('mousedown', hide);
				}
			},
			isChildOf = function(parentEl, el, container) {
				if (parentEl == el) {
					return true;
				}
				if (parentEl.contains) {
					return parentEl.contains(el);
				}
				if ( parentEl.compareDocumentPosition ) {
					return !!(parentEl.compareDocumentPosition(el) & 16);
				}
				var prEl = el.parentNode;
				while(prEl && prEl != container) {
					if (prEl == parentEl)
						return true;
					prEl = prEl.parentNode;
				}
				return false;
			},
			getViewport = function () {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			}, 
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			}, 
			HexToRGB = function (hex) {
				var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			HexToHSB = function (hex) {
				return RGBToHSB(HexToRGB(hex));
			},
			RGBToHSB = function (rgb) {
				var hsb = {
					h: 0,
					s: 0,
					b: 0
				};
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;
				if (max != 0) {
					
				}
				hsb.s = max != 0 ? 255 * delta / max : 0;
				if (hsb.s != 0) {
					if (rgb.r == max) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if (rgb.g == max) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if (hsb.h < 0) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			},
			/**
			 * Converts HSB values to RGB. Function adapted from
			 * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
			 *
			 * This is a patched version that has been submitted upstream; the
			 * original implementation was faulty, and prevents users from choosing
			 * colors such as #000999.
			 */
			HSBToRGB = function (hsb) {
				var h = hsb.h / 360;
				var s = hsb.s / 100;
				var v = hsb.b / 100;
				var r, g, b;

				var i = Math.floor(h * 6);
				var f = h * 6 - i;
				var p = v * (1 - s);
				var q = v * (1 - f * s);
				var t = v * (1 - (1 - f) * s);

				switch(i % 6){
					case 0: r = v, g = t, b = p; break;
					case 1: r = q, g = v, b = p; break;
					case 2: r = p, g = v, b = t; break;
					case 3: r = p, g = q, b = v; break;
					case 4: r = t, g = p, b = v; break;
					case 5: r = v, g = p, b = q; break;
				}
				return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
			},
			RGBToHex = function (rgb) {
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function (nr, val) {
					if (val.length == 1) {
						hex[nr] = '0' + val;
					}
				});
				return hex.join('');
			},
			HSBToHex = function (hsb) {
				return RGBToHex(HSBToRGB(hsb));
			},
			restoreOriginal = function () {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').origColor;
				cal.data('colorpicker').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				if (typeof opt.color == 'string') {
					opt.color = HexToHSB(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = RGBToHSB(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}
				return this.each(function () {
					if (!$(this).data('colorpickerId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						var id = 'collorpicker_' + parseInt(Math.random() * 1000);
						$(this).data('colorpickerId', id);
						var cal = $(tpl).attr('id', id);
						if (options.flat) {
							cal.appendTo(this).show();
						} else {
							cal.appendTo(document.body);
						}
						options.fields = cal
											.find('input')
												.bind('keyup', keyDown)
												.bind('change', change)
												.bind('blur', blur)
												.bind('focus', focus);
						cal
							.find('span').bind('mousedown', downIncrement).end()
							.find('>div.colorpicker_current_color').bind('click', restoreOriginal);
						options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
						options.selectorIndic = options.selector.find('div div');
						options.el = this;
						options.hue = cal.find('div.colorpicker_hue div');
						cal.find('div.colorpicker_hue').bind('mousedown', downHue);
						options.newColor = cal.find('div.colorpicker_new_color');
						options.currentColor = cal.find('div.colorpicker_current_color');
						cal.data('colorpicker', options);
						cal.find('div.colorpicker_submit')
							.bind('mouseenter', enterSubmit)
							.bind('mouseleave', leaveSubmit)
							.bind('click', clickSubmit);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						if (options.flat) {
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							$(this).bind(options.eventName, show);
						}
					}
				});
			},
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						$('#' + $(this).data('colorpickerId'), parent.document).hide();
					}
				});
			},
			setColor: function(col) {
				if (typeof col == 'string') {
					col = HexToHSB(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = RGBToHSB(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function(){
					if ($(this).data('colorpickerId')) {
						var cal = $('#' + $(this).data('colorpickerId'), parent.document);
						cal.data('colorpicker').color = col;
						cal.data('colorpicker').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));
						setCurrentColor(col, cal.get(0));
						setNewColor(col, cal.get(0));
				                cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
					}
                                });
			}
		};
	}();
	$.fn.extend({
		ColorPicker: ColorPicker.init,
		ColorPickerHide: ColorPicker.hidePicker,
		ColorPickerShow: ColorPicker.showPicker,
		ColorPickerSetColor: ColorPicker.setColor
	});
})(jQuery)
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true */

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * An abstract class to represent a group of colors (either palette or custom).
 * @class
 */
ThemeBuilder.styles.Colorset = ThemeBuilder.initClass();
ThemeBuilder.styles.Colorset.prototype.initialize = function () {
};
ThemeBuilder.styles.Colorset.prototype.paletteIndexToHex = function (index) {
  if (this.colors[index]) {
    return this.colors[index].hex;
  }
  else {
    return false;
  }
};

ThemeBuilder.styles.Colorset.prototype.hexToPaletteIndex = function (hex) {
  // TODO: This is O(n). Add a lookup table.
  var i;
  for (i in this.colors) {
    if (this.colors[i].hex && this.colors[i].hex.toLowerCase() === hex.toLowerCase()) {
      return i;
    }
  }
  return false;
};

/**
 * Return a list of indexes for all colors in the palette.
 */
ThemeBuilder.styles.Colorset.prototype.getIndexes = function () {
  return this.getIndexesOfType('all');
};

/**
 * Return a list of indexes for the main colors in a palette.
 */
ThemeBuilder.styles.Colorset.prototype.getMainIndexes = function () {
  return this.getIndexesOfType('main');
};

/**
 * Helper function to return a list of indexes in a palette, for either all
 * palette colors or only the main palette colors (depending on how the
 * function is called).
 */
ThemeBuilder.styles.Colorset.prototype.getIndexesOfType = function (indexType) {
  if (indexType === 'main') {
    var colors = this.mainColors;
  }
  else if (indexType === 'all') {
    colors = this.colors;
  }
  else {
    throw 'Colorset getIndexesOfType function was called with an unexpected index type ' + indexType;
  }
  // TODO: Pretty sure this isn't safe. Revisit.
  var i;
  var indexes = [];
  for (i in colors) {
    if (ThemeBuilder.util.isNumeric(i) || typeof(i) === 'string') {
      indexes.push(i);
    }
  }
  return indexes;
};

ThemeBuilder.styles.Colorset.prototype.addColor = function (index, hex, name) {
  this.colors[index] = new ThemeBuilder.styles.PaletteColor(hex, name);
};

ThemeBuilder.styles.Colorset.prototype.removeColor = function (index) {
  throw 'Removing colors from palettes not fully implemented.';
  // TODO: Test to make sure delete works as expected.
  //delete this.colors[index];
};







/**
 * A class to represent a color palette.
 * @class
 * @extends ThemeBuilder.styles.Colorset
 */
ThemeBuilder.styles.Palette = ThemeBuilder.initClass();
ThemeBuilder.styles.Palette.prototype = new ThemeBuilder.styles.Colorset();

/**
 * Constructor.
 */
ThemeBuilder.styles.Palette.prototype.initialize = function (palette_id) {
  this.id = palette_id;
  var app = ThemeBuilder.getApplicationInstance();
  var data = app.getData();
  if (data) {
    this.colorDataLoaded(data);
  }
  else {
    app.addApplicationInitializer(ThemeBuilder.bind(this, this.colorDataLoaded));
  }
};

/**
 * Called when the color data has been loaded.  This occurs very early in the
 * initialization process through a request sent by the Application instance.
 *
 * @param data
 *   The application initialization data.
 */
ThemeBuilder.styles.Palette.prototype.colorDataLoaded = function (data) {
  // Store the complete list of palette colors (including tints).
  this.indexes = data.palette_info.indexes;
  this.colors = {};
  var palette = data.palette_info.palettes[this.id];
  var i;
  for (i = 0; i < this.indexes.length; i++) {
    var index = this.indexes[i];
    var hex = palette[index];
    this.colors[index] = new ThemeBuilder.styles.PaletteColor(hex, '');
  }
  // Store the list of main palette colors (i.e., the primary colors in the
  // palette).
  this.mainIndexes = data.palette_info.mainIndexes;
  this.mainColors = {};
  for (i = 0; i < this.mainIndexes.length; i++) {
    index = this.mainIndexes[i];
    hex = palette[index];
    this.mainColors[index] = new ThemeBuilder.styles.PaletteColor(hex, '');
  }
  // Store other palette information.
  this.name = palette.name;
};







/**
 * @class
 * @extends ThemeBuilder.styles.Colorset
 */
ThemeBuilder.styles.CustomColorset = ThemeBuilder.initClass();
ThemeBuilder.styles.CustomColorset.prototype = new ThemeBuilder.styles.Colorset();

ThemeBuilder.styles.CustomColorset.prototype.initialize = function (customColorInfo) {
  this.colors = {};
  var customColors = customColorInfo;
  var i;
  for (i in customColors) {
    if (ThemeBuilder.util.isNumeric(i)) {
      this.colors[i] = new ThemeBuilder.styles.PaletteColor(customColors[i], '');
    }
  }
};








/**
 * @class
 */
ThemeBuilder.styles.PaletteColor = ThemeBuilder.initClass();

ThemeBuilder.styles.PaletteColor.prototype.initialize = function (hex, name) {
  var cleanHex = ThemeBuilder.styles.PaletteColor.cleanHex(hex);
  if (cleanHex) {
    this.hex = cleanHex;
    this.name = name;
  }
};

/**
 * Remove # from a hex code.
 *
 * @param {String} hex
 * @return {String|Boolean}
 */
ThemeBuilder.styles.PaletteColor.cleanHex = function (hex) {
  if (this.isHex(hex)) {
    return hex.replace(/^#/g, '');
  }
  else {
    return false;
  }
};

/**
 * Check a hex code for validity. Note that 'transparent' is also allowed.
 *
 * @param {String} hex
 *   The potential hex code.
 * @return {Boolean}
 */
ThemeBuilder.styles.PaletteColor.isHex = function (hex) {
  if (hex === 'transparent') {
    return true;
  }
  var regex = /^#?([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$/;
  return regex.test(hex);
};

;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true */

ThemeBuilder.styles = ThemeBuilder.styles || {};
ThemeBuilder.styles.idRef = 0;

/**
 * @class
 */
ThemeBuilder.styles.PalettePicker = ThemeBuilder.initClass();

ThemeBuilder.styles.PalettePicker.prototype.initialize = function (swatchDiv, property, parentNode) {
  this.enabled = true;
  this.property = property;
  this.id = ThemeBuilder.styles.idRef++;
  this.template = 
  '<div class="PalettePickerMain">' +
     '<div class="header">' +
       '<div class="tabs">' +
         '<ul>' +
           '<li><a href="#picker-' + this.id + '"><div class="colorstab"></div></a></li>' +
           '<li><a href="#swatches-' + this.id + '"><div class="swatchestab"></div></a></li>' +
         '</ul>' + 
         '<div id="picker-' + this.id + '" class="picker"></div>' +
         '<div id="swatches-' + this.id + '" class="swatches">' +
           '<div class="palette-list-table"></div>' +
         '</div>' +
       '</div>' +
     '</div>' +
     '<div class="footer">' +
       '<div class="palette">' +
         '<table class="mycolors-table">' +
           '<tr><td class="cur-palette">Palette</td><td class="cust-palette">Custom</td></tr><tr><td><div class="current-palette palette-list"></div></td><td class="custom-palette-wrapper"><div class="custom-palette palette-list"></div></td></tr><tr><td></td><td></td><td rowspan="3"><div class="plus-button"></div></td></tr></table></div><table style="width:100%"><tr><td><a href class="cancelbutton">Cancel</a></td><td style="text-align:right"><button class="okbutton">OK</button></td></tr></table></div></div>';
  this.swatchDiv = jQuery(swatchDiv);
  this.paletteItems = {};

  if (parentNode) {
    this.dialog = jQuery(this.template).appendTo(parentNode);
  } else {
    this.dialog = jQuery(this.template).insertBefore(this.swatchDiv);
  }
  ThemeBuilder.getApplicationInstance().addApplicationInitializer(ThemeBuilder.bind(this, this.colorDataLoaded));
};

/**
 * Render the list of all of the different palettes.
 */
ThemeBuilder.styles.PalettePicker.prototype.renderPalettes = function (renderSection) {
  var colorManager = ThemeBuilder.getColorManager();
  if (!colorManager.isInitialized()) {
    // Cannot initialize yet.  We need the color manager to be fully initialized
    // first.
    
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this.colorDataLoaded), 50);
    return;
  }
  this.renderPalletesToTable(jQuery(renderSection, this.dialog));
  
  // When the palette changes, update all the color swatches in the dialog.
  jQuery("#themebuilder-style").bind("paletteChange", ThemeBuilder.bind(this, this.onPaletteChange));
 
  // When a swatch changes, update its corresponding PaletteItem.
  jQuery('#themebuilder-style').bind('swatchPreview', ThemeBuilder.bind(this, this.handleSwatchChange));
};

/**
 * Renders palletes with color previews to a jQuery object which is a <table>
 * @param jQuery targetTable
 *  A <table> jQuery object.
 * @param Integer maxPerColumn
 *   The number of palettes to show in a given column before starting a new one.
 * @return void
 */
ThemeBuilder.styles.PalettePicker.prototype.renderPalletesToTable  = function (targetTable, maxPerColumn) {
  var colorManager = ThemeBuilder.getColorManager();
  // Create a table row in the palettes tab for each available palette.
  var $ = jQuery;
  var palette_item, palette, i, index;
  var palettes = colorManager.getPalettes();
  var indexes = colorManager.getIndexes('palette main');
  var palettesInColumn = 0; // Number of palettes created in a given column.
  
  for (i in palettes) {
    if (typeof(palettes[i]) !== 'function') {
      palette = palettes[i];
      if (palettesInColumn === 0 || palettesInColumn === maxPerColumn) {
        palettesInColumn = 0;
        var palette_column = $('<div class="palette-column"></div>').appendTo(targetTable);
      }
      palettesInColumn += 1;
      
      var palette_wrapper = $('<div class="palette-group"></div>').appendTo(palette_column);
      var list_div = $('<div class="palette-list"></div>').appendTo(palette_wrapper);
      $('<div class="palette-name"></div>').appendTo(palette_wrapper).html(palette.name);
      this.renderPaletteItems(palette, indexes, list_div);
      palette_wrapper.data('palette_id', palette.id);
      palette_wrapper.click(ThemeBuilder.bind(this, this.setPalette));
    }
  }
};


/**
 * Creates a div for each color in indexes and appends to elem. 
 * 
 * @param ThemeBuilder.styles.Palette palette
 *  A Palette object like an element in the return of
 *  ThemeBuilder.styles.colorManager.getPalettes();
 *  
 * @param jQuery elem
 *  An element to append colored divs to.
 *
 * @param Array indexes
 *  An array of indexes as returned by ThemeBuilder.styles.colorManager.getIndexes().
 */
ThemeBuilder.styles.PalettePicker.prototype.renderPaletteItems = function (palette, indexes, elem) {
  for (var j = 0; j < indexes.length; j++) {
    var index = indexes[j];
    var hex = palette.paletteIndexToHex(index);
    var palette_item = jQuery('<div class="palette-item"></div>');
    palette_item.appendTo(elem);
    palette_item.css('background-color', "#" + hex);
    palette_item.addClass('item-' + index);
    palette_item.attr("title", hex);
  }
};

/**
 * Called when color data is available.  This data is received through a request
 * set by the Application class, very early in the loading process.
 */
ThemeBuilder.styles.PalettePicker.prototype.colorDataLoaded = function () {
  var colorManager = ThemeBuilder.getColorManager();
  if (!colorManager.isInitialized()) {
    // Cannot initialize yet.  We need the color manager to be fully initialized
    // first.
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this.colorDataLoaded), 50);
    return;
  }
  this.palette = colorManager.getPalette();
  this.custom = colorManager.getCustom();

  var indexes = colorManager.getIndexes('palette');
  this.createSwatches('current', this.palette, indexes);
  indexes = colorManager.getIndexes('custom');
  this.createSwatches('custom', this.custom, indexes);

  this.renderPalettes('#swatches-' + this.id + ' .palette-list-table');

  // initialize the custom color picker
  jQuery('#picker-' + this.id, this.dialog).ColorPicker({
    flat: true,
    color: '#00ff00',
    onSubmit: ThemeBuilder.bind(this, this.handleColorPickerSubmit)
  });

  // Append "Add" and "Replace" buttons to the colorpicker.
  var add_button = jQuery('<button class="add">Add</button>');
  add_button.data('action', 'add');
  var replace_button = jQuery('<button class="add">Replace</button>');
  replace_button.data('action', 'replace');
  add_button.appendTo(jQuery('#picker-' + this.id + ' .colorpicker', this.dialog));
  add_button.click(ThemeBuilder.bind(this, this.handleAddReplaceButtonSubmit));

  // Set up events:
  // Show/hide the dialog box when its swatch is clicked.
  this.swatchDiv.click(ThemeBuilder.bind(this, this.show));

  // Set up the "expand dialog" plus-sign button.
  jQuery('.plus-button', this.dialog).click(ThemeBuilder.bind(this, function () {
    this.dialog.toggleClass('expanded');
  }));

  // Handle the "OK" and "Cancel" buttons.
  jQuery('.okbutton', this.dialog).click(ThemeBuilder.bind(this, this.onOk));
  jQuery('.cancelbutton', this.dialog).click(ThemeBuilder.bind(this, this.onCancel));

  // When the palette changes, update all the color swatches in the dialog.
  jQuery("#themebuilder-style").bind("paletteChange", ThemeBuilder.bind(this, this.onPaletteChange));

  // When a swatch changes, update its corresponding PaletteItem.
  jQuery('#themebuilder-style').bind('swatchPreview', ThemeBuilder.bind(this, this.handleSwatchChange));


  // Create the two tabs in the expanded section of the dialog.
  jQuery('.header .tabs', this.dialog).tabs();
};

ThemeBuilder.styles.PalettePicker.prototype.createSwatches = function (type, palette, indexes) {
  var i, index, hex_code;
  var container = jQuery('.' + type + '-palette', this.dialog);
  for (i = 0; i < indexes.length; i++) {
    index = indexes[i];
    hex_code = palette.paletteIndexToHex(index);
    this.paletteItems[index] = new ThemeBuilder.styles.PaletteItem(this, hex_code, index, container);
  }
};

ThemeBuilder.styles.PalettePicker.prototype.handleColorPickerSubmit = function (hsb, hex, rgb, picker) {
  var action = jQuery(picker).data('action');
  var index;
  switch (action) {
  case 'add':
    // See if this color exists in the palette or the custom tray.
    var colorManager = ThemeBuilder.getColorManager();
    index = colorManager.hexToPaletteIndex(hex);
    // If it's a new color, add it to the custom tray.
    if (index === false) {
      index = colorManager.getNextCustomIndex();
      var swatchModification = this._addSwatchModification(index, hex);
      // Add a new listener, so that when the new palette item is created, we
      // can click it and change the color of the selected element.
      jQuery(this.dialog).bind('paletteItemCreated', ThemeBuilder.bind(this, this.handleNewPaletteItem));

      colorManager.swatchPreview(swatchModification.getNewState());
    }
    // This color already existed; just trigger its click event.
    else {
      this.paletteItems[index].click();
    }
    break;
  case 'replace':
    // Get the currently selected color index.
    //index = this.getIndex();
    // Figure out whether it's a palette or custom color.
    // Replace the color in the palette object and in the physical dialog.
    // If it's a palette color, trigger a palette change event.
    throw ('Replacing palette colors is not yet implemented.');
  default:
    throw "Colorpicker action buttons must have 'action' data associated.";
  }

};

/**
 * Add a SwatchModification to the existing grouped modification.
 */
ThemeBuilder.styles.PalettePicker.prototype._addSwatchModification = function (index, hex) {
  var modificationName = 'swatch' + index.toString();
  var swatchModification = this.modification.getChild(modificationName);
  if (!swatchModification) {
    // No previous SwatchModification for this custom color index. Set one up.
    swatchModification = new ThemeBuilder.SwatchModification('custom');
    swatchModification.setPriorState(index, null);
    this.modification.addChild(modificationName, swatchModification);
  }
  swatchModification.setNewState(index, hex);
  return swatchModification;
};

ThemeBuilder.styles.PalettePicker.prototype.handleAddReplaceButtonSubmit = function (e) {
  // Determine whether we're adding or replacing a color swatch.
  var action = jQuery.data(e.currentTarget, 'action');
  // Store that data on the picker element.
  var picker = jQuery('#picker-' + this.id, this.dialog);
  jQuery.data(picker.get(0), 'action', action);
  // Trigger the click event of the colorpicker. There is no other way to get
  // the color out of it, without rewriting the colorpicker plugin. :(
  jQuery('#picker-' + this.id + ' .colorpicker div.colorpicker_submit', this.dialog).click();
};

/**
 * Handle the swatchPreview event triggered by ColorManager when someone
 * adds a custom color.
 *
 * Note that this will be triggered on every preview and must be idempotent.
 */
ThemeBuilder.styles.PalettePicker.prototype.handleSwatchChange = function (e) {
  var index = e.index;
  var colorManager = ThemeBuilder.getColorManager();
  var hex = colorManager.paletteIndexToHex(index);
  var container;
  var indexType = colorManager.isValidIndex(index);
  switch (indexType) {
  case 'palette':
    container = jQuery('.current-palette', this.dialog);
    break;
  case 'custom':
    container = jQuery('.custom-palette', this.dialog);
    break;
  default:
    throw 'swatchChange event triggered with an invalid index';
  }
  // TODO: Handle replacing existing PaletteItems.
  if (this.paletteItems[index]) {
  }
  // If the PaletteItem doesn't already exist in the dialog, create it.
  else {
    this.paletteItems[index] = new ThemeBuilder.styles.PaletteItem(this, hex, index, container);
    jQuery(this.dialog).trigger({type: 'paletteItemCreated', index: index});
  }
};

/**
 * Handle the paletteItemCreated event.
 *
 * Only the PalettePicker where the user actually clicked on the colorpicker
 * should respond to this event, and it should respond only once. Nobody else
 * should care.
 */
ThemeBuilder.styles.PalettePicker.prototype.handleNewPaletteItem = function (e) {
  this.paletteItems[e.index].click();
  jQuery(this.dialog).unbind('paletteItemCreated');
};

/**
 * Change the palette.
 *
 * param {event} e
 *   The click event that triggered the palette set. Its target is a table
 *   row containing a palette, with a jQuery.data 'palette_id' attribute.
 */
ThemeBuilder.styles.PalettePicker.prototype.setPalette = function (e) {
  var colorManager = ThemeBuilder.getColorManager();
  var paletteModification = this.modification.getChild('palette');
  if (!paletteModification) {
    // Create a palette modification and initialize it.
    paletteModification = new ThemeBuilder.PaletteModification('global');
    this.palette = colorManager.getPalette();
    paletteModification.setPriorState(this.palette.id);
    this.modification.addChild('palette', paletteModification);
  }
  var palette_id = jQuery(e.currentTarget).data('palette_id');
  paletteModification.setNewState(palette_id);
  ThemeBuilder.preview(this.modification);
};

/**
 * On paletteChange, update the colors in the dialog box.
 */
ThemeBuilder.styles.PalettePicker.prototype.onPaletteChange = function (e) {
  var paletteId = e.paletteId;
  var newPalette = new ThemeBuilder.styles.Palette(paletteId);
  var colorManager = ThemeBuilder.getColorManager();

  // Change the color of each palette item (i.e. colored square) in the current
  // palette section of the dialog.
  var i, index, item;
  var indexes = colorManager.getIndexes('palette');
  for (i = 0; i < indexes.length; i++) {
    index = indexes[i];
    item = this.paletteItems[index];
    item.setHex(newPalette.colors[index].hex);
  }
  var currentColor = newPalette[this.paletteIndex];
  if (currentColor) {
    // Change the themebuilder color swatch for the selected item.
    this.setSwatchColor('#' + currentColor);
    // Select the new color in the colorpicker color wheel.
    jQuery('#picker-' + this.id, this.dialog).ColorPickerSetColor('#' + currentColor);
  }
};

/**
 * Handle the OK button.
 */
ThemeBuilder.styles.PalettePicker.prototype.onOk = function (event) {
  if (event) {
    ThemeBuilder.util.stopEvent(event);
  }
  // Special handling for the elementColor modification: Make sure it comes
  // after all the SwatchModifications, so the new custom color will actually
  // exist before we try applying it to an element.
  this.modification.bumpChild('elementColor');
  ThemeBuilder.applyModification(this.modification);
  this.hide();
};

/**
 * Handle the Cancel button.
 */
ThemeBuilder.styles.PalettePicker.prototype.onCancel = function (event) {
  if (event) {
    ThemeBuilder.util.stopEvent(event);
  }
  // Revert the preview of changes.
  ThemeBuilder.preview(this.modification, false);

  // If the user selected a color, be sure to reset the color rectangle accordingly.
  var selectionModification = this.modification.getChild('elementColor');
  if (selectionModification) {
    var priorState = selectionModification.getPriorState();
    this.setIndex(priorState.value);
  }
  this.hide();
};

/**
 * Change the color of the selected element.
 */
ThemeBuilder.styles.PalettePicker.prototype.modifySelectedElement = function (paletteIndex) {
  var cssModification = this.modification.getChild('elementColor');
  if (!cssModification) {
    // Initialize a css modification instance for the element color change.
    cssModification = new ThemeBuilder.CssModification(this.selector);
    if (this.paletteIndex) {
      cssModification.setPriorState(this.property, '{' + this.paletteIndex + '}');
    } else {
      cssModification.setPriorState(this.property, '');
    }
    this.modification.addChild('elementColor', cssModification);
  }

  cssModification.setNewState(this.property, '{' + paletteIndex + '}');
  ThemeBuilder.preview(cssModification);
};

/**
 * Set the physical appearance of the dialog box to a new palette index.
 *
 * @param <string> new_color
 *   Can be either a palette index, a custom color index, or a hex color. If a
 *   hex color is passed, will convert to a palette or custom index and use
 *   that instead.
 */
ThemeBuilder.styles.PalettePicker.prototype.setIndex = function (new_color) {
  var $ = jQuery;
  // Make sure the color we're moving to is valid.
  var colorManager = ThemeBuilder.getColorManager();
  new_color = ThemeBuilder.styleEditor.unrgb(new_color);
  var index = colorManager.cleanIndex(new_color);
  var is_hex = colorManager.isHex(index);
  var is_valid_index = colorManager.isValidIndex(index);
  if (!is_hex && !is_valid_index) {
    return;
  }
  // TODO: KS: This is exceedingly lame. The point is to translate a passed-in
  // hex to an index, if we can.
  if (is_hex) {
    var hex = index;
    index = colorManager.hexToPaletteIndex(index);
    if (!index) {
      // TODO: Actually add the passed-in hex to the custom colors tray, and
      // use the index of the new custom color here.
      index = hex;
    }
  }

  this.paletteIndex = index;
  var index_class = ThemeBuilder.util.getSafeClassName(index);

  // Move the red outline from the old swatch to the new swatch.
  if (!$('.palette .palette-item.item-' + index_class, this.dialog).hasClass('selected')) {
    $('.palette .palette-item.selected', this.dialog).removeClass('selected');
    $('.palette .palette-item.item-' + index_class, this.dialog).addClass('selected');
  }
  // TODO: Get the new color from someplace more sensible?
  var color = $('.palette .palette-item.item-' + index_class, this.dialog).data('color');
  if (!color) {
    if (is_hex) {
      color = hex;
    }
    else {
      return;
    }
  }
  // Change the themebuilder color swatch for the selected item.
  this.setSwatchColor(color);
  // Select the new color in the colorpicker color wheel.
  $('#picker-' + this.id, this.dialog).ColorPickerSetColor(color);
};

/**
 * Sets the color of the swatch associated with this PalettePicker instance.  It
 * is important to use this method rather than setting the color inline because
 * this method correctly handles transparency.
 *
 * @param {string} color
 *   The color to apply to the swatch.
 */
ThemeBuilder.styles.PalettePicker.prototype.setSwatchColor = function (color) {
  if ('#transparent' === color || 'transparent' === color) {
    this.swatchDiv.addClass('transparent');
  }
  else {
    this.swatchDiv.removeClass('transparent')
      .css('background-color', color);
  }
};

ThemeBuilder.styles.PalettePicker.prototype.getIndex = function () {
  return this.paletteIndex;
};

ThemeBuilder.styles.PalettePicker.prototype.setSelector = function (selector) {
  this.selector = selector;

};

/**
 * Show the palette dialog box.
 */
ThemeBuilder.styles.PalettePicker.prototype.show = function () {
  if (!this.enabled) {
    return;
  }
  jQuery('<div class="modal"></div>').appendTo('body');
  jQuery('<div class="modal"></div>').appendTo('#themebuilder-wrapper');
  //Set up a CSS modification object for changing an element to another color.
  this.modification = new ThemeBuilder.GroupedModification();

  // Do not allow the user to undo or redo while the dialog is being used.
  this.statusKey = ThemeBuilder.undoButtons.disable();

  // If show somehow got called when we're already showing, hide instead.
  if (this.dialog.css('display') === 'block') {
    this.dialog.fadeOut();
  }
  else {
    this.dialog.fadeIn('normal');
    // Move the dialog just right of its swatch.
    this.dialog.css('left', parseInt(this.swatchDiv.offset().left + 30, 10) + 'px');
    /*  None of this is necessary, the dialog box is always going to be hitting the bottom border, setting bottom: 0; in the css is better
    this.dialog.css('top', parseInt(this.swatchDiv.offset().top, 10) + 'px');
    // Make sure the entire dialog shows on the screen.
    //debugger;
    var themebuilderHeight = jQuery('#themebuilder-wrapper', parent.document).outerHeight();
    var dialogTop = parseInt(this.dialog.css('top'), 10);
    var dialogHeight = this.dialog.outerHeight();
    if (dialogTop + dialogHeight > themebuilderHeight) {
      // The dialog is too far down. Move it up.
      this.dialog.css('top', (themebuilderHeight - dialogHeight) + 'px');
    }
    */
    //$(document).bind('mousedown',hide);
    jQuery('.modal').click(ThemeBuilder.bind(this, this.onCancel));
  }
};

/**
 * Hide the palette dialog box. Should be called on OK and Cancel.
 */
ThemeBuilder.styles.PalettePicker.prototype.hide = function () {
  this.dialog.css('opacity', 1).fadeOut('medium').removeClass('expanded');
  jQuery('.modal').remove();

  // With the dialog dismissed, indicate that it is ok to show the undo and
  // redo buttons again.
  ThemeBuilder.undoButtons.clear(this.statusKey);
};

/**
 * Keep the dialog box from showing, even when the show() method is called.
 */
ThemeBuilder.styles.PalettePicker.prototype.disable = function () {
  this.enabled = false;
};

/**
 * Allow the dialog box to be shown.
 */
ThemeBuilder.styles.PalettePicker.prototype.enable = function () {
  this.enabled = true;
};






/**
 * A PaletteItem is a little colored square appearing within a PalettePicker.
 * @class
 */
ThemeBuilder.styles.PaletteItem = ThemeBuilder.initClass();

ThemeBuilder.styles.PaletteItem.prototype.initialize = function (palettePicker, hex, index, container) {
  this.palettePicker = palettePicker;
  this.index = index;
  this.container = container;
  this.div = jQuery('<div class="palette-item"></div>');
  this.div.appendTo(this.container);
  this.div.click(ThemeBuilder.bind(this, this.click));
  jQuery(this.div).data('index', this.index);
  this.div.addClass('item-' + ThemeBuilder.util.getSafeClassName(this.index));
  this.setHex(hex);
};

ThemeBuilder.styles.PaletteItem.prototype.click = function () {
  // TODO: Replace with an event listener.
  this.palettePicker.modifySelectedElement(this.index);
  this.palettePicker.setIndex(this.index);
};

/**
 * Set the hex color associated with this item and refresh its display.
 */
ThemeBuilder.styles.PaletteItem.prototype.setHex = function (hex) {
  this.hex = hex;
  var color = hex;
  if (hex !== 'transparent') {
    color = '#' + color;
  }
  this.div.css('background-color', color);
  jQuery(this.div).data('color', color);
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

var ThemeBuilder = ThemeBuilder || {};

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The ColorManager object is a single interface for dealing with colors.
 * Normally you wouldn't need to instantiate this class; rather, you would
 * interact with the ThemeBuilder.colorManager instance.
 * @class
 */
ThemeBuilder.styles.ColorManager = ThemeBuilder.initClass();

/**
 * The constructor for the ColorManager class.
 */
ThemeBuilder.styles.ColorManager.prototype.initialize = function () {
  ThemeBuilder.getApplicationInstance().addApplicationInitializer(ThemeBuilder.bind(this, this.setPaletteInfo));
  this.initialized = false;
  ThemeBuilder.addModificationHandler(ThemeBuilder.PaletteModification.TYPE, this);
  ThemeBuilder.addModificationHandler(ThemeBuilder.SwatchModification.TYPE, this);
};

ThemeBuilder.styles.ColorManager.prototype.setPaletteInfo = function (appData) {
  var info = appData.palette_info;
  var paletteId = info.current_palette;
  this.palette = new ThemeBuilder.styles.Palette(paletteId);
  this.custom = new ThemeBuilder.styles.CustomColorset(info.customColors);
  this.paletteIndexes = info.indexes;
  this.mainPaletteIndexes = info.mainIndexes;
  this._createPalettes(info.palettes);
  this.initialized = true;
};

ThemeBuilder.styles.ColorManager.prototype.isInitialized = function () {
  return this.initialized;
};

ThemeBuilder.styles.ColorManager.prototype._createPalettes = function (paletteInfo) {
  var palettes = [];
  var i, info;
  for (i in paletteInfo) {
    if (i) {
      info = paletteInfo[i];
      palettes[i] = new ThemeBuilder.styles.Palette(info.id);
    }
  }
  this.palettes = palettes;
};

/**
 * Looks up a palette or custom index and returns a hex code.
 */
ThemeBuilder.styles.ColorManager.prototype.hexToPaletteIndex = function (hex) {
  var index;
  hex = hex.replace(/^#/g, '');
  // Check the palette.
  index = this.palette.hexToPaletteIndex(hex);
  if (index === false) {
    index = this.custom.hexToPaletteIndex(hex);
  }
  return index;
};

ThemeBuilder.styles.ColorManager.prototype.paletteIndexToHex = function (paletteIndex) {
  var cleanIndex = paletteIndex.toString().replace(/\{|\}/g, "");
  var index = this.palette.paletteIndexToHex(cleanIndex);
  if (index) {
    return index;
  }
  else {
    index = this.custom.paletteIndexToHex(cleanIndex);
    if (index) {
      return index;
    }
  }
  // No matches. We have bogus input.
  return false;
};

/**
 * Applies the specified modification description to the client side only.
 * This allows the user to preview the modification without committing it
 * to the theme.
 *
 * @param {Object} state
 *   The modification description.  To get this value, you should pass in
 *   the result of Modification.getNewState() or Modification.getPriorState().
 * @param {Modification} modification
 *   The modification that represents the change in the current state that
 *   should be previewed.
 */
ThemeBuilder.styles.ColorManager.prototype.preview = function (state, modification) {
  switch (state.type) {
  case ThemeBuilder.PaletteModification.TYPE:
    this.palettePreview(state);
    break;
  case ThemeBuilder.SwatchModification.TYPE:
    this.swatchPreview(state);
    break;
  default:
    throw "Unexepected modification type: " + state.type;
  }
};

/**
 * Preview method for the PaletteModification class.
 */
ThemeBuilder.styles.ColorManager.prototype.palettePreview = function (state) {
  var newPalette = new ThemeBuilder.styles.Palette(state.paletteId);
  ThemeBuilder.styles.Stylesheet.getInstance('palette.css').replacePalette(this.palette, newPalette);
  // There may be copies of color-related properties in border.css as well. See
  // AN-12796.
  ThemeBuilder.styles.Stylesheet.getInstance('border.css').replacePalette(this.palette, newPalette);
  this.palette = new ThemeBuilder.styles.Palette(state.paletteId);
  jQuery('#themebuilder-style').trigger({type: 'paletteChange', paletteId: state.paletteId});
};

/**
 * Preview method for the SwatchModification class.
 */
ThemeBuilder.styles.ColorManager.prototype.swatchPreview = function (state) {
  // Determine whether the swatch is palette or custom.
  var palette = this[state.selector];
  if (palette) {
    var existingHex = this.paletteIndexToHex(state.index);
    if (!existingHex) {
      if (state.hex) {
        // Add a new color to the palette.
        palette.addColor(state.index, state.hex);
      } else {
        // Remove a color from the palette.
        palette.removeColor(state.index);
      }
    } else {
      // This color already exists in the palette. Not sure what the desired
      // behavior is.
    }
    // Let everyone know there's been a swatch change.
    jQuery('#themebuilder-style').trigger({type: 'swatchPreview', 'index': state.index});
  }
};

/**
 * Remove {} from a palette index.
 */
ThemeBuilder.styles.ColorManager.prototype.cleanIndex = function (paletteIndex) {
  return paletteIndex.toString().replace(new RegExp('^{'), '').replace(new RegExp('}$'), '');
};

/**
 * Remove # from a hex code.
 */
ThemeBuilder.styles.ColorManager.prototype.cleanHex = function (hex) {
  return ThemeBuilder.styles.PaletteColor.cleanHex(hex);
};

/**
 * Check a hex code for validity.
 */
ThemeBuilder.styles.ColorManager.prototype.isHex = function (hex) {
  return ThemeBuilder.styles.PaletteColor.isHex(hex);
};

/**
 * Determine if a given index represents a palette or custom color.
 */
ThemeBuilder.styles.ColorManager.prototype.isValidIndex = function (palette_index) {
  var indexes = this.getIndexes('palette');
  var i;
  for (i in indexes) {
    if (indexes[i] === palette_index) {
      return 'palette';
    }
  }
  var custom = this.getIndexes('custom');
  for (i in custom) {
    if (parseInt(custom[i], 10) === parseInt(palette_index, 10)) {
      return 'custom';
    }
  }
  return false;
};

ThemeBuilder.styles.ColorManager.prototype.getPalette = function () {
  return this.palette;
};

ThemeBuilder.styles.ColorManager.prototype.getPalettes = function () {
  return this.palettes;
};

ThemeBuilder.styles.ColorManager.prototype.getIndexes = function (indexType) {
  if (!this.palette) {
    var data = ThemeBuilder.getApplicationInstance().getData();
    this.setPaletteInfo(data);
  }
  if (indexType === 'palette') {
    return this.palette.getIndexes();
  }
  else if (indexType === 'palette main') {
    return this.palette.getMainIndexes();
  }
  else if (indexType === 'custom') {
    return this.custom.getIndexes();
  }
  else {
    var paletteIndexes = this.palette.getIndexes();
    var customIndexes = this.custom.getIndexes();
    return paletteIndexes.concat(customIndexes);
  }
};

ThemeBuilder.styles.ColorManager.prototype.getCustom = function () {
  return this.custom;
};

ThemeBuilder.styles.ColorManager.prototype.getNextCustomIndex = function () {
  var indexes = this.getIndexes('custom');
  var highestIndex = indexes.last() || 0;
  return parseInt(highestIndex, 10) + 1;
};

/**
 * Safely add a hash to a hex code for output in CSS.
 *
 * @param {string} hex
 *   A hex code, or 'transparent', with or without a #.
 * @return {string}
 *   A color suitable for inclusion in a CSS rule.
 */
ThemeBuilder.styles.ColorManager.prototype.addHash = function (hex) {
  if (hex === 'transparent') {
    return hex;
  }
  else if (hex.indexOf('#') === 0) {
    return hex;
  }
  else {
    return '#' + hex;
  }
};





/**
 * A single instance of ThemeBuilder.styles.ColorManager.
 */
ThemeBuilder.getColorManager = function () {
  ThemeBuilder._colorManager = ThemeBuilder._colorManager || new ThemeBuilder.styles.ColorManager();
  return ThemeBuilder._colorManager;
};
;
/**
 * Ajax upload
 * Project page - http://valums.com/ajax-upload/
 * Copyright (c) 2008 Andris Valums, http://valums.com
 * Licensed under the MIT license (http://valums.com/mit-license/)
 * Version 3.2 (19.05.2009)
 */

/**
 * Changes from the previous version:
 * 1. Input is cleared after submit is canceled to allow user to select same file
 * 2. Fixed problem with FF3 when used on page with smaller font size
 * 
 * For the full changelog please visit: 
 * http://valums.com/ajax-upload-changelog/
 */

(function(){
	
var d = document, w = window;

/**
 * Get element by id
 */	
function get(element){
	if (typeof element == "string")
		element = d.getElementById(element);
	return element;
}

/**
 * Attaches event to a dom element
 */
function addEvent(el, type, fn){
	if (w.addEventListener){
		el.addEventListener(type, fn, false);
	} else if (w.attachEvent){
		var f = function(){
		  fn.call(el, w.event);
		};			
		el.attachEvent('on' + type, f)
	}
}


/**
 * Creates and returns element from html chunk
 */
var toElement = function(){
	var div = d.createElement('div');
	return function(html){
		div.innerHTML = html;
		var el = div.childNodes[0];
		div.removeChild(el);
		return el;
	}
}();

function hasClass(ele,cls){
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
function addClass(ele,cls) {
	if (!hasClass(ele,cls)) ele.className += " "+cls;
}
function removeClass(ele,cls) {
	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
	ele.className=ele.className.replace(reg,' ');
}

// getOffset function copied from jQuery lib (http://jquery.com/)
if (document.documentElement["getBoundingClientRect"]){
	// Get Offset using getBoundingClientRect
	// http://ejohn.org/blog/getboundingclientrect-is-awesome/
	var getOffset = function(el){
		var box = el.getBoundingClientRect(),
		doc = el.ownerDocument,
		body = doc.body,
		docElem = doc.documentElement,
		
		// for ie 
		clientTop = docElem.clientTop || body.clientTop || 0,
		clientLeft = docElem.clientLeft || body.clientLeft || 0,
		
		// In Internet Explorer 7 getBoundingClientRect property is treated as physical,
		// while others are logical. Make all logical, like in IE8.
		
		
		zoom = 1;
		if (body.getBoundingClientRect) {
			var bound = body.getBoundingClientRect();
			zoom = (bound.right - bound.left)/body.clientWidth;
		}
		if (zoom > 1){
			clientTop = 0;
			clientLeft = 0;
		}
		var top = box.top/zoom + (window.pageYOffset || docElem && docElem.scrollTop/zoom || body.scrollTop/zoom) - clientTop,
		left = box.left/zoom + (window.pageXOffset|| docElem && docElem.scrollLeft/zoom || body.scrollLeft/zoom) - clientLeft;
				
		return {
			top: top,
			left: left
		};
	}
	
} else {
	// Get offset adding all offsets 
	var getOffset = function(el){
		if (w.jQuery){
			return jQuery(el).offset();
		}		
			
		var top = 0, left = 0;
		do {
			top += el.offsetTop || 0;
			left += el.offsetLeft || 0;
		}
		while (el = el.offsetParent);
		
		return {
			left: left,
			top: top
		};
	}
}

function getBox(el){
	var left, right, top, bottom;	
	var offset = getOffset(el);
	left = offset.left;
	top = offset.top;
						
	right = left + el.offsetWidth;
	bottom = top + el.offsetHeight;		
		
	return {
		left: left,
		right: right,
		top: top,
		bottom: bottom
	};
}

/**
 * Crossbrowser mouse coordinates
 */
function getMouseCoords(e){		
	// pageX/Y is not supported in IE
	// http://www.quirksmode.org/dom/w3c_cssom.html			
	if (!e.pageX && e.clientX){
		// In Internet Explorer 7 some properties (mouse coordinates) are treated as physical,
		// while others are logical (offset).
		var zoom = 1;	
		var body = document.body;
		
		if (body.getBoundingClientRect) {
			var bound = body.getBoundingClientRect();
			zoom = (bound.right - bound.left)/body.clientWidth;
		}

		return {
			x: e.clientX / zoom + d.body.scrollLeft + d.documentElement.scrollLeft,
			y: e.clientY / zoom + d.body.scrollTop + d.documentElement.scrollTop
		};
	}
	
	return {
		x: e.pageX,
		y: e.pageY
	};		

}
/**
 * Function generates unique id
 */		
var getUID = function(){
	var id = 0;
	return function(){
		return 'ValumsAjaxUpload' + id++;
	}
}();

function fileFromPath(file){
	return file.replace(/.*(\/|\\)/, "");			
}

function getExt(file){
	return (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
}			

// Please use AjaxUpload , Ajax_upload will be removed in the next version
Ajax_upload = AjaxUpload = function(button, options){
	if (button.jquery){
		// jquery object was passed
		button = button[0];
	} else if (typeof button == "string" && /^#.*/.test(button)){					
		button = button.slice(1);				
	}
	button = get(button);	
	
	this._input = null;
	this._button = button;
	this._disabled = false;
	this._submitting = false;
	// Variable changes to true if the button was clicked
	// 3 seconds ago (requred to fix Safari on Mac error)
	this._justClicked = false;
	this._parentDialog = d.body;
			
	if (window.jQuery && jQuery.ui && jQuery.ui.dialog){
		var parentDialog = jQuery(self._button).parents('.ui-dialog-content');
		if (parentDialog.length){
			this._parentDialog = parentDialog[0];
		}
	}
					
	this._settings = {
		// Location of the server-side upload script
		action: 'upload.php',			
		// File upload name
		name: 'userfile',
		// Additional data to send
		data: {},
		// Submit file as soon as it's selected
		autoSubmit: true,
		// The type of data that you're expecting back from the server.
		// Html and xml are detected automatically.
		// Only useful when you are using json data as a response.
		// Set to "json" in that case. 
		responseType: false,
		// When user selects a file, useful with autoSubmit disabled			
		onChange: function(file, extension){},					
		// Callback to fire before file is uploaded
		// You can return false to cancel upload
		onSubmit: function(file, extension){},
		// Fired when file upload is completed
		// WARNING! DO NOT USE "FALSE" STRING AS A RESPONSE!
		onComplete: function(file, response) {}
	};

	// Merge the users options with our defaults
	for (var i in options) {
		this._settings[i] = options[i];
	}
	
	this._createInput();
	this._rerouteClicks();
}
			
// assigning methods to our class
AjaxUpload.prototype = {
	setData : function(data){
		this._settings.data = data;
	},
	disable : function(){
		this._disabled = true;
	},
	enable : function(){
		this._disabled = false;
	},
	// removes ajaxupload
	destroy : function(){
		if(this._input){
			if(this._input.parentNode){
				this._input.parentNode.removeChild(this._input);
			}
			this._input = null;
		}
	},				
	/**
	 * Creates invisible file input above the button 
	 */
	_createInput : function(){
		var self = this;
		var input = d.createElement("input");
		input.setAttribute('type', 'file');
		input.setAttribute('name', this._settings.name);
		input.setAttribute('class', 'tb-no-select');
		var styles = {
			'position' : 'absolute'
			,'padding': 0
			,'fontSize': '14px'
                        ,'opacity': 0
			,'cursor': 'pointer'
			//                        ,'display' : 'none'
			,'visible': 'hidden'
			,'zIndex' :  2147483583 //Max zIndex supported by Opera 9.0-9.2x 
			// Strange, I expected 2147483647
		};
		for (var i in styles){
			input.style[i] = styles[i];
		}
		
		// Make sure that element opacity exists
		// (IE uses filter instead)
		if ( ! (input.style.opacity === "0")){
			input.style.filter = "alpha(opacity=0)";
		}
							
		this._parentDialog.appendChild(input);
		this._setMargin(input);
		addEvent(input, 'change', function(){
			// get filename from input
			var file = fileFromPath(this.value);	
			if(self._settings.onChange.call(self, file, getExt(file)) == false ){
				return;				
			}														
			// Submit form when value is changed
			if (self._settings.autoSubmit){
				self.submit();						
			}						
		});
		
		// Fixing problem with Safari
		// The problem is that if you leave input before the file select dialog opens
		// it does not upload the file.
		// As dialog opens slowly (it is a sheet dialog which takes some time to open)
		// there is some time while you can leave the button.
		// So we should not change display to none immediately
		addEvent(input, 'click', function(){
			self.justClicked = true;
			setTimeout(function(){
				// we will wait 3 seconds for dialog to open
				self.justClicked = false;
			}, 3000);			
		});		
		
		this._input = input;
	},
	_rerouteClicks : function (){
		var self = this;
	
		// IE displays 'access denied' error when using this method
		// other browsers just ignore click()
		// addEvent(this._button, 'click', function(e){
		//   self._input.click();
		// });
				
		var box, dialogOffset = {top:0, left:0}, over = false;							
		addEvent(self._button, 'mouseover', function(e){
			if (!self._input || over) return;
			over = true;
			box = getBox(self._button);
					
			if (self._parentDialog != d.body){
				dialogOffset = getOffset(self._parentDialog);
			}	
		});
		
	
		// we can't use mouseout on the button,
		// because invisible input is over it
		addEvent(document, 'mousemove', function(e){
			var input = self._input;			
			if (!input || !over) return;
			
			if (self._disabled){
				removeClass(self._button, 'uploadhover');
				input.style.display = 'none';
				return;
			}	
										
			var c = getMouseCoords(e);

			if ((c.x >= box.left) && (c.x <= box.right) && 
			(c.y >= box.top) && (c.y <= box.bottom)){			
				input.style.top = c.y - dialogOffset.top + 'px';
				input.style.left = c.x - dialogOffset.left + 'px';
				input.style.display = 'block';
				addClass(self._button, 'uploadhover');				
			} else {		
				// mouse left the button
				over = false;
				if (!self.justClicked){
					input.style.display = 'none';
				}
				removeClass(self._button, 'uploadhover');
			}			
		});			
			
	},
	/**
	 * Creates iframe with unique name
	 */
	_createIframe : function(){
		// unique name
		// We cannot use getTime, because it sometimes return
		// same value in safari :(
		var id = getUID();
		
		// Remove ie6 "This page contains both secure and nonsecure items" prompt 
		// http://tinyurl.com/77w9wh
		var iframe = toElement('<iframe src="javascript:false;" name="' + id + '" />');
		iframe.id = id;
		iframe.style.display = 'none';
		d.body.appendChild(iframe);			
		return iframe;						
	},
	/**
	 * Upload file without refreshing the page
	 */
	submit : function(){
		var self = this, settings = this._settings;	
					
		if (this._input.value === ''){
			// there is no file
			return;
		}
										
		// get filename from input
		var file = fileFromPath(this._input.value);			

		// execute user event
		if (! (settings.onSubmit.call(this, file, getExt(file)) == false)) {
			// Create new iframe for this submission
			var iframe = this._createIframe();
			
			// Do not submit if user function returns false										
			var form = this._createForm(iframe);
			form.appendChild(this._input);
			
			form.submit();
			
			d.body.removeChild(form);				
			form = null;
			this._input = null;
			
			// create new input
			this._createInput();
			
			var toDeleteFlag = false;
			
			addEvent(iframe, 'load', function(e){
				if (iframe.src == "about:blank"){						
					// First time around, do not delete.
					if( toDeleteFlag ){
						// Fix busy state in FF3
						setTimeout( function() {
							d.body.removeChild(iframe);
						}, 0);
					}
					return;
				}				
				
				var doc = iframe.contentDocument ? iframe.contentDocument : frames[iframe.id].document;

				// fixing Opera 9.26
				if (doc.readyState && doc.readyState != 'complete'){
					// Opera fires load event multiple times
					// Even when the DOM is not ready yet
					// this fix should not affect other browsers
					return;
				}
				
				// fixing Opera 9.64
				if (doc.body && doc.body.innerHTML == "false"){
					// In Opera 9.64 event was fired second time
					// when body.innerHTML changed from false 
					// to server response approx. after 1 sec
					return;				
				}
				
				var response;
									
				if (doc.XMLDocument){
					// response is a xml document IE property
					response = doc.XMLDocument;
				} else if (doc.body){
					// response is html document or plain text
					response = doc.body.innerHTML;
					if (settings.responseType == 'json'){
						response = window["eval"]("(" + response + ")");
					}
				} else {
					// response is a xml document
					var response = doc;
				}
																			
				settings.onComplete.call(self, file, response);
						
				// Reload blank page, so that reloading main page
				// does not re-submit the post. Also, remember to
				// delete the frame
				toDeleteFlag = true;				
				iframe.src = "about:blank"; //load event fired				 								
			});
	
		} else {
			// clear input to allow user to select same file
			// Doesn't work in IE6
			// this._input.value = '';
			d.body.removeChild(this._input);				
			this._input = null;
			
			// create new input
			this._createInput();						
		}
	},		
	/**
	 * Creates form, that will be submitted to iframe
	 */
	_createForm : function(iframe){
		var settings = this._settings;
		
		// method, enctype must be specified here
		// because changing this attr on the fly is not allowed in IE 6/7		
		var form = toElement('<form method="post" enctype="multipart/form-data"></form>');
		form.style.display = 'none';
		form.action = settings.action;
		form.target = iframe.name;
		d.body.appendChild(form);
		
		// Create hidden input element for each data key
		for (var prop in settings.data){
			var el = d.createElement("input");
			el.type = 'hidden';
			el.name = prop;
			el.value = settings.data[prop];
			form.appendChild(el);
		}			
		return form;
        },

        /**
         * Set the margin for the input field.  This is more than just
         * making the field look good - in fact it is not about that
         * at all because the field is not ever visible.  This is
         * about styling the field such that it is positioned under
         * the cursor when the user mouses over the browse button.
         * Done improperly, the field will not be in the right
         * position, and when the user clicks the button, nothing will
         * happen.
         *
         * Set the margin such that the button is always under the
         * cursor, no matter how large the field ends up being.
         * Understand that the final width of the field is subject to
         * platform-specific things such as rendered font size.
         *
         * Note: Testing this can be rather fussy.  The easiest way is
         * to disable the "'display': 'none'" and "'opacity': 0" properties
         * above and then watch as the user mouses over the button to
         * ensure that it is positioned properly.
         *
         * @param {DomElement} input
         *   The input field for which the margin should be applied.
         */
        _setMargin : function (input) {
          var width = input.offsetWidth;
          var height = input.offsetHeight;

          input.style.marginTop = -(height / 2) + 'px';
          // Use half of a viable width for the browse button to calculate
          // the left margin such that the button will be positioned under
          // the mouse.
          input.style.marginLeft = (15 - width) + 'px' ;
        }
};
})();
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true ThemeBuilder: true*/

function jQueryPlugin(name, defaults, helpers, init, allforone) {
  var $ = jQuery;
  $.fn[name] = function (options) {
    if (typeof(options) === 'string') {
      if (typeof(helpers[options]) !== 'undefined') {
        var args = arguments;
        if (allforone) {
          return helpers[options].apply($.data(this[0], name), Array.prototype.slice.call(args, 1));
        }
        else {
          return this.each(function () {
            return helpers[options].apply($.data(this, name), Array.prototype.slice.call(args, 1));
          });
        }
      }
    }
    if (allforone) {
      var widget = {};
      widget.settings = $.extend({}, defaults, options);
      widget.node = $(this); // the individual node
      $.data(widget.node[0], name, widget);
      init.apply(widget, [widget.settings]);
      return this;
    }
    else {
      return this.each(function () {
        var widget = {};
        widget.settings = $.extend({}, defaults, options);
        widget.node = $(this); // the individual node
        $.data(this, name, widget);

        init.apply(widget, [widget.settings]);
        return this;
      });
    }
  };
}

  // actually make the plugin
jQueryPlugin('inputslider',
  {
    onShow: function (islider, target) {},
    onStart: function (islider, event, value, target) {},
    onSlide: function (islider, event, value, target) {},
    onStop: function (islider, event, value, target) {},
    modify: function (x) {
      return x; 
    },
    min: 0,
    max: 10,
    step: 1,
    value: 0,
    autofocus: true
  },
  { // helpers
    set: function (attr, value) {
      return this.set(attr, value);
    },
    get: function (attr) {
      return this.get(attr);
    }
  },
  function (settings) { // init
    var $ = jQuery;
    var current = null;
    var down = false;
    var that = this;
    // TODO: this won't scroll...it probably should -- look into how pallettepicker does it
    this.slider = $('<div class="slider-container"><div class="slider"></div></div>')
      .appendTo('#themebuilder-wrapper').children().eq(0);
    this.slider.slider({
      min: settings.min,
      max: settings.max,
      step: settings.step,
      slide: function (event, ui) {
        if (false === settings.onSlide.call(that, that, event, ui.value, current)) {
          return false;
        }
        if (settings.autofocus !== false) {
          current.focus();
        }
      },
      init: function (event, slider) {
        that._slider = slider;
      },
      stop: function (event, ui) {
        if (down) {
          return;
        }
        settings.onStop.call(that, that, event, ui.value, current);
        if (settings.autofocus !== false) {
          current.focus();
        }
      }
    });
      
    this.set = function (attr, value) {
      switch (attr) {
      case 'min':
      case 'max':
      case 'step':
        that.slider.slider('option', attr, value);
        break;

      case 'value':
        value = parseInt(value, 10);
        value = isNaN(value) ? 0 : value;
        var max = that.get('max');
        var min = that.get('min');
        if (value > max) {
          value = max;
        }
        else if (value < min) {
          value = min;
        }
        that.slider.slider('value', value);
        break;
  
      case 'autofocus':
        this.settings.autofocus = value;
        break;
      }
    };
      
    this.get = function (attr, value) {
      switch (attr) {
      case 'min':
      case 'max':
      case 'step':
        return that.slider.slider('option', attr);

      case 'value':
        return that.slider.slider('value');

      case 'autofocus':
        return this.settings.autofocus;
      }
    };
      
    $(that.node).mousedown(function (e) { // this == current
      if (false === settings.onShow.call(that, that, this)) {
        return;
      }
      current = this;
      down = true;
      var max = that.get('max');
      var min = that.get('min');

      /* Is this needed? --prefill slider w/ value -- probably handled in onShow
       that.set('value', $(this).val());
      */
        
      // position the slider
      var left = e.pageX - 20 - 209 * ((that.slider.slider('value') - min) / (max - min));
      var top = $(this).offset().top + this.offsetHeight - $('#themebuilder-wrapper').offset().top;

      // Make sure the slider doesn't slide off of the bottom of the page.
      var sliderHeight = 50;
      top = Math.min(top, $('#themebuilder-wrapper').height() - sliderHeight);

      that.slider.parent().css('left', left).css('top', top).show();
        
      settings.onStart.apply(that, [that, e, that.get('value'), current]);
        
      that._slider._mouseCapture(e);
      var mm;
      var mu = function (e) {
        down = false;
        $('body').unbind('mousemove', mm).unbind('mouseup', mu);
        settings.onStop.apply(that, [that, e, that.get('value'), current]);
        that.slider.parent().hide();
      };
      mm = function (e) {
        e.stopPropagation();
        e.preventDefault();
        that._slider._mouseDrag(e);
      };
      $('body').mousemove(mm).mouseup(mu);
    });
  },
  true // allforone
);

/**
 * small jQuery hack to enable the customized ui slider
 */
(function () {
  var oinit = jQuery.ui.slider.prototype._init;
  jQuery.ui.slider.prototype = jQuery.extend(jQuery.ui.slider.prototype, {
    _init: function () {
      this.__init = oinit;
      this.__init();
      this._trigger('init', {}, this);
    }
  });
}());
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * A filter implementation used in the ThemeBuilder.  This filter is
 * responsible for implementing all of our policies about what should be
 * selected by default, and which elements should be included in the
 * selector.
 * @class
 */
ThemeBuilder.styles.ThemeMarkup1Filter = ThemeBuilder.initClass();

/**
 * The constructor of the ThemeMarkup1Filter class.
 *
 * @param {Array} selectorMap
 *   The current theme's selector map, which maps the default selector for a
 *   given element onto the selector preferred by the theme author.  On
 *   initial element selection, the theme author's choice will override this
 *   filter's default selection.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.initialize = function (selectorMap) {
  this._themeSelectorMap = selectorMap || {};
  this.idBlackList = ['page-wrapper', 'gardens_ie', 'gardens_ie7', 'gardens_ie8'];
  this.classBlackList = ['rb-link', 'rb-textbox', 'clearfix', 'section', 'style-clickable', 'region-banner', 'region', 'html', 'logged-in', 'no-sidebars', 'page-node-', 'moz', 'moz2', 'mac', 'webkit', 'webkit5', 'themebuilder', 'theme-markup-1', 'toolbar', 'tb-auto-adjust-height', 'tb-breadcrumb', 'tb-hidden', 'tb-left', 'tb-preview-shuffle-regions', 'tb-primary', 'tb-right', 'tb-selector', 'tb-selector-preferred', 'tb-sidebar', 'tb-no-select'];
  this.tagBlackList = ['div', 'span'];
};

/**
 * Causes the filter to be executed on the specified path.  The entire
 * path is passed to the filter so the filter can make choices about which
 * elements should be enabled or disabled or even removed entirely.
 *
 * @param {array} path
 *   The array of PathElement instances that together represent the entire
 *   css path to the element that the user selected.
 *
 * @return {array}
 *   A similar array to what was passed in that identifies the new path
 *   that should be used by the Selector instance that called the filter.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.activate = function (orig_path) {
  var path = this.blackListPath(orig_path);
  var newPath = [];
  var index = 0;
  var body = this.getBodyElement(path, index);
  if (body.element) {
    body.element.humanReadable = Drupal.t('Site background');
    newPath.push(body.element);
    index = body.index;
  }
  var region = this.getRegionElement(path);
  if (region.element) {
    newPath.push(region.element);
    index = region.index;
  }

  var block = this.getBlockElement(path);
  if (block.element) {
    newPath.push(block.element);
    index = block.index;
  }

  var pathEnd = [];
  var sufficientSpecificity = false;
  var selectedElementCount = 0;
  var selectedClassCount = 0;
  for (var elementIndex = path.length - 1; elementIndex > index; elementIndex--) {
    var selectedElement = path[elementIndex];
    selectedElement.disableAllButOneClass();
    selectedElement = this.normalizeSelector(selectedElement);
    if (selectedElement) {
      selectedElementCount++;
      var classes = selectedElement.getEnabledClasses() || [];
      if (!sufficientSpecificity || classes.indexOf('menu') !== -1) {
        var id = selectedElement.getId();
        if (id && id.length > 0) {
          sufficientSpecificity = true;
        }
        if (classes.length > 0) {
          selectedClassCount++;
          if (selectedClassCount > 1 || selectedElementCount > 2) {
            sufficientSpecificity = true;
          }
        }
      }
      else {
        selectedElement.setEnabled(false);
      }
      pathEnd.push(selectedElement);
    }
  }
  newPath = newPath.concat(pathEnd.reverse());
  if (newPath.length > 7) {
    // We shouldn't show too much.  Remove from the center (after the block).
    newPath = newPath.slice(0, 2).concat(newPath.slice(newPath.length - 4));
  }
  if (newPath.length === 1) {
    // The body tag was selected.  Make sure it is enabled.
    newPath[0].setEnabled(true);
  }
  newPath = this._substitutePathConfiguration(newPath);
  return newPath;
};

/**
 * Changes the path configuration for the specified path according to the path
 * map supplied by the theme.  The path map must be specified during
 * instantiation of the ThemeMarkup1Filter instance, and contains a mapping of
 * the selector that the ThemeMarkup1Filter would choose by default to a
 * selector that the theme author would prefer.  This makes the use of the
 * Selector much easier because trouble spots can be hand tuned by the theme
 * author.  The goal is to provide a default behavior and supporting selector
 * map that result in minimal need to modify the Selector.
 *
 * @private
 *
 * @param {PathElement array} path
 *   The array of PathElements representing the selected element path,
 *   configured as the default behavior of the ThemeMarkup1Filter would be.
 * @return {PathElement array}
 *   If the currently configured path is not in the theme selector map, the
 *   path is completely unchanged.  Otherwise, the path is reconfigured
 *   according to the theme author's wishes.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype._substitutePathConfiguration = function (path) {
  var selector = this._getSelectorFromPath(path);
  var newSelector = this._themeSelectorMap[selector] || selector;
  var newPath = this._applySelectorToPath(newSelector, path);
  return newPath;
};

/**
 * Returns the selector represented by the specified path.
 *
 * @private
 *
 * @param {PathElement array} path
 *   The array of PathElements representing the currently selected element path.
 * @return {String}
 *   The css selector representing the specified path in its current configuration.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype._getSelectorFromPath = function (path) {
  var selector = [];
  for (var i = 0; i < path.length; i++) {
    var selectorPart = path[i].getEnabledCssSelector();
    if (selectorPart) {
      selector.push(selectorPart);
    }
  }
  var result = selector.join(' ');
  return result;
};

/**
 * Applies the specified selector to the specified path.  This causes the path
 * to be reconfigured to reflect the specified selector.
 *
 * @private
 *
 * @param {String} selector
 *   The css selector representing the desired path configuration.
 * @param {PathElement array} path
 *   The array of PathElements representing the currently selected element path.
 * @return {PathElement array}
 *   The newly-configured element path.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype._applySelectorToPath = function (selector, path) {
  // Work from back to front, applying the selector to each node in the path.
  var parts = selector.split(' ').reverse();
  var partIndex = 0;
  for (var i = path.length - 1; i >= 0; i--) {
    if (partIndex >= parts.length) {
      path[i].setEnabled(false);
      continue;
    }
    // If the path element matches the current part, configure it, otherwise disable it.
    if (this._selectorMatchesPathElement(parts[partIndex], path[i])) {
      path[i].setEnabled(true);
      this._configurePathElement(path[i], parts[partIndex]);
      partIndex++;
    }
    else {
      path[i].setEnabled(false);
    }
  }
  return path;
};

/**
 * Applies the specified selector chunk to the specified path element.  This
 * causes the path element to be reconfigured to reflect the specified
 * selector chunk.
 *
 * @private
 *
 * @param {PathElement} pathElement
 *   The PathElement instance to configure.
 * @param {String} selector
 *   The css selector chunk representing the desired path element configuration.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype._configurePathElement = function (pathElement, selector) {
  switch (selector.charAt(0)) {
  case '#':
    pathElement.setTagEnabled(false);
    pathElement.setIdEnabled(true);
    pathElement.disableAllClasses();
    break;
  case '.':
    pathElement.setTagEnabled(false);
    pathElement.setIdEnabled(false);
    pathElement.disableAllClasses();
    pathElement.setClassEnabled(selector.slice(1), true);
    break;
  default:
    pathElement.setTagEnabled(true);
    pathElement.setIdEnabled(false);
    pathElement.disableAllClasses();
    break;
  }
};

/**
 * Determines whether the specified selector chunk corresponds with the
 * specified path element.
 *
 * @private
 *
 * @param {String} selector
 *   The part of the selector.
 * @param {PathElement} pathElement
 *   The pathElement instance.
 * @return {boolean}
 *   true if the specified selector chunk corresponds with the specified path
 *   element; false otherwise.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype._selectorMatchesPathElement = function (selector, pathElement) {
  var match = false;
  switch (selector.charAt(0)) {
  case '#':
    match = (selector === '#' + pathElement.getId());
    break;
  case '.':
    var classes = pathElement.getClasses();
    if (classes) {
      match = (classes.indexOf(selector.slice(1)) >= 0);
    }
    break;
  default:
    // The selector represents a tag.
    match = (selector === pathElement.getTag());
    break;
  }
  return match;
};

/**
 * Removes all blacklisted classes and tags from the specified path.
 *
 * @param {array} path
 *   The path from the Selector instance that called the filter.  Each
 *   element in the path will be checked and removed if necessary to
 *   honor the blacklist.
 *
 * @return {array}
 *   The new path containing elements that are not blacklisted.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.blackListPath = function (path) {
  var newPath = [];
  for (var i = 0; i < path.length; i++) {
    var element = this.blackListPathElement(path[i]);
    if (element) {
      newPath.push(element);
    }
  }
  return newPath;
};

/**
 * Applies the blacklist to the specified path element.  The blacklist is a
 * set of ids, classes, and tags that should not appear in the specificity
 * options.  In some cases the entire element should be removed to achieve
 * the desired effect.
 *
 * @param {PathElement} pathElement
 *   The PathElement instance to filter with the blacklist.
 *
 * @return {PathElement}
 *   The PathElement instance with the blacklisted attributes removed, or
 *   undefined if the specified path element should be removed entirely.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.blackListPathElement = function (pathElement) {
  if (pathElement.id) {
    if (this.idBlackList.contains(pathElement.id)) {
      pathElement.id = undefined;
    }
  }

  if (pathElement.classes) {
    var classes = [];
    for (var i = 0; i < pathElement.classes.length; i++) {
      if (!this.classBlackList.contains(pathElement.classes[i])) {
        classes.push(pathElement.classes[i]);
      }
    }
    pathElement.classes = classes;
  }

  if (pathElement.tag) {
    if (this.tagBlackList.contains(pathElement.tag)) {
      pathElement.tag = undefined;
      pathElement.setTagEnabled(false);
    }
  }
  return this.normalizeSelector(pathElement);
};

/**
 * Finds the index of an element in the path that has the specified
 * tag.  Only the index of the first element with a matching tag is
 * returned.
 *
 * @param {array} path
 *   An array of PathElement instances that represent the path.
 * @param {string} tag
 *   The tag that identifies the PathElement instance to find.
 *
 * @return
 *   The index within the path array corresponding with the matching
 *   PathElement instance, or -1 if no matches were found.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.findElementIndexByTag = function (path, tag) {
  for (var i = 0; i < path.length; i++) {
    if (path[i].getTag() === tag) {
      return i;
    }
  }
  return -1;
};

/**
 * Finds the index of an element in the path that has the specified
 * class.  Only the index of the first element with a matching class
 * is returned.
 *
 * @param {array} path
 *   An array of PathElement instances that represent the path.
 * @param {string} class
 *   The class that identifies the PathElement instance to find.
 *
 * @return
 *   The index within the path array corresponding with the matching
 *   PathElement instance, or -1 if no matches were found.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.getElementIndexByClass = function (path, classname) {
  for (var i = 0; i < path.length; i++) {
    var classes = path[i].getAllClasses();
    if (classes && classes.contains(classname)) {
      return i;
    }
  }
  return -1;
};

/**
 * Finds all indexes of elements in the specified path that have the specified
 * class.
 *
 * @param {array} path
 *   An array of PathElement instances that represent the path.
 * @param {string} class
 *   The class that identifies the PathElement instances to find.
 *
 * @return
 *   An array containing the indexes within the path array corresponding with
 *   the matching PathElement instances.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.getElementIndexesByClass = function (path, classname) {
  var result = [];
  for (var i = 0; i < path.length; i++) {
    var classes = path[i].getAllClasses();
    if (classes && classes.contains(classname)) {
      result.push(i);
    }
  }
  return result;
};

/**
 * Returns an object that identifies the body element, given the specified
 * path.
 *
 * @param {array} path
 *   An array of PathElement instances that represent the path.
 *
 * @return
 *   An object that identifies the body element.  The has a field
 *   (element) that identifies the PathElement instance associated
 *   with the body element, and a field (index) that identifies the
 *   index within the specified path of the body element.  If no body
 *   element exists in the path, the element field will be undefined,
 *   and the index field will be -1.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.getBodyElement = function (path) {
  var result = undefined;
  var index = this.findElementIndexByTag(path, 'body');
  if (index >= 0) {
    result = ThemeBuilder.clone(path[index]);
    result.disableAllClasses();
    result.classes = undefined;
    result.setIdEnabled(false);
    result.id = undefined;
    result.setEnabled(false);
    result = this.normalizeSelector(result);
  }
  return {'element': result, 'index': index};
};


/**
 * Returns an object that identifies the region element, given the specified
 * path.
 *
 * @param {array} path
 *   An array of PathElement instances that represent the path.
 *
 * @return
 *   An object that identifies the region element.  The has a field
 *   (element) that identifies the PathElement instance associated
 *   with the region element, and a field (index) that identifies the
 *   index within the specified path of the region element.  If no
 *   region element exists in the path, the element field will be
 *   undefined, and the index field will be -1.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.getRegionElement = function (path) {
  var result = undefined;
  var indexes = this.getElementIndexesByClass(path, 'area');
  if (indexes.length > 0) {
    result = ThemeBuilder.clone(path[indexes[0]]);
    result.disableAllClasses();
    result.setElementGroup(Drupal.t('region'), Drupal.t('regions'));
    this.normalizeSelector(result);
  }
  return {'element': result, 'index': indexes[0]};
};

/**
 * Returns an object that identifies the block element, given the
 * specified path.
 *
 * @param {array} path
 *   An array of PathElement instances that represent the path.
 *
 * @return
 *   An object that identifies the block element.  The has a field
 *   (element) that identifies the PathElement instance associated
 *   with the block element, and a field (index) that identifies the
 *   index within the specified path of the block element.  If no
 *   block element exists in the path, the element field will be
 *   undefined, and the index field will be -1.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.getBlockElement = function (path) {
  var result = undefined;
  var indexes = this.getElementIndexesByClass(path, 'block');
  if (indexes.length > 0) {
    result = ThemeBuilder.clone(path[indexes[0]]);
    result.disableAllButOneClass();
    result.setIdEnabled(false);
    result.setElementGroup(Drupal.t('block'), Drupal.t('blocks'));
    result.css_prefix = 'block';
    this.normalizeSelector(result);
  }
  return {'element': result, 'index': indexes[0]};
};

/**
 * Forces the specified PathElement instance into a valid state, or
 * causes the PathElement instance to be removed from the path.  A
 * valid state involves the selector including the element id or a
 * class or the element's tag, but not any combination.
 *
 * @param {PathElement} pathElement
 *   The PathElement instance to put into a valid state.
 *
 * @return {PathElement}
 *   The modified PathElement instance if its state was made valid, or
 *   undefined if the state could not be made valid.
 */
ThemeBuilder.styles.ThemeMarkup1Filter.prototype.normalizeSelector = function (pathElement) {
  if (pathElement.getId() && pathElement.isIdEnabled() === true) {
    // Using an id.  Do not include the tag or classes.
    pathElement.disableAllClasses();
    pathElement.setTagEnabled(false);
  }
  else if (pathElement.getEnabledClasses() !== undefined) {
    // Using a class.  Do not include the tag.
    pathElement.setTagEnabled(false);
  }
  else {
    // Not including a class or id.  Include the tag instead.
    if (pathElement.tag) {
      pathElement.setTagEnabled(true);
    }
    else {
      return undefined;
    }
  }

  // Make sure the path element is still valid.  It must have an id or
  // at least one class or a tag.
  var classes = [].concat(pathElement.classes, pathElement.greyClasses);
  if (pathElement.id || classes.length > 0 || pathElement.tag) {
    return pathElement;
  }
  return undefined;
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * A filter implementation used in the ThemeBuilder.  This filter is
 * responsible for implementing all of our policies about what should be
 * selected by default, and which elements should be included in the
 * selector.
 *
 * This selector is designed to work with themes that contain the
 * 'theme-markup-2' body class.  The ElementPicker instantiates the
 * appropriate filter class when creating a Selector instance.
 * @class
 * @extends ThemeBuilder.styles.ThemeMarkup1Filter
 */
ThemeBuilder.styles.ThemeMarkup2Filter = ThemeBuilder.initClass();
ThemeBuilder.styles.ThemeMarkup2Filter.prototype = new ThemeBuilder.styles.ThemeMarkup1Filter();

/**
 * The constructor of the ThemeMarkup2Filter class.
 *
 * @param {Array} selectorMap
 *   The current theme's selector map, which maps the default selector for a
 *   given element onto the selector preferred by the theme author.  On
 *   initial element selection, the theme author's choice will override this
 *   filter's default selection.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.initialize = function (selectorMap) {
  this._themeSelectorMap = selectorMap || {};
  this.classBlackList = [
    'clearfix',
    'rb-link',
    'rb-textbox',
    'region-banner',
    'region',
    'section',
    'html',
    'logged-in',
    'no-sidebars',
    'page-node-',
    'moz',
    'moz2',
    'mac',
    'webkit',
    'webkit5',
    'themebuilder',
    'theme-markup-2',
    'toolbar',
    'style-clickable',
    'tb-auto-adjust-height',
    'tb-breadcrumb',
    'tb-content-wrapper-1',
    'tb-content-wrapper-2',
    'tb-content-wrapper-3',
    'tb-content-wrapper-4',
    'tb-header-inner-1',
    'tb-header-inner-2',
    'tb-header-inner-3',
    'tb-header-wrapper-1',
    'tb-header-wrapper-2',
    'tb-height-balance',
    'tb-hidden',
    'tb-left',
    'tb-no-select',
    'tb-precontent-1',
    'tb-precontent-2',
    'tb-precontent-3',
    'tb-prefooter-1',
    'tb-prefooter-2',
    'tb-prefooter-3',
    'tb-preview-shuffle-regions',
    'tb-primary',
    'tb-region',
    'tb-right',
    'tb-selector',
    'tb-selector-preferred',
    'tb-sidebar',
    'tb-scope',
    'tb-scope-prefer',
    'tb-terminal'
  ];    
};

/**
 * Causes the filter to be executed on the specified path.  The entire
 * path is passed to the filter so the filter can make choices about which
 * elements should be enabled or disabled or even removed entirely.
 *
 * @param {array} path
 *   The array of PathElement instances that together represent the entire
 *   css path to the element that the user selected.
 *
 * @return {array}
 *   A similar array to what was passed in that identifies the new path
 *   that should be used by the Selector instance that called the filter.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.activate = function (path) {
  path = this.removeEverythingAboveBodyTag(path);
  path = this.removeNonselectableEndElements(path);
  var body = this.configureBodyElement(path);

  // Terminal elements are tagged with the class 'tb-terminal', which
  // indicates the associated element should only appear in the element
  // selector if it is the last element in the selector.
  path = this.removeTerminalElements(path);

  // Scope elements are tagged with the class 'tb-scope', which indicates they
  // are significant structural elements that should always appear in the
  // selector.  Note that only one of these will be enabled by default.
  var scopeElements = this.getScopeElements(path);

  // Create a selector for the actual item selected that provides enough
  // specificity and options for theming.
  var items = this.getItemElements(path);

  // Construct the path
  path = [body].concat(scopeElements, items);

  // Configure significant elements in the path.
  this.configureRegionElement(path);
  this.configureBlockElement(path);
  this.configureViewElement(path);
  this.configureMenuElement(path);

  // Make sure blacklisted items never appear as options in the specificity
  // selector.
  path = this.blackListPath(path);

  this.enableLastElement(path);
  return path;
};

/**
 * Removes everything above the body tag in the specified path.  This is
 * useful for dropping the html tag from the path.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 * @return
 *   A new path array with every element above the body tag removed.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.removeEverythingAboveBodyTag = function (path) {
  var result = [];
  for (var index = 0; index < path.length; index++) {
    var element = path[index];
    if (element.getTag() === 'body') {
      result = path.slice(index);
      break;
    }
  }
  return result;
};

/**
 * Removes non-selectable elements from the right side of the element
 * selector.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 * @return
 *   A new path array with every element that cannot be selected removed from
 *   the right side.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.removeNonselectableEndElements = function (path) {
  var result = undefined;
  // Find the first relevant element from the right side.
  var len = path ? path.length : 0;
  for (var i = len - 1; i >= 0; i--) {
    var element = this.blackListPathElement(ThemeBuilder.clone(path[i]));
    if (element) {
      // Found the first element.
      if (i === path.length - 1) {
        result = path;
      }
      else {
        result = path.slice(0, i);
      }
      break;
    }
  }
  return result;
};

/**
 * Remvoves terminal elements from the specified path.  Terminal elements are
 * DOM elements that have the 'tb-terminal' class applied.  This class
 * indicates the associated element should only appear in the selector if it
 * is the element selected by the user.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 * @return
 *   A new path array with all of the terminal elements removed.  If the user
 *   selected a terminal element (it is the last one in the path), then it
 *   will appear in the resulting path.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.removeTerminalElements = function (path) {
  var result = [];
  for (var i = 0; i < path.length; i++) {
    var element = path[i];
    if (!element.hasClass('tb-terminal') || i === path.length - 1) {
      result.push(element);
    }
  }
  return result;
};

/**
 * Finds and configures the body element in the specified path.  The body
 * element will be stripped of all ids and classes and will be disabled by
 * default.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 * @return
 *   The configured body element.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.configureBodyElement = function (path) {
  var body = undefined;
  for (var i = 0; !body && i < path.length; i++) {
    if (path[i].getTag() === 'body') {
      body = path[i];
      break;
    }
  }
  body.humanReadable = Drupal.t('Site background');
  body.disableAllClasses();
  body.setIdEnabled(false);
  body.setEnabled(false);
  return body;
};

/**
 * Returns an array of PathElement objects representing the scope elements in
 * the path.  Scope elements are DOM elements that have the 'tb-scope' class
 * applied.  This class indicates the associated element(s) are significant
 * structural elements that should always appear in the selector.
 *
 * This method also configures the scope elements.  All but one of the scope
 * elements will be disabled.  The general rule is that the most specific
 * (farthest to the right) scope element will be enabled.  This can be
 * overridden in the markup by applying the 'tb-scope-prefer' class, which
 * provides a hint as to which of the scope elements should be enabled.  This
 * hint will be honored unless the user directly selected one of the other
 * scope elements available.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 * @return
 *   A new path array which only contains elements that have the 'tb-scope'
 *   class applied.  The elements will be configured, with only one of the set
 *   of elements enabled.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.getScopeElements = function (path) {
  var result = [];
  var indexes = this.getElementIndexesByClass(path, 'tb-scope');
  for (var i = 0; i < indexes.length; i++) {
    var element = ThemeBuilder.clone(path[indexes[i]]);
    if (this.canUseId(element)) {
      // Prefer the id.  As a general rule, all tb-scope elements should have
      // an id.
      element.disableAllClasses();
    }
    else {
      var classes = this.getNonBlacklistedClasses(element);
      element.disableAllClasses();
      element.setClassEnabled(classes[0], true);
    }
    element.setEnabled(false);
    this.normalizeSelector(element);
    result.push(element);
  }

  // Enable the appropriate tb-scope element.
  if (result.length > 0) {
    if (path.length > 0 && path[path.length - 1].hasClass('tb-scope')) {
      // The most specific tb-scope element was selected by the user.  Enable
      // that rather than honoring the tb-scope-prefer tag.
      result[result.length - 1].setEnabled(true);
    }
    else {
      var index = this.getElementIndexByClass(result, 'tb-scope-prefer');
      if (index >= 0) {
        // A tb-scope-prefer tag is overriding the most specific tb-scope
        // element.
        result[index].setEnabled(true);
      }
      else {
        // The default behavior is to enable the most specific tb-scope
        // element.
        result[result.length - 1].setEnabled(true);
      }
    }
  }
  return result;
};

/**
 * Returns an object that configures the region element, given the specified
 * path.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.configureRegionElement = function (path) {
  var index = this.getElementIndexByClass(path, 'tb-region');
  if (index >= 0) {
    var element = path[index];
    if (this.canUseId(element)) {
      // Prefer the id.
      element.disableAllClasses();
      element.setTagEnabled(false);
      element.setIdEnabled(true);
    }
    else {
      var classes = this.getNonBlacklistedClasses(element);
      element.disableAllClasses();
      if (classes && classes.length > 0) {
        // Use a class.
        element.setClassEnabled(classes[0], true);
        element.setTagEnabled(false);
      }
      else {
        // Use the tag.
        element.setTagEnabled(true);
      }
    }
    element.setElementGroup(Drupal.t('region'), Drupal.t('regions'));
  }
};

/**
 * Returns an object that configures the block element, given the specified
 * path.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.configureBlockElement = function (path) {
  var index = this.getElementIndexByClass(path, 'block');
  if (index >= 0) {
    var element = path[index];
    // Prefer the block class.
    element.disableAllButOneClass('block');
    element.setTagEnabled(false);
    element.setIdEnabled(false);
    element.setElementGroup(Drupal.t('block'), Drupal.t('blocks'));
    if (path.length > 0 && path[path.length - 1].getId() === element.getId()) {
      // Normally we don't select the block, but in this case the user
      // selected the block specifically.
      element.setEnabled(true);
    }
    else {
      element.setEnabled(false);
    }
  }
};

/**
 * Returns an object that configures the View element, given the specified
 * path.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.configureViewElement = function (path) {
  var index = this.getElementIndexByClass(path, 'view');
  if (index >= 0) {
    var element = path[index];
    // Prefer the second class on the view element if more than one exists
    var classes = this.getNonBlacklistedClasses(element);
    if (classes && classes.length > 1) {
      element.disableAllButOneClass(classes[1]);
    }
    else {
      element.disableAllButOneClass(classes[0]);
    }
    element.setTagEnabled(false);
    element.setIdEnabled(false);
    element.setElementGroup(Drupal.t('view'), Drupal.t('views'));
    element.setEnabled(true);
  }
};

/**
 * Returns an object that configures the View element, given the specified
 * path.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.configureMenuElement = function (path) {
  // This code assumes a maximum 5 levels of nested menus. Any more is an edge
  // case.
  for (var i = 1; i < 6; i++) {
    var index = this.getElementIndexByClass(path, 'level-' + i);
    if (index >= 0) {
      var element = path[index];
      // Prefer the second class on the menu element if more than one exists
      var classes = this.getNonBlacklistedClasses(element);      
      if (classes && classes.length > 1 && !(element.getAllClasses().contains('leaf'))) {
        element.disableAllButOneClass(classes[1]);
      }
      else {
        element.disableAllButOneClass(classes[0]);
      }
      element.setElementGroup(Drupal.t('menu item'), Drupal.t('menu items'));
      // Enable the second-level menu items to create a good scope.
      if (i === 2) {
        element.setTagEnabled(false);
        element.setIdEnabled(false);
        element.setEnabled(true);
      }
    }
  }
};

/**
 * Returns an array of configured PathElement objects that will be sufficient
 * for describing the selected element.  This method focuses only on the
 * selected element, not the full selector.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 * @return
 *   A new path array which only contains elements that sufficiently represent
 *   the element that the user selected.  The elements will be configured with
 *   only the number of elements enabled to reasonably identify the selection.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.getItemElements = function (path) {
  var pathEnd = [];
  var farEnough = false;
  var enable = true;
  var caps = ['block'];
  var extenders = ['view', 'pulldown'];
  var isLong = false;
  var tagOrClassCount = 0;
  for (var elementIndex = path.length - 1; !farEnough && elementIndex > 0 && elementIndex >= 0; elementIndex--) {
    var element = path[elementIndex];
    // If the element is a .tb-scope element, then we've gone far enough.
    if (element.hasClass('tb-scope')) {
      farEnough = true;
    }
    else {
      // Process the element.
      element.setEnabled(enable);
      // Use the element's ID.
      if (this.canUseId(element)) {
        element.disableAllClasses();
        element.setTagEnabled(false);
        element.setIdEnabled(true);
        enable = false;
      }
      // Use the element's tag.
      else if (!this.tagBlackList.contains(element.getTag())) {
        element.disableAllClasses();
        element.setIdEnabled(false);
        element.setTagEnabled(true);
        tagOrClassCount++;
      }
      // Use the element's first class.
      else {
        var classes = this.getNonBlacklistedClasses(element);
        if (classes && classes.length > 0) {
          element.disableAllButOneClass(classes[0]);
          element.setIdEnabled(false);
          element.setTagEnabled(false);
          tagOrClassCount++;
        }
      }
      // Stop enabling elements if the first two are already enabled.
      if (tagOrClassCount > 1) {
        enable = false;
      }
      pathEnd.push(element);
      // If we find an element in the path that extends the path end, then mark
      // it as isLong. This is done for components like Views or menus so that
      // all the elements of the component are available for selection.
      for (var i = 0; i < extenders.length; i++) {
        if (element.hasClass(extenders[i])) {
          isLong = true;
        }
      }
      // If we find an element in the path that is identified as a cap, then the
      // path has been parsed enough.
      for (var j = 0; j < caps.length; j++) {
        if (element.hasClass(caps[j])) {
          farEnough = true;
        }
      }
    }
  }

  // Trim the number of elements if isLong is false and the path is long.
  if (pathEnd.length > 3 && !isLong) {
    pathEnd = pathEnd.slice(0, 3);
  }
  // The code works backwards (right to left), so reverse the resulting path
  // to achieve the correct order of PathElement instances.
  return pathEnd.reverse();
};

/**
 * Returns classes associated with the specified element which do not appear
 * in the class blacklist.
 *
 * @param {PathElement}
 *   The path element object.
 * @return
 *   An array of classes associated with the specified object that are not in
 *   the class blacklist.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.getNonBlacklistedClasses = function (element) {
  var result = [];
  var classes = element.getClasses();
  for (var i = 0; classes && i < classes.length; i++) {
    if (!this.classBlackList.contains(classes[i])) {
      result.push(classes[i]);
    }
  }
  return result;
};

/**
 * Determines whether the id can be used to identify the specified element.
 *
 * @param {PathElement}
 *   The path element object.
 * @return
 *   true if the id associated with the specified element can be used to
 *   identify the element; false otherwise.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.canUseId = function (element) {
  var id = element.getId();
  return id && !this.idBlackList.contains(id) && !this.isNodeId(id);
};

/**
 * Returns true if the specified element id represents a node id.
 *
 * @param {String} id
 *   The element id.
 * @return
 *   True if the id represents a node; false otherwise.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.isNodeId = function (id) {
  var result = id.match(/^node-(\d)+$/);
  return result;
};

/**
 * Causes the last element in the path to be selected.  This is important
 * because it represents the element closest to the element selected by the
 * user.
 *
 * @param {array} path
 *   The path, which is an array of PathElement objects.
 */
ThemeBuilder.styles.ThemeMarkup2Filter.prototype.enableLastElement = function (path) {
  if (path.length > 0) {
    path[path.length - 1].setEnabled(true);
  }
};;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};


/**
 * The selector class represents a css selector broken down into its
 * constituent parts.
 * @class
 */
ThemeBuilder.styles.Selector = ThemeBuilder.initClass();

/**
 * The constructor of the Selector class.
 *
 * @param {object} filter
 *   The filter to use with this Selector instance.  The filter is responsible
 *   for filtering elements from the path.
 */
ThemeBuilder.styles.Selector.prototype.initialize = function (filter) {
  if (filter && typeof filter.activate !== 'function') {
    throw "filter parameter must have an activate method.";
  }
  this.filter = filter;
  this.listeners = [];
};

/**
 * Called when the settings have changed.  This is intended to be
 * called by the UI code when the user interacts with the path.
 * Modify any of the path element settings and then call this method
 * so the path can be run through the filter again.
 */
ThemeBuilder.styles.Selector.prototype.pathElementSettingsChanged = function () {
  this.selectorChanged();
};

/**
 * Adds the specified listener, which will be called when changes are done
 * to the selector.  This is a simple scheme that can be used to keep the
 * UI in sync with changes to the underlying selector.
 *
 * @param {object} listener
 *  The listener object, which can have a selectorChanged method that is called
 *  when the selector is modified, and a selectorElementChanged method that
 *  is called when the selected element is changed.
 */
ThemeBuilder.styles.Selector.prototype.addSelectorListener = function (listener) {
  this.listeners.push(listener);
};

/**
 * Called when changes occur to the selector.  This causes the listeners
 * to be notified.
 */
ThemeBuilder.styles.Selector.prototype.selectorChanged = function () {
  for (var i = 0; i < this.listeners.length; i++) {
    if (this.listeners[i].selectorChanged) {
      this.listeners[i].selectorChanged(this);
    }
  }
};

/**
 * Called when the selected element is changed.
 */
ThemeBuilder.styles.Selector.prototype.selectorElementChanged = function () {
  for (var i = 0; i < this.listeners.length; i++) {
    if (this.listeners[i].selectorElementChanged) {
      this.listeners[i].selectorElementChanged(this);
    }
  }
};

/**
 * Reset this instance with the specified element.  The path of the
 * specified element will replace the existing path.
 *
 * @param {DOMElement} element
 *   The DOM element representing the target of this selector.  The path
 *   will be generated by looking up from the specified element.
 */
ThemeBuilder.styles.Selector.prototype.setElement = function (element) {
  var path = [];
  this._selectedElement = element;
  while (element && element.nodeType === 1) {
    var pathelement = new ThemeBuilder.styles.PathElement(element);
    path.push(pathelement);
    element = element.parentNode;
  }
  this.path = path.reverse();
  if (this.filter) {
    this.originalPath = this.path;
    this.path = this.filter.activate(this.path.slice());
  }
  this.selectorElementChanged();
};

/**
 * Returns the element that was selected by the user.
 *
 * @return {DOMElement}
 *   The DOM element representing the user's selection.
 */
ThemeBuilder.styles.Selector.prototype.getElement = function () {
  return this._selectedElement;
};

/**
 * Returns the element that should be highlighted or used for figuring out
 * current property values.
 */
ThemeBuilder.styles.Selector.prototype.getSelectedElement = function () {
  var $ = jQuery;
  var selector = this.getCssSelector();
  selector = ThemeBuilder.util.removeStatePseudoClasses(selector);
  var selectedElement = this.getElement();
  if (selectedElement) {
    for (var element = selectedElement; element.parentNode; element = element.parentNode) {
      if ($(element).is(selector)) {
        return element;
      }
    }
  }
  return $('body').get(0);
};

/**
 * Returns the css selector that corresponds to the current state of this
 * Selector instance.
 *
 * @return {string}
 *   A string containing the css selector.
 */
ThemeBuilder.styles.Selector.prototype.getCssSelector = function () {
  var path_strings = [];
  if (this.path) {
    for (var i = 0; i < this.path.length; i++) {
      var selector = this.path[i].getEnabledCssSelector();
      if (selector !== '') {
        path_strings.push(selector);
      }
    }
  }
  return path_strings.join(' ');
};

/**
 * Returns a human readable phrase that describes the current selection.
 *
 * @return {string}
 *   A string containing a human readable phrase.
 */
ThemeBuilder.styles.Selector.prototype.getHumanReadableSelector = function () {
  var path_strings = [];
  if (this.path) {
    // Construct the phrase from the inside out.
    for (var i = this.path.length - 1; i >= 0; i--) {
      var selector = this.path[i].getEnabledCssSelector();
      if (selector !== '') {
        var description = this.path[i].getHumanReadableLabelFromSelector(selector);
        if (path_strings.length === 0) {
          description = ThemeBuilder.util.capitalize(description);
        }
        path_strings.push(description);
      }
    }
  }
  return path_strings.join(Drupal.t(' in '));
};


//------------- PathElement --------------------
/**
 * An instance of the PathElement class represents a single element and
 * its associated attributes (id, tag, classes) as appropriate for the
 * specific element it represents.
 * @class
 */
ThemeBuilder.styles.PathElement = ThemeBuilder.initClass();

/**
 * Constructor for the PathElement class.  This constructor takes a
 * DOM element and initializes the PathElement instance accordingly.
 */
ThemeBuilder.styles.PathElement.prototype.initialize = function (element) {
  this._initializeFromElement(element);
  this._filterClasses();
};

/**
 * Initializes this PathElement instance from the specified DOM element.
 * By default, the element will be enabled, all of its classes will be
 * enabled, and its id will be enabled if it exists.
 *
 * This class is not the right place to implement selection policy; it
 * makes everything available, and each of these pieces can be filtered
 * by a separate object.
 *
 * @param {DOMElement} element
 *   The DOM element from which this instance should be initialized.
 */
ThemeBuilder.styles.PathElement.prototype._initializeFromElement = function (element) {
  this.element_group_singular = '';
  this.element_group_plural = 'items';
  this.enabled = true;
  this.tag = element.tagName.toLowerCase();
  this.tag_enabled = true;
  this.id = element.id;
  // Make sure the id is valid.
  if (this.id && !this.id.match(/^[A-Za-z]+[A-Za-z0-9-_:.]*$/)) {
    this.id = undefined;
  }
  this.id_enabled = (this.id !== undefined);
  this._addPseudoClasses(element);

  this.classes_enabled = {};
  if (element.className) {
    this.classes = element.className.split(' ');
    for (var i = 0; i < this.classes.length; i++) {
      if (typeof this.classes[i] === 'string') {
        this.classes_enabled[this.classes[i]] = true;
      }
    }
  }
  this.pseudoclasses_enabled = {};
  if (this.pseudoclasses) {
    for (i = 0; i < this.pseudoclasses.length; i++) {
      if (typeof this.pseudoclasses[i] === 'string') {
        this.pseudoclasses_enabled[this.pseudoclasses[i]] = false;
      }
    }
  }
};

/**
 * Adds pseudoclasses to appropriate elements.
 *
 * @private
 *
 * @param {DomElement} element
 *   The element that was selected.
 */
ThemeBuilder.styles.PathElement.prototype._addPseudoClasses = function (element) {
  if (this.tag === 'a') {
    this.pseudoclasses = [Drupal.t('none'), 'link', 'visited', 'hover', 'active'];
  }
  else {
    this.pseudoclasses = [Drupal.t('none'), 'hover'];
  }
  
  if (element.parentNode.firstChild === element) {
    this.pseudoclasses.push('first-child');
  }
  if (ThemeBuilder.util.getLastChild(element.parentNode) === element) {
    this.pseudoclasses.push('last-child');
  }
};

/**
 * Sets the group that this element falls into.  Examples of groups
 * are "region" and "block".  These group names are used in the
 * construction of the human readable string that represents this
 * element.
 *
 * @param {string} groupSingular
 *   The name of the group, singular form.
 * @param {string} groupPlural
 *   The name of the group, plural form.
 */
ThemeBuilder.styles.PathElement.prototype.setElementGroup = function (groupSingular, groupPlural) {
  this.element_group_singular = groupSingular;
  this.element_group_plural = groupPlural;
};

/**
 * Returns the name of the group that this element falls into.
 *
 * @param {boolean} plural
 *   Optional parameter that indicates whether the singular or plural
 *   form is desired.  The default is singular if this parameter is
 *   not specified.
 *
 * @return {string}
 *   The element group.
 */
ThemeBuilder.styles.PathElement.prototype.getElementGroup = function (plural) {
  if (plural === true) {
    return this.element_group_plural;
  }
  return this.element_group_singular;
};

/**
 * Returns the human readable label that corresponds to this path element
 * instance.
 *
 * @return {string}
 *   A string containing the human readable label.
 */
ThemeBuilder.styles.PathElement.prototype.getHumanReadableLabel = function () {
  if (this.humanReadable) {
    return (this.humanReadable);
  }

  var pseudoclass = null;
  var scopePseudoclass = '';
  var statePseudoclass = '';
  if (this.pseudoclasses_enabled) {
    pseudoclass = this.pseudoclasses_enabled[0];
    switch (this.getPseudoClassType(pseudoclass)) {
    case 'scope':
      scopePseudoclass = pseudoclass;
      break;
    case 'state':
      statePseudoclass = pseudoclass;
      break;
    }
  }
  if (this.id_enabled && this.id) {
    return Drupal.t('the @scope@id @group',
      {"@scope": scopePseudoclass,
       "@id": this.convertToHuman(this.getId()),
       "@group": this.getElementGroup(false)});
  }
  var classes = this.getEnabledClasses();
  if (classes) {
    return Drupal.t('all @scope@class @group',
      {"@scope": scopePseudoclass,
       '@class': this.convertToHuman(classes[0]),
      '@group': this.getElementGroup(true)});
  }
  if (this.tag_enabled === true) {
    return Drupal.t('all @scope@tag @group',
      {"@scope": scopePseudoclass,
       '@tag': this.getTagName(),
      '@group': this.getElementGroup(true)});
  }
  return (this.getEnabledCssSelector());
};

/**
 * Returns the human readable label that corresponds to this path element
 * instance given the specified css selector.  This form is needed because
 * it allows the human readable label to be generated for this element
 * for states that the element is currently not in.  This is a requirement
 * for rendering an option menu that allows the user to select the desired
 * element state from a list.
 *
 * @param {string} css
 *   The css selector representing the state of this element that should be
 *   rendered in human readable text.
 *
 * @return {string}
 *   A string containing the human readable label.
 */
ThemeBuilder.styles.PathElement.prototype.getHumanReadableLabelFromSelector = function (css) {
  var result = '';
  var pseudoclass = ThemeBuilder.util.getPseudoClass(css);
  css = ThemeBuilder.util.removePseudoClasses(css);
  var which = '';
  var state = '';
  if (pseudoclass) {
    switch (pseudoclass) {
    case 'first-child':
      which = Drupal.t('first ');
      break;
    case 'last-child':
      which = Drupal.t('last ');
      break;
    default:
      state = Drupal.t(' in the @state state', {'@state': pseudoclass});
    }
  }
  switch (css.charAt(0)) {
  case '#':
    result =  Drupal.t('the @which@id @group@state', {
        '@which': which,
        '@id': this.convertToHuman(css.substr(1)),
        '@group': this.getElementGroup(false),
        '@state': state
      });
    break;

  case '.':
    var group = this.getElementGroup(true);
    if (!group) {
      group = Drupal.t('objects');
    }
    result = Drupal.t('all @which@class @group@state', {
        '@which': which,
        '@class': this.convertToHuman(css.substr(1)),
        '@group': this.getElementGroup(true),
        '@state': state
      });
    break;
  // the body element
  case 'b':
    if (css === 'body' && this.humanReadable) {
      result = Drupal.t('@result@state', {
        '@result': this.humanReadable,
        '@state': state
      });
    }
    break;
  default:
    // This would be a tag name
    result = Drupal.t('all @which@tag@state', {
        '@which': which,
        '@tag': this.getTagName(css),
        '@state': state
      });
  }
  return result;
};

/**
 * Converts the specified css selector name string to human readable
 * text.  Note that this is only designed to work with a single part
 * of the css.  Specify either the id, a class, or a tag.  Not any
 * combination.  This method converts the name part of the selector, not
 * the type specifier character ('#', '.').  Essentially this method
 * removes confusing duplication that occurs when the region and the
 * selector have the same text.
 *
 * Example: block-shortcut-shortcuts => shortcut-shortcuts, and used
 * in the human readable label "The shortcut-shortcuts block".
 *
 * @param {string} css
 *   A string containing a css selector that represents the state of this
 */
ThemeBuilder.styles.PathElement.prototype.convertToHuman = function (css) {
  if (this.css_prefix) {
    if (css === this.css_prefix) {
      css = '';
    }
    else {
      // Make sure it includes the separator.
      var prefix = css.substring(0, this.css_prefix.length + 1);
      if (prefix === this.css_prefix + '-') {
        css = css.substring(prefix.length);
      }
    }
  }
  // Remove redundant "-region" suffixes.
  var regionRegExp = new RegExp("-region$");
  css = css.replace(regionRegExp, '');
  return css;
};

/**
 * Filters out the classes in a blacklist so they will not be selectable
 * by the user.
 */
ThemeBuilder.styles.PathElement.prototype._filterClasses = function () {
  if (!ThemeBuilder.styles.PathElement.classBlackList) {
    ThemeBuilder.styles.PathElement.classBlackList = [
      'style-clickable', 'overlay-processed', 'selected', 'selection'
    ];
  }
  if (!ThemeBuilder.styles.PathElement.classGreyList) {
    // The grey list represents classes that should never be selected
    // by default, though should be made available to the user.
    ThemeBuilder.styles.PathElement.classGreyList = [
      'first', 'last', 'leaf', 'area', 'tb-region'
    ];
  }
  if (!this.classes) {
    return;
  }
  var classes = [];
  var greyClasses = [];
  var len = this.classes.length;
  for (var i = 0; i < len; i++) {
    if (!ThemeBuilder.styles.PathElement.classBlackList.contains(this.classes[i])) {
      if (!ThemeBuilder.styles.PathElement.classGreyList.contains(this.classes[i])) {
        classes.push(this.classes[i]);
      }
      else {
        greyClasses.push(this.classes[i]);
      }
    }
  }
  this.classes = classes;
  this.greyClasses = greyClasses;
};

/**
 * Returns the xhtml tag name associated with this PathElement instance.
 * The tag name will always be lower case.
 *
 * @return
 *   A string containing the tag name associated with this path element.
 */
ThemeBuilder.styles.PathElement.prototype.getTag = function () {
  return this.tag;
};

/**
 * Returns the id associated with this element.
 *
 * @return
 *   A string containing the element id, or undefined if the id is not
 *   present.
 */
ThemeBuilder.styles.PathElement.prototype.getId = function () {
  return this.id;
};

/**
 * Returns all of the primary classes associated with this path element.
 * The primary classes do not include the grey classes.
 *
 * @return
 *   An array containing the associated classes, or undefined if no
 *   non-grey css classes are associated with this PathElement
 *   instance.
 */
ThemeBuilder.styles.PathElement.prototype.getClasses = function () {
  var classes = undefined;
  if (this.classes) {
    classes = this.classes.slice();
  }
  return classes;
};

/**
 * Returns all classes associated with this element that are selectable
 * by the user.  This list includes the primary classes and the grey
 * classes.  The grey classes are those that are selectable by the
 * user but would never be automatically selected when the user chooses
 * an element.
 *
 * @return
 *   An array containing the associated classes, or undefined if no
 *   css classes are associated with this PathElement instance.
 */
ThemeBuilder.styles.PathElement.prototype.getAllClasses = function () {
  var allClasses = undefined;
  if ((this.classes && this.classes.length > 0) ||
    (this.greyClasses && this.greyClasses.length > 0)) {
    allClasses = [].concat(this.classes, this.greyClasses);
  }
  return allClasses;
};

/**
 * Indicates whether this element has the specified CSS class associated with
 * it.
 *
 * @param {String} classname
 *   The CSS class to query for.
 * @return
 *   true if this element has the specified classname; false otherwise.
 */
ThemeBuilder.styles.PathElement.prototype.hasClass = function (classname) {
  var allClasses = this.getAllClasses() || [];
  return allClasses.contains(classname);
};

/**
 * Returns only the enabled classes associated with this path element
 * instance.
 *
 * @return
 *   An array containing the associated enabled classes, or undefined if
 *   no css classes are associated with this PathElement instance.
 */
ThemeBuilder.styles.PathElement.prototype.getEnabledClasses = function () {
  var classes = this.getAllClasses();
  var enabledClasses = [];
  if (classes) {
    for (var i = 0; i < classes.length; i++) {
      if (this.classes_enabled[classes[i]] === true) {
        enabledClasses.push(classes[i]);
      }
    }
  }
  if (enabledClasses.length === 0) {
    enabledClasses = undefined;
  }
  return enabledClasses;
};

/**
 * Returns all pseudoclasses associated with this element that are selectable
 * by the user.  
 *
 * @return
 *   An array containing the associated pseudoclasses, or undefined if no css
 *   pseudoclasses are associated with this PathElement instance.
 */
ThemeBuilder.styles.PathElement.prototype.getAllPseudoClasses = function () {
  var allClasses = undefined;
  if (this.pseudoclasses && this.pseudoclasses.length > 0) {
    allClasses = [].concat(this.pseudoclasses);
  }
  return allClasses;
};

/**
 * Returns only the enabled pseudoclasses associated with this path element
 * instance.
 *
 * @return
 *   An array containing the associated enabled pseudoclasses, or undefined if
 *   no css pseudoclasses are associated with this PathElement instance.
 */
ThemeBuilder.styles.PathElement.prototype.getEnabledPseudoClasses = function () {
  var pseudoclasses = this.getAllPseudoClasses();
  var enabledClasses = [];
  if (pseudoclasses) {
    for (var i = 0; i < pseudoclasses.length; i++) {
      if (this.pseudoclasses_enabled[pseudoclasses[i]] === true) {
        enabledClasses.push(pseudoclasses[i]);
      }
    }
  }
  if (enabledClasses.length === 0) {
    enabledClasses = undefined;
  }
  return enabledClasses;
};

/**
 * Flags this element to be included or omitted from the css selector.
 *
 * @param {boolean} enabled
 *   If true, this element will be included in the css selector; otherwise
 *   it will be omitted.
 */
ThemeBuilder.styles.PathElement.prototype.setEnabled = function (enabled) {
  this.enabled = (enabled === true);
};

/**
 * Gets the enabled flag associated with this element.
 *
 * @return {boolean}
 *   True if this element is enabled; false otherwise.
 */
ThemeBuilder.styles.PathElement.prototype.getEnabled = function () {
  return (this.enabled);
};

/**
 * Flags the element tag to be included or omitted from the css selector.
 *
 * @param {boolean} enabled
 *   If true, the element tag associated with this PathElement instance
 *   will be included in the css selector; otherwise it will be omitted.
 */
ThemeBuilder.styles.PathElement.prototype.setTagEnabled = function (enabled) {
  this.tag_enabled = (enabled === true);
};

/**
 * Flags the element id to be included or omitted from the css
 * selector.
 *
 * @param {boolean} enabled
 *   If true, the id will be included in the css selector; otherwise it
 *   will be omitted.
 */
ThemeBuilder.styles.PathElement.prototype.setIdEnabled = function (enabled) {
  this.id_enabled = (enabled === true);
};

/**
 * Indicates whether the id will be included or omitted from the css selector.
 *
 * @return
 *   true if the id for this element will be included in the selector; false
 *   otherwise.
 */
ThemeBuilder.styles.PathElement.prototype.isIdEnabled = function () {
  return this.id_enabled;
};

/**
 * Flags the element class(es) to be included or omitted from the css
 * selector.
 *
 * @param {mixed} classes
 *   A string or array of strings that identify the class(es) to include or
 *   omit from the final css selector.
 * @param {boolean} enabled
 *   A boolean value that indicates whether the specified class(es) should
 *   be enabled or not.
 */
ThemeBuilder.styles.PathElement.prototype.setClassEnabled = function (classes, enabled) {
  var i;
  var allClasses = [].concat(this.classes, this.greyClasses);
  if (!classes || allClasses.length <= 0) {
    return;
  }
  if (typeof classes === 'string') {
    // Dealing with a single string representing a classname.
    if (this.classes_enabled[classes] === true ||
  this.classes_enabled[classes] === false) {
      this.classes_enabled[classes] = (enabled === true);
    }
  }
  else if (typeof classes === 'object' && classes instanceof Array) {
    // Dealing with an array of strings representing classnames.
    for (i = 0; i < classes.length; i++) {
      if (typeof classes[i] === 'string') {
        this.classes_enabled[classes[i]] = (enabled === true);
      }
    }
  }
};

/**
 * Flags the element pseudoclass(es) to be included or omitted from the css
 * selector.
 *
 * @param {mixed} pseudoclasses
 *   A string or array of strings that identify the pseudoclass(es) to include
 *   or omit from the final css selector.
 * @param {boolean} enabled
 *   A boolean value that indicates whether the specified pseudoclass(es)
 *   should be enabled or not.
 */
ThemeBuilder.styles.PathElement.prototype.setPseudoClassEnabled = function (pseudoclasses, enabled) {
  var i;
  if (!pseudoclasses || pseudoclasses.length <= 0) {
    return;
  }
  var allClasses = [].concat(this.pseudoclasses);
  if (typeof pseudoclasses === 'string') {
    // Dealing with a single string representing a classname.
    if (this.pseudoclasses_enabled[pseudoclasses] === true ||
	this.pseudoclasses_enabled[pseudoclasses] === false) {
      this.pseudoclasses_enabled[pseudoclasses] = (enabled === true);
    }
  }
  else if (typeof pseudoclasses === 'object' && pseudoclasses instanceof Array) {
    // Dealing with an array of strings representing classnames.
    for (i = 0; i < pseudoclasses.length; i++) {
      if (typeof pseudoclasses[i] === 'string') {
        this.pseudoclasses_enabled[pseudoclasses[i]] = (enabled === true);
      }
    }
  }
};

/**
 * Causes all of the classes associated with this element to be disabled.
 */
ThemeBuilder.styles.PathElement.prototype.disableAllClasses = function () {
  this.setClassEnabled(this.getAllClasses(), false);
};

/**
 * Causes all of the classes associated with this element with the exception
 * of the specified classname to be disabled.
 *
 * @param {string} classname
 *   The name of the class to enable; the remaining classes will be disabled.
 */
ThemeBuilder.styles.PathElement.prototype.disableAllButOneClass = function (classname) {
  this.disableAllClasses();
  if (classname) {
    this.setClassEnabled(classname, true);
  }
  else {
    var classes = this.getClasses();
    if (classes && classes.length > 0) {
      this.setClassEnabled(classes[0], true);
    }
  }
};

/**
 * Returns the full css selector that can be used to reference the
 * element associated with this PathElement instance.  All of the identifying
 * attributes are included regardless of whether they are enabled.
 *
 * @return
 *   A string representing a part of a CSS selector string that identifies
 *   the element associated with this PathElement instance.
 */
ThemeBuilder.styles.PathElement.prototype.getFullCssSelector = function () {
  var selector = this.getTag();
  var id = this.getId();
  if (id) {
    selector += '#' + id;
  }
  var classes = this.getAllClasses();
  if (classes) {
    selector += '.' + classes.join('.');
  }
  return selector;
};

/**
 * Returns a css selector that reflects the state of this element as it is
 * currently configured.  Only the parts of the element that are enabled will
 * be reflected in the resulting css selector.
 *
 * @return {string}
 *   A string representing a part of a CSS selector string that identifies
 *   the element associated with this PathElement instance as it is currently
 *   configured.
 */
ThemeBuilder.styles.PathElement.prototype.getCssSelector = function () {
  var selector = '';
  if (this.tag_enabled && this.tag) {
    selector += this.getTag();
  }
  if (this.id_enabled && this.id) {
    selector += '#' + this.id;
  }
  var classes = this.getEnabledClasses();
  if (classes) {
    selector += '.' + classes.join('.');
  }
  var pseudoclasses = this.getEnabledPseudoClasses();
  if (pseudoclasses) {
    selector += ':' + pseudoclasses.join(':');
  }
  return selector;
};

/**
 * Returns the css selector that can be used to reference the
 * element associated with this PathElement instance.  Only the enabled
 * attributes of the associated element will be included in the resulting
 * css selector.
 *
 * @return
 *   A string representing a part of a CSS selector string that identifies
 *   the element associated with this PathElement instance.
 */
ThemeBuilder.styles.PathElement.prototype.getEnabledCssSelector = function () {
  var selector = '';
  if (this.enabled === true) {
    selector += this.getCssSelector();
  }
  return selector;
};

/**
 * Returns the tag name associated with this css element.  The tag name is
 * returned as a human readable string, suitable for display in a ui.
 *
 * @return {string}
 *   The tag name.
 */
ThemeBuilder.styles.PathElement.prototype.getTagName = function () {
  if (!this.tagNameMap) {
    this.tagNameMap = {
      'a': Drupal.t('links'),
      'abbr': Drupal.t('abbreviations'),
      'acronym': Drupal.t('acronyms'),
      'address': Drupal.t('addresses'),
      'applet': Drupal.t('applets'),
      'area': Drupal.t('image map areas'),
      'b': Drupal.t('bold text'),
      'big': Drupal.t('big font elements'),
      'blockquote': Drupal.t('block quotes'),
      'body': Drupal.t('site background'),
      'br': Drupal.t('line breaks'),
      'button': Drupal.t('buttons'),
      'caption': Drupal.t('captions'),
      'center': Drupal.t('centered text'),
      'cite': Drupal.t('citations'),
      'code': Drupal.t('code listings'),
      'col': Drupal.t('table columns'),
      'colgroup': Drupal.t('table column groups'),
      'dd': Drupal.t('definitions'),
      'del': Drupal.t('deleted text'),
      'dfn': Drupal.t('definitions'),
      'dir': Drupal.t('directory titles'),
      'div': Drupal.t('divisions'),
      'dl': Drupal.t('definition lists'),
      'dt': Drupal.t('definition terms'),
      'em': Drupal.t('emphasized text'),
      'fieldset': Drupal.t('fieldsets'),
      'font': Drupal.t('font tags'),
      'form': Drupal.t('forms'),
      'frame': Drupal.t('frames'),
      'frameset': Drupal.t('framesets'),
      'h1': Drupal.t('primary headers'),
      'h2': Drupal.t('secondary headers'),
      'h3': Drupal.t('tertiary headers'),
      'h4': Drupal.t('header 4s'),
      'h5': Drupal.t('header 5s'),
      'h6': Drupal.t('header 6s'),
      'hr': Drupal.t('horizontal lines'),
      'i': Drupal.t('italicized text'),
      'iframe': Drupal.t('inline frames'),
      'img': Drupal.t('images'),
      'input': Drupal.t('input fields'),
      'ins': Drupal.t('inserted text'),
      'kbd': Drupal.t('user typed text'),
      'label': Drupal.t('input labels'),
      'legend': Drupal.t('legends'),
      'li': Drupal.t('list items'),
      'object': Drupal.t('objects'),
      'ol': Drupal.t('ordered lists'),
      'option': Drupal.t('options'),
      'p': Drupal.t('paragraphs'),
      'pre': Drupal.t('preformated sections'),
      'q': Drupal.t('quoted text'),
      's': Drupal.t('strikethrough text'),
      'samp': Drupal.t('sample code'),
      'select': Drupal.t('select lists'),
      'small': Drupal.t('small text'),
      'span': Drupal.t('spans'),
      'strike': Drupal.t('strikethrough text'),
      'strong': Drupal.t('emphasized text'),
      'sub': Drupal.t('subscript text'),
      'sup': Drupal.t('superscript text'),
      'table': Drupal.t('tables'),
      'tbody': Drupal.t('table bodies'),
      'td': Drupal.t('table data'),
      'textarea': Drupal.t('text areas'),
      'tfoot': Drupal.t('table footers'),
      'th': Drupal.t('table column headings'),
      'thead': Drupal.t('table headers'),
      'title': Drupal.t('titles'),
      'tr': Drupal.t('table rows'),
      'tt': Drupal.t('teletype text'),
      'u': Drupal.t('underlined text'),
      'ul': Drupal.t('unordered lists'),
      'var': Drupal.t('variable text')
    };
  }
  var tag = this.getTag();
  var tagName = this.tagNameMap[tag];
  if (!tagName) {
    tagName = tag;
  }
  return tagName;
};

/**
 * Builds a specificity map for this elemnent.  The specificity map is
 * effectively an ordered list of selector options that describe this
 * element using its id, classes, and tag.  The map is used to provide
 * options to the user for setting the specificity of the css selector
 * associated with this element.
 *
 * @return {array}
 *   An array of objects that comprise the map.  Each object contains
 *   a name field which contains the css string and a use field which indicates
 *   what part of the element would be used for that specificity
 *   selection (id, class, tag).
 */
ThemeBuilder.styles.PathElement.prototype.buildSpecificityMap = function () {
  if (!this.specificityMap) {
    this.specificityMap = {'identification': [], 'pseudoclass': []};
    var id = this.getId();
    if (id) {
      this.specificityMap.identification.push({'name': '#' + id, 'use': 'id'});
    }
    var classes = this.getClasses();
    if (classes) {
      for (var i = 0; i < classes.length; i++) {
        this.specificityMap.identification.push({
          'name': '.' + classes[i],
          'use': 'class',
          'classname': classes[i]
        });
      }
    }
    if (this.tag) {
      this.specificityMap.identification.push({'name': this.getTag(), 'use': 'tag'});
    }
    var greyClasses = this.greyClasses;
    if (greyClasses) {
      for (i = 0; i < greyClasses.length; i++) {
        this.specificityMap.identification.push({
          'name': '.' + greyClasses[i],
          'use': 'class',
          'classname': greyClasses[i]
        });
      }
    }
    var pseudoclasses = this.pseudoclasses;
    if (pseudoclasses && pseudoclasses.length > 1) {
      var pseudoclassMap = this.specificityMap.pseudoclass;
      for (i = 0; i < pseudoclasses.length; i++) {
        this.specificityMap.pseudoclass.push({
          'name': (i === 0 ? pseudoclasses[i] : ':' + pseudoclasses[i]),
          'use': 'pseudoclass',
          'classname': (i === 0 ? '' : pseudoclasses[i])
        });
      }
    }
  }
};

/**
 * Returns an array of specificity options available for this element.
 * In addition to the fields provided by the buildSpecificityMap method,
 * this method adds a field that indicates whether the option is selected
 * or not.
 *
 * @return {array}
 *   An array of specificity options available for this element.
 */
ThemeBuilder.styles.PathElement.prototype.getSpecificityOptions = function () {
  this.buildSpecificityMap();
  var result = {'identification': [], 'pseudoclass': []};
  var types = ['identification', 'pseudoclass'];
  var currentSelector = this.getCssSelector();
  var enabledPseudoclasses = this.getEnabledPseudoClasses();
  if (enabledPseudoclasses && enabledPseudoclasses.length > 0) {
    var pseudoclass = enabledPseudoclasses[0];
  }
  for (var typeIndex = 0; typeIndex < types.length; typeIndex++) {
    var type = types[typeIndex];
    if (type === 'identification') {
      // Need to remove the pseudoclass for this comparison.
      currentSelector = ThemeBuilder.util.removePseudoClasses(currentSelector);
    }
    else {
      if (!pseudoclass) {
        currentSelector = Drupal.t('none');
      }
      else {
        currentSelector = ':' + pseudoclass;
      }
    }
    for (var i = 0; i < this.specificityMap[type].length; i++) {
      var option = ThemeBuilder.clone(this.specificityMap[type][i]);
      if (option.classname === 'tb-region' || option.classname === 'area') {
        // These classes should be blacklisted but we need them for
        // identifying the region.  Simply don't add them to the specificity
        // option panel.
        continue;
      }
      if (currentSelector === option.name) {
        option.selected = true;
      }
      result[type].push(option);
    }
  }
  return result;
};

/**
 * Selects the specificity option corresponding to the specified option
 * index.
 *
 * @param {int} sindex
 *   The specificity index corresponding to the specificity option that
 *   should be selected.
 */
ThemeBuilder.styles.PathElement.prototype.setSpecificity = function (type, sindex) {
  this.buildSpecificityMap();
  if (sindex >= 0 && sindex < this.specificityMap[type].length) {
    var entry = this.specificityMap[type][sindex];
    switch (entry.use) {
    case 'id':
      this.setIdEnabled(true);
      this.disableAllClasses();
      this.setTagEnabled(false);
      break;
    case 'class':
      this.setIdEnabled(false);
      this.disableAllButOneClass(entry.classname);
      this.setTagEnabled(false);
      break;      
    case 'tag':
      this.setIdEnabled(false);
      this.disableAllClasses();
      this.setTagEnabled(true);
      break;
    case 'pseudoclass':
      this.setPseudoClassEnabled(this.getAllPseudoClasses(), false);
      this.setPseudoClassEnabled(entry.classname, true);
    }
  }
};

/**
 * The Filter class is responsible for filtering path elements within a
 * selector.  This is an example filter which is used for testing purposes.
 * @class
 */
ThemeBuilder.styles.Filter = ThemeBuilder.initClass();

/**
 * The constructor of the Filter class.
 */
ThemeBuilder.styles.Filter.prototype.initialize = function () {
};

/**
 * Causes the filter to be executed on the specified path.  The entire
 * path is passed to the filter so the filter can make choices about which
 * elements should be enabled or disabled or even removed entirely.
 *
 * @param {array} path
 *   The array of PathElement instances that together represent the entire
 *   css path to the element that the user selected.
 *
 * @return {array}
 *   A similar array to what was passed in that identifies the new path
 *   that should be used by the Selector instance that called the filter.
 */
ThemeBuilder.styles.Filter.prototype.activate = function (path) {
  var newPath = [];
  for (var i = 0; i < path.length; i++) {
    var pathelement = ThemeBuilder.clone(path[i]);
    this.filter(pathelement);
    newPath.push(pathelement);
  }
  return newPath;
};

/**
 * Filter out naked divs - elements of type 'div' that do not have
 * identifying attributes.
 *
 * @param {PathElement} pathElement
 *   The PathElement instance to filter.  If the path element is a div
 *   and has no id or classes, it will be disabled as a result of calling
 *   the filter method.
 */
ThemeBuilder.styles.Filter.prototype.filter = function (pathElement) {
  if (pathElement.getTag() === 'div') {
    if (!pathElement.getId() && !pathElement.getClasses()) {
      pathElement.setEnabled(false);
    }
  }
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true */

/**
 * @namespace
 */
ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The ElementPicker class is responsible for highlighting elements
 * that are available for styling and allowing the user to select one
 * of those elements using the mouse.
 * @class
 */
ThemeBuilder.styles.ElementPicker = ThemeBuilder.initClass();

/**
 * Instantiates a new ElementPicker instance.
 */
ThemeBuilder.styles.ElementPicker.prototype.initialize = function () {
  this.clickItem = ThemeBuilder.bind(this, this._clickItem);
  this.mouseOverItem = ThemeBuilder.bind(this, this._mouseOverItem);
  this.refreshSelection = ThemeBuilder.bind(this, this._refreshSelection);
  this.hideHoverHighlight = ThemeBuilder.bind(this, this._hideHoverHighlight);
  var settings = ThemeBuilder.getApplicationInstance().getSettings();
  settings.addSettingsChangeListener(this);
};

/**
 * Registers the elements that correspond with the configured selectors so that they
 * will facilitate element selection with a pointing device.
 */
ThemeBuilder.styles.ElementPicker.prototype.registerElements = function () {
  var $ = jQuery;
  var selector;
  if (!this.path_selector) {
    // The selectorMap is a mapping that overrides the default Selector
    // behavior.  This map is associated with the currently selected theme,
    // and appears in the .info file.
    var selectorMap = ThemeBuilder.getApplicationInstance().getData().selectorMap;
    this.path_selector = new ThemeBuilder.styles.Selector(this._getPathFilter(selectorMap));
    this.path_selector.addSelectorListener(this);
    this.selectorEditor = new ThemeBuilder.styles.SelectorEditor(this.path_selector, '#path-selector');
  }
  this.getDomNavigator();
  this._addClickTargets();

  // Rather than creating a huge special cased blacklist, here we create a jQuery
  // object to use as the scope of our later search for items to add .style-clickable
  var scope = $('#page, #copyright, .region-page-bottom');
  
  $('*', scope)
    // Exclude generic divs and spans with no class.
    .not('div:not([class])')
    .not('span:not([class])')
    // Exclude things themebuilder has designated as unselectable.
    .not('.tb-no-select')
    // Add the #page, #copyright, and .region-page-bottom elements themselves
    // back into the selection.
    .add('#page, #copyright, .region-page-bottom')
    // Now that everything clickable is selected, bind click and hover handlers
    // to all of it.
    .bind('click', this.clickItem)
    .hover(this.mouseOverItem)
    // Mark everything that's gotten these handlers with a class, so we can
    // easily select it all again.
    .addClass('style-clickable');
  
  this.styling = true;
  
  // In the event that the element selector has already been used, once again
  // select the last used selection.
  var currentSelector = ThemeBuilder.util.getSelector();
  if (currentSelector && currentSelector !== '') {
    this.selectorSelected(currentSelector);
    this.getDomNavigator().highlightSelection(currentSelector);
  }
  
  //$('<div id="debug" style="position: fixed; top: 30px; background: #000; opacity: .9; z-index: 20000;"><div id="top"></div><div id="left"></div><div id="height"></div><div id="width"></div></div>').appendTo('body');
};

/**
 * Instantiates the appropriate path filter for the current theme.  This
 * determination is made based on a body class.  The path filter is
 * responsible for determining an appropriate selector for an element selected
 * by the user.
 *
 * @param selectorMap
 *   The selectorMap from the application init data which helps the
 *   SelectorEditor to fine-tune selectors.
 * @return
 *   The path filter appropriate for the current theme.
 */
ThemeBuilder.styles.ElementPicker.prototype._getPathFilter = function (selectorMap) {
  var filterNum = 1;
  var $ = jQuery;
  var bodyClasses = $('body').attr('class');
  var matches = bodyClasses.match(/theme-markup-([\d]+)/);
  if (matches && matches.length > 1) {
    filterNum = parseInt(matches[1], 10);
  }
  if (filterNum === 1) {
    return new ThemeBuilder.styles.ThemeMarkup1Filter(selectorMap);
  }
  else {
    return new ThemeBuilder.styles.ThemeMarkup2Filter(selectorMap);
  }
};

/**
 * Instantiates the appropriate DomNavigator for the current theme.  This
 * determination is made based on a body class.  The DomNavigator is
 * responsible for highlighting selected elements and allowing the user to
 * navigate throughout the DOM.
 *
 * @return
 *   A DomNavigator instance appropriate for the current theme.
 */
ThemeBuilder.styles.ElementPicker.prototype.getDomNavigator = function () {
  if (!this.domNavigator) {
    var filterNum = this._getThemeMarkupVersion();
    var settings = ThemeBuilder.getApplicationInstance().getSettings();
    var navigator = new ThemeBuilder.styles.PowerNavigator();

    if (filterNum === 1 || !settings.powerThemeEnabled()) {
      // Original set of themes.  Disable the arrows
      navigator.advanced = false;
    }
    else {
      // Version 2 of the theme markup.  Enable the arrows
      navigator.advanced = true;
    }
    this.domNavigator = navigator;
  }
  return this.domNavigator;
};

/**
 * Returns the version of the markup.  This version is used to instantiate
 * working parts of the themebuilder that are compatible with the theme.
 *
 * @return
 *   The version number, in integer form.
 */
ThemeBuilder.styles.ElementPicker.prototype._getThemeMarkupVersion = function () {
  var $ = jQuery;
  var version = 1;
  var bodyClasses = $('body').attr('class');
  var matches = bodyClasses.match(/theme-markup-([\d]+)/);
  if (matches && matches.length > 1) {
    version = parseInt(matches[1], 10);
  }
  return version;
};

/**
 * Adds click targets, if required by the theme.  Click targets are areas the
 * user can click to select an associated element that is completely occluded
 * by other elements.  This is often the case for elements that have a
 * negative z-index.
 *
 * The click targets should be created when the elements are registered with
 * the ElementPicker.
 *
 * @private
 */
ThemeBuilder.styles.ElementPicker.prototype._addClickTargets = function () {
  var $ = jQuery;
  var elements = $('.requires-click-target');
  for (var i = 0; i < elements.length; i++) {
    // The click target has an id that is derived from the id of the original
    // element.  It is a requirement that the original element has a unique
    // id.
    var div = '<div id="' + elements[i].id + '-target" class="tb-click-target"></div>';
    $('body').append($(div));
  }
};

/**
 * Removes the click targets.  This should be done when the ElementPicker
 * unregisteres elements so the click targets will disappear.
 *
 * @private
 */
ThemeBuilder.styles.ElementPicker.prototype._removeClickTargets = function () {
  var $ = jQuery;
  $('.tb-click-target').remove();
};

/**
 * Fetches the appropriate element.  This method handles the case in which the
 * specified element is actually a click target.  This method will return the
 * element associated with a click target.
 *
 * @private
 *
 * @param {DomElement} element
 *   The element to resolve.  Generally this would come from an event.
 * @return {DomElement}
 *   The element.  If the specified element is a click target, this will be
 *   the associated element rather than the click target.  Otherwise, the
 *   specified elemen is returned.
 */
ThemeBuilder.styles.ElementPicker.prototype._resolveElement = function (element) {
  var $ = jQuery;
  var result = element;
  if ($(element).hasClass('tb-click-target')) {
    // This is a click target; substitute the real target.
    var id = element.id.replace(new RegExp('-target$'), '');
    result = $('#' + id)[0];
  }
  return result;
};

/**
 * Unregisters elements.  See this.registerElements.
 */
ThemeBuilder.styles.ElementPicker.prototype.unregisterElements = function () {
  var $ = jQuery;
  $('.style-clickable')
    .removeClass('style-clickable')
    .unbind('mouseover', this.mouseOverItem)
    .unbind('click', this.clickItem);

  $('.style-clickable-ohover').removeClass('style-clickable-ohover');
  this.hideHoverHighlight();
  
  // Remove highlighter
  $('.selected').removeClass('selected');
  $('.tb-nav').hide();
  $('#the-hover').remove();
  $('.link-hover').remove();
  
  this.getDomNavigator().unhighlightSelection();
  this._removeClickTargets();
  this.styling = false;
};

/**
 * Called when the selector changed.
 *
 * @param {Selector} selector
 *   The Selector instance.
 */
ThemeBuilder.styles.ElementPicker.prototype.selectorChanged = function (selector) {
  var selectorString = selector.getCssSelector();
  this.selectorSelected(selectorString);
  this.getDomNavigator().highlightSelection(ThemeBuilder.util.removeStatePseudoClasses(selectorString));
};

/**
 * Respond to the user choosing a new selector.
 *
 * @param {string} selector
 *   The CSS selector that the user wants to style.
 */
ThemeBuilder.styles.ElementPicker.prototype.selectorSelected = function (selector) {
  var $ = jQuery;
  ThemeBuilder.util.setSelector(selector);

  ThemeBuilder.styleEditor.fontEditor.selectorChanged(selector);
  ThemeBuilder.styleEditor.boxEditor.selectorChanged(selector);
  ThemeBuilder.styleEditor.backgroundEditor.selectorChanged(selector);
};

/**
 * Called when the user enters a user-selectable element with the mouse.
 * Doing this in JavaScript is nicer than the CSS alternative because we
 * can highlight only 1 element even if multiple selectable elements are
 * nested; in css, all selectable items under the mouse will be highlighted
 * at once.
 *
 * @private
 *
 * @param {Event} the mouseover event.
 */
ThemeBuilder.styles.ElementPicker.prototype._mouseOverItem = function (event) {
  var $ = jQuery;
  if (!this.styling) {
    return;
  }
  var element = $(event.currentTarget);
  if (element.is('.tb-no-select') || this.hovershow) {
    return;
  }
  this.hideHoverHighlight();
    
  element.addClass('style-clickable-hover');

  if ($('#the-hover').length > 0) {
    element.append($('#the-hover'));
  }
  else {
    $('<div id="the-hover" class="the-hover tb-no-select"><div class="highlight-inner"></div></div>').appendTo('body');
  }
  // Do not stop this event or hover menus will not work on the styles
  // tab.
};

/**
 * Hides the highlight that appears when hovering over an element.
 */
ThemeBuilder.styles.ElementPicker.prototype._hideHoverHighlight = function () {
  var $ = jQuery;
  $('.style-clickable-hover').removeClass('style-clickable-hover');
};

/**
 * Called when the user exits a user-selectable element with the mouse.
 * This function simply turns off the border and turns on the border
 * for the parent selectable item, if any.
 *
 * @param {Event} event
 *   The click event.
 */
ThemeBuilder.styles.ElementPicker.prototype._clickItem = function (event) {
  var $ = jQuery,
      element,
      $element,
      link,
      settings = ThemeBuilder.getApplicationInstance().getSettings(),
      targetElement = event.currentTarget,
      $target = $(event.currentTarget);

  if (this.hovershow) {
    this.hovershow = false;
    $('#hovertext', parent.document).hide();
    return ThemeBuilder.util.stopEvent(event);
  }
  // If power theming is not enabled, we want to transfer clicks on the #page
  // and #copyright elements to the body.
  if (!settings.powerThemeEnabled()) {
    if ($target.is('#page, #copyright')) {
      $target = $('body');
      targetElement = $('body').get(0);
    }
  }
  if ($target.hasClass('tb-no-select')) {
    return;
  }
  element = this._resolveElement(targetElement);
  $element = $(element);
  // If we've somehow bound this click handler to something that shouldn't be
  // clickable, unbind it. Leave the body element alone, though, since clicks
  // can be transferred to it.
  if (!($element.hasClass('style-clickable') || $element.is('body'))) {
    $element.unbind('mouseover', this.mouseOverItem)
    .unbind('click', this.clickItem);
    return true;
  }

  this.getDomNavigator().highlightClicked($(element));

  this.hideHoverHighlight();

  $('.link-hover', parent.document).remove();

  // Obfuscate link clicks while theming
  link = ($element.is('a')) ? $element : ($element.parent('a').length) ? $element.parent('a') : $();
  this.createHoverLink(event, link);

  if (!Drupal.settings.themebuilderAdvanced) {
    this.path_selector.setElement(element);
    this.selectorSelected(this.path_selector.getCssSelector());
    this.refreshOnEdit();
    return ThemeBuilder.util.stopEvent(event);
  }
  return ThemeBuilder.util.stopEvent(event);
};

/**
 * Causes the editor's state to be reinitialzed when the user mouses into the
 * editor area.  See the _refreshSelection method for more information.
 */
ThemeBuilder.styles.ElementPicker.prototype.refreshOnEdit = function () {
  var $ = jQuery;
  $('#themebuilder-wrapper').unbind('mouseover', this.refreshSelection)
  .bind('mouseover', this.refreshSelection);

};

/**
 * Causes the style editors to refresh.  This is used to ensure the correct
 * initialization values are used for undo.  One case that warranted this
 * behavior is clicking on a link that has a different color when in the hover
 * state.  Because the user is hovering over the link when it is selected, the
 * link's hover state would be used to initialize the style editor rather than
 * the link's normal state.  Clicking on such a link, changing the color, and
 * then clicking Undo would cause the link's normal color to change such that
 * it is the same as the color in the hover state.
 *
 * This event handler is placed on #themebuilder-wrapper in the refreshOnEdit
 * method.  When the user mouses into the editor, the values in the editor are
 * refreshed.  Thus the user is not hovering over the initial selection, so we
 * initialize based on the element's non-hover state.
 *
 * @param {DomEvent} event
 *   The mouseover event.
 */
ThemeBuilder.styles.ElementPicker.prototype._refreshSelection = function (event) {
  var $ = jQuery;
  $('#themebuilder-wrapper').unbind('mouseover', this.refreshSelection);
  this.selectorEditor.pathSettingsModified();
};

/**
 * This method is called when a new element is selected.
 *
 * @param {Selector} selector
 *   The Selector instance that was assigned the new element.
 */
ThemeBuilder.styles.ElementPicker.prototype.selectorElementChanged = function (selector) {
  if (selector && selector.getCssSelector) {
    selector = selector.getCssSelector();
  }
  selector = ThemeBuilder.util.removePseudoClasses(selector);
  this.getDomNavigator().highlightSelection(selector);
};

/**
 * Called when the power theme setting has changed.  This function is
 * responsible for switching between simple navigation mode and power
 * theme mode.  Also the SelectorEditor is hidden if the user switches
 * out of power theme mode.
 *
 * @param {Settings} settings
 *   The settings object that represents the current themebuilder settings.
 */
ThemeBuilder.styles.ElementPicker.prototype.powerThemeSettingChanged = function (settings) {
  var domNavigator;
  if (this._getThemeMarkupVersion() > 1) {
    // Enable the arrows in the navigator in version 2 of the theme markup
    domNavigator = this.getDomNavigator();
    domNavigator.advanced = settings.powerThemeEnabled();
    domNavigator.updateDisplay();
  }
};

/**
 * Called when a link in the page is clicked. This prevents the default action
 * of the link and builds a small DOM component that presents the user with a URL
 * to follow with an extra click.
 *
 * @param {jQuery Obj} link
 *   The link to be obfuscated.
 */
ThemeBuilder.styles.ElementPicker.prototype.createHoverLink = function (event, link) {
  // Just return if no link was passed in.
  if (link.length === 0) {
    return;
  }
  var $ = jQuery;
  event.preventDefault();
  var hover = $('<div>', {
    html: $('<a>', {
      href: link.attr('href'),
      html: Drupal.t('Go to this link')
    }).click(this.followHoverLink)
  }).addClass('link-hover tb-no-select').appendTo($('body', parent.document));
  var off = link.offset();
  var top = 0;//parent.jQuery(parent).scrollTop();

  hover.css({
    top: parseInt(off.top + link[0].offsetHeight + top, 10) + 'px',
    left: parseInt(off.left, 10) + 'px'
  });

  var remove = function () {
    $(parent.document).unbind('click', remove);
    hover.remove();
  };

  $(window.parent.document).click(remove);
};

/**
 * The body has a click event associated with it, so this event's bubbling needs
 * to be stopped before it gets to the body.
 *
 * @param {event} event
 */
ThemeBuilder.styles.ElementPicker.prototype.followHoverLink = function (event) {
  event.stopImmediatePropagation();
};;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The SelectorEditor class is responsible for rendering the user interface
 * devoted to allowing a user to interact with the settings of a Selector
 * instance.
 * @class
 */
ThemeBuilder.styles.SelectorEditor = ThemeBuilder.initClass();

/**
 * The constructor of the SelectorEditor class.
 *
 * @param {Selector} selector
 *   The Selector instance responsible for generating an appropriate
 *   css selector.
 * @param {string} elementSelector
 *   A string containing a css selector that identifies where this instance
 *   of SelectorEditor should render its user interface.  It is probably
 *   best if this is an element id, though that is not required.
 */
ThemeBuilder.styles.SelectorEditor.prototype.initialize = function (selector, elementSelector) {
  this.elementSelector = elementSelector;
  this.parentSelector = elementSelector + ' .path-selector-path';
  this.specificitySelector = elementSelector + ' .path-specificity';
  this.specificityMiddleSection = this.specificitySelector + ' .middle-section';
  this.specificityCenterSelector = this.specificitySelector + ' .panel-center';
  this.specificitySelectorLeft = this.specificitySelector + ' .left';
  this.specificitySelectorRight = this.specificitySelector + ' .right';
  this.veilSelector = elementSelector + ' .path-specificity-cancel';
  this.labelSelector = elementSelector + ' .path-selector-value';
  this.labelSelectorText = elementSelector + ' .path-selector-label-text';
  this.refinementSelector = elementSelector + ' .path-selector-refinement';
  this.disableControlsSelector = elementSelector + ' .disable-controls-veil';
  this.powerThemingToggle = elementSelector + ' .power-theming-label';
  this.powerThemingValue = elementSelector + ' .power-theming-value';
  this.naturalLanguageToggle = elementSelector + ' .natural-language-label';
  this.naturalLanguageValue = elementSelector + ' .natural-language-value';
  this.selector = selector;
  this.nodes = [];
  this.widgets = [];
  this.create();
  this._hasSelection = false;
  this.showSelectorWarning = ThemeBuilder.bind(this, this._showSelectorWarning);
  this.togglePowerTheming = ThemeBuilder.bind(this, this._togglePowerTheming);
  this.toggleNaturalLanguage = ThemeBuilder.bind(this, this._toggleNaturalLanguage);
  
  this._createUI();
  this._initializeUI();
};

/**
 * Creates the user inteface for this SelectorEditor instance.  The UI
 * elements will be added to the appropriate place in the DOM as a result of
 * calling this method.
 *
 * @private
 */
ThemeBuilder.styles.SelectorEditor.prototype._createUI = function () {
  var $ = jQuery;
  var markup = [];
  markup.push('<div class="path-selector-path"></div>');
  markup.push('<div class="path-selector-label"><span class="path-selector-label-text"></span><span class="path-selector-value"></span></div>');
  markup.push('<div class="path-selection-options">');
  markup.push('<div class="power-theming-label">' + Drupal.t('Power theming: ') + '<span class="power-theming-value"></span></div>');
  markup.push('<div class="natural-language-label">' + Drupal.t('Show CSS: ') + '<span class="natural-language-value"></span></div>');
  markup.push('</div>'); // .path-selection-options
  $(this.elementSelector).append(markup.join(''));
  
  $(this.elementSelector).append(this._createSpecificityPanel());
  markup = [];
  markup.push('<div class="path-specificity-cancel"></div>');
  markup.push('<div class="disable-controls-veil"></div');
  $(this.elementSelector).append(markup.join(''));
  
  // Set up a horizontal carousel.
  this.pathSelector = this._createWidget('.path-selector-path', 'PathSelector', 'HorizontalCarousel');
  this.pathSelector.hide(); // The widget is hidden until the user selected an element
};

/**
 * Creates the markup of the specificity panel.  This panel is a box that
 * appears to drop down as a result of clicking the arrow icon in any
 * editor node instance that has one.
 *
 * @return
 *   A jQuery object representing the specificity panel.
 */
ThemeBuilder.styles.SelectorEditor.prototype._createSpecificityPanel = function () {
  var $ = jQuery;
  var topSection = $('<div class="top-section">')
  .append('<div class="top-left">')
  .append('<div class="top">')
  .append('<div class="top-right">');

  var middleSection = $('<div class="middle-section">')
  .append('<div class="left">')
  .append('<div class="panel-center clearfix">')
  .append('<div class="right">');

  var bottomSection = $('<div class="bottom-section">')
  .append('<div class="bottom-left">')
  .append('<div class="bottom">')
  .append('<div class="bottom-right">');

  return $('<div class="path-specificity">')
  .append(topSection)
  .append(middleSection)
  .append(bottomSection);
};

/**
 * Initializes the user interface for this SelectorEditor instance.  The
 * appropriate listeners and click handlers will be attached as a result of
 * calling this method.
 *
 * @private
 */
ThemeBuilder.styles.SelectorEditor.prototype._initializeUI = function () {
  var $ = jQuery;
  this.selector.addSelectorListener(this);
  // Listen for tab switches.
  ThemeBuilder.Bar.getInstance().addBarListener(this);
  this._changeSelectorText(this.selector);
  $(this.disableControlsSelector).click(this.showSelectorWarning);
  this.refreshPowerThemingToggle();
  $(this.powerThemingToggle).click(this.togglePowerTheming);
  this.refreshNaturalLanguageToggle();
  $(this.naturalLanguageToggle).click(this.toggleNaturalLanguage);
  var settings = ThemeBuilder.getApplicationInstance().getSettings();
  settings.addSettingsChangeListener(this);
};

/**
 * This method is called when a new element is selected.  This refreshes
 * the set of editor nodes used to display and configure the css selector.
 *
 * @param {Selector} selector
 *   The Selector instance that was assigned the new element.
 */
ThemeBuilder.styles.SelectorEditor.prototype.selectorElementChanged = function (selector) {
  var settings = ThemeBuilder.getApplicationInstance().getSettings();
  var enabled = settings.powerThemeEnabled();
  this.destroy();
  this.create();
  this._changeSelectorText(selector);
  if (this.widgets.PathSelector) {
    this.widgets.PathSelector.updateUI();
  }
  if (enabled) {
    this.pathSelector.show();
  }
};

/**
 * Called when the selector changed.  This happens when the settings on any
 * part of the selector has changed, but not when a new element was set.
 *
 * @param {Selector} selector
 *   The Selector instance.
 */
ThemeBuilder.styles.SelectorEditor.prototype.selectorChanged = function (selector) {
  this.refresh();
  this._changeSelectorText(selector);
  if (this.widgets.PathSelector) {
    this.widgets.PathSelector.updateUI();
  }
};

/**
 * Reset returns the Style tab back to its original load state.  It is called
 * when the user switches tabs in the theme Builder.
 */
ThemeBuilder.styles.SelectorEditor.prototype.reset = function () {
  if (this._hasSelection) {
    var $ = jQuery;
    this.destroy();
    $('#themebuilder-wrapper').removeClass('tall');
    this.clearSelectorText();
    this._hasSelection = false;
  }
};

/**
 * Causes all of the node editors to be destroyed.  This is important
 * to do when the selector changes.
 */
ThemeBuilder.styles.SelectorEditor.prototype.destroy = function () {
  var len = this.nodes.length;
  while (len--) {
    this.nodes[len].destroy();
  }
};

/**
 * Changes the text that offers a human readable version of the currently
 * configured css selector.
 *
 * @param {Selector} selector
 *   The Selector instance; optional. Defaults to a blank Selector object.
 */
ThemeBuilder.styles.SelectorEditor.prototype._changeSelectorText = function (selector) {
  if (!selector) {
    selector = new ThemeBuilder.styles.Selector();
  }
  var $ = jQuery;
  var settings = ThemeBuilder.getApplicationInstance().getSettings();
  var naturalLanguageEnabled = settings.naturalLanguageEnabled();

  if (naturalLanguageEnabled === true) {
    var selectorText = selector.getHumanReadableSelector();
  }
  else {
    selectorText = selector.getCssSelector();
    // For raw selector text, insert some additional whitespace to make the
    // separations within the selector more clear.
    selectorText = selectorText.replace(/ /g, '<span class="path-selector-value-space"> </span>');
  }
  var labelText = Drupal.t('You are styling: ');
  if (!selectorText || selectorText.length === 0) {
    selectorText = Drupal.t('Please select an element to style.');
    labelText = '';
    this.disableStyles();
    $(this.refinementSelector).hide();
  }
  else {
    this.enableStyles();
    $(this.refinementSelector).show();
    $('#themebuilder-wrapper').addClass('tall');
  }
  $(this.labelSelector).html(selectorText);
  $(this.labelSelectorText).text(labelText);
  this._refreshRefinementText();
};

ThemeBuilder.styles.SelectorEditor.prototype.clearSelectorText = function () {
  this._changeSelectorText();
};

/**
 * Sets the default visibility for the element selector.  This method uses
 * the Application init data to determine whether the selector widget should
 * be displayed or not.
 *
 * @param {Object} data
 *   The application initialization data.
 */
ThemeBuilder.styles.SelectorEditor.prototype._setDefaultElementSelectorVisibility = function (data) {
  this.showElementSelector = (data.show_element_selector === true);
  if (this.showElementSelector !== true) {
    var $ = jQuery;
    this.pathSelector.hide();
  }
};

/**
 * Toggles power theming mode.  This causes the user interface to refresh so
 * the elements pertinent to the newly selected mode are available.
 */
ThemeBuilder.styles.SelectorEditor.prototype._togglePowerTheming = function () {
  var settings = ThemeBuilder.getApplicationInstance().getSettings();
  var enabled = settings.powerThemeEnabled();
  settings.setPowerThemeEnabled(!enabled);
};

/**
 * Refreshes the elements that comprise the power theming toggle.  This
 * includes the text that indicates the current state of the toggle as well as
 * the tooltip that describes what happens if the toggle state is changed.
 */
ThemeBuilder.styles.SelectorEditor.prototype.refreshPowerThemingToggle = function () {
  var $ = jQuery;
  var settings = ThemeBuilder.getApplicationInstance().getSettings();
  var enabled = settings.powerThemeEnabled();
  var text = Drupal.t('off');
  if (enabled === true) {
    text = Drupal.t('on');
  }
  $(this.powerThemingValue).text(text);
  $(this.powerThemingToggle).attr('title', enabled ? Drupal.t('Get me out of here!') : Drupal.t('Expose all theme elements and broaden or narrow how your styling is applied.'));
};

/**
 * Called when the power theme setting has been changed.  This method is
 * responsible for showing and hiding the refinement as appropriate for the
 * current setting.
 *
 * @param {Settings} settings
 *   The themebuilder settings.
 */
ThemeBuilder.styles.SelectorEditor.prototype.powerThemeSettingChanged = function (settings) {
  this.refreshPowerThemingToggle();
  var isPowerThemeEnabled = settings.powerThemeEnabled();
  this._showRefinement(isPowerThemeEnabled);
  if (this.widgets.PathSelector && isPowerThemeEnabled) {
    this.widgets.PathSelector.updateUI();
  }
};

/**
 * Toggles natural language mode.  This causes the user interface to refresh
 * so the elements pertinent to the newly selected mode are available.
 */
ThemeBuilder.styles.SelectorEditor.prototype._toggleNaturalLanguage = function () {
  var settings = ThemeBuilder.getApplicationInstance().getSettings();
  var enabled = settings.naturalLanguageEnabled();
  settings.setNaturalLanguageEnabled(!enabled);
};

/**
 * Refreshes the elements that comprise the natural language toggle.  This
 * includes the text that indicates the current state of the toggle as well as
 * the tooltip that describes what happens if the toggle state is changed.
 */
ThemeBuilder.styles.SelectorEditor.prototype.refreshNaturalLanguageToggle = function () {
  var $ = jQuery;
  var settings = ThemeBuilder.getApplicationInstance().getSettings();
  var enabled = settings.naturalLanguageEnabled();
  var text = Drupal.t('on');
  if (enabled === true) {
    text = Drupal.t('off');
  }
  $(this.naturalLanguageValue).text(text);
  $(this.naturalLanguageToggle).attr('title', enabled ? Drupal.t('Show css selectors.') : Drupal.t('Show css selectors in natural language.'));
};

/**
 * Called when the natural language setting has been changed.  This method is
 * responsible for refreshing the display of all such text within the
 * SelectorEditor as appropriate for the current setting.
 *
 * @param {Settings} settings
 *   The themebuilder settings.
 */
ThemeBuilder.styles.SelectorEditor.prototype.naturalLanguageSettingChanged = function (settings) {
  this.refreshNaturalLanguageToggle();
  this.selectorElementChanged(this.selector);
};

/**
 * Toggles the element selector visibility.
 */
ThemeBuilder.styles.SelectorEditor.prototype._toggleRefinement = function () {
  this.showElementSelector = !this.showElementSelector;
  ThemeBuilder.postBack(Drupal.settings.themebuilderSelectorVisibility, {visibility: this.showElementSelector});
  this._showRefinement(this.showElementSelector);
};

/**
 * Shows and hides the refinement depending on the state of the specified parameter.
 *
 * @param {boolean} show
 *   If true, the refinement controls will be displayed; otherwise the
 *   controls will be hidden.
 */
ThemeBuilder.styles.SelectorEditor.prototype._showRefinement = function (show) {
  if (show === undefined) {
    var settings = ThemeBuilder.getApplicationInstance().getSettings();
    show = settings.powerThemeEnabled();
  }
  var $ = jQuery;
  if (show === true) {
    this.pathSelector.show();
    $('#themebuilder-wrapper').addClass('tall');
  }
  else {
    this.pathSelector.hide();
    $('#themebuilder-wrapper').removeClass('tall');
  }
  this._refreshRefinementText();
};

/**
 * Called when the refinement panel is completely displayed (called after the
 * animation.
 */
ThemeBuilder.styles.SelectorEditor.prototype._showRefinementAnimationComplete = function () {
  // On some browsers, including Chrome and Safari the layout is incorrect
  // after this animation, particularly when the selector is long enough to
  // wrap.  Fix the layout by forcing the selector to change which causes the
  // browser to refresh the layout of the page.
  this.selectorChanged(this.selector);
};

/**
 * Refreshes the display of the refinement text.  The text changes based
 * on the visibility of the element selector.
 */
ThemeBuilder.styles.SelectorEditor.prototype._refreshRefinementText = function () {
  var $ = jQuery;
  var refinementString = this.showRefinementString;
  if (this.showElementSelector === true) {
    refinementString = this.hideRefinementString;
  }
  $(this.refinementSelector).text(refinementString);
};

/**
 * Called when the user causes any of the path settings to be modified.  This
 * function causes the rendering of the selector editor to be refreshed.
 */
ThemeBuilder.styles.SelectorEditor.prototype.pathSettingsModified = function () {
  if (!this.selector.path) {
    return;
  }
  var len = this.selector.path.length;
  // Update the UI elements
  this.selector.pathElementSettingsChanged();
  if (len !== this.selector.path.length) {
    // The modification caused the path to change.  Recreate the selector.
    this.destroy();
    this.create();
    if (this.editor) {
      this._changeSelectorText(this.editor.selector);
    }
  }
};

/**
 * Causes the set of SelectorNode instances associated with this
 * editor to be created.  As a result of calling this method the
 * relevant nodes are created and attached to the user interface.
 */
ThemeBuilder.styles.SelectorEditor.prototype.create = function () {
  var $ = jQuery;
  var parentElement = $(this.parentSelector)[0];
  this._hasSelection = true;

  var path = this.selector.path;
  if (path && path.length > 0) {
    for (var i = 0; i < path.length; i++) {
      this.nodes[i] = new ThemeBuilder.styles.SelectorNode(this, i, path[i], (i === path.length - 1));
      this.nodes[i].create(parentElement);
    }
  }
};

/**
 * Causes each node editor to refresh itself.  This is done when the element
 * changes and when the user changes the specificity or changes the set
 * of nodes that are enabled.
 */
ThemeBuilder.styles.SelectorEditor.prototype.refresh = function () {
  var len = this.nodes.length;
  while (len--) {
    this.nodes[len].refresh();
  }
};

/**
 * This should only be called when no element has been selected.
 * It causes a status message to appear, further prompting the user on
 * how to use the style editor.
 *
 * @param {Event} event
 *   The event associated with the user action that caused this method to
 *   be called.  The event parameter is not used.
 */
ThemeBuilder.styles.SelectorEditor.prototype._showSelectorWarning = function (event) {
  ThemeBuilder.Bar.getInstance().setStatus(Drupal.t('Select an element first by clicking above.'), 'info');
};

/**
 * Causes the style controls in the style editor to be disabled.  This is
 * used to block the user's ability to interact with style settings in the
 * themebuilder while there is no element selected.
 */
ThemeBuilder.styles.SelectorEditor.prototype.disableStyles = function () {
  var $ = jQuery;
  $(this.disableControlsSelector)
  .addClass('show');
  this.pathSelector.hide();
};

/**
 * Causes the style controls in the style editor to be enabled.  This
 * removes the veil used to block the user's access to the
 * themebuilder style settings.  After an element is selected, this
 * method should be called to allow the user to theme the selected
 * element.
 */
ThemeBuilder.styles.SelectorEditor.prototype.enableStyles = function () {
  var $ = jQuery;
  $(this.disableControlsSelector)
  .removeClass('show');
  this._showRefinement();
};


/**
 * React to the user changing tabs within Themebuilder.
 *
 * @param {Object} tab
 *   The object that manages the tab (such as ThemeBuilder.styleEditor).
 */
ThemeBuilder.styles.SelectorEditor.prototype.handleTabSwitch = function (tab) {
  if (tab) {
    if (!tab.currentTab || tab.currentTab !== 'font') {
      this.reset();
    }
  }
};

/**
 * Creates a standard widget
 *
 * @param {String} selector
 *   The CSS selector for the element that will be rendered as a widget.
 *   This takes a singular element at the moment, but could be extended to support
 *   multiple objects that match the selector
 * @param {String} [optional] identifier
 *   A string to identify the widget in the widgets array
 * @param {String} [optional] type
 *   The type of widget that should be rendered
 * @return
 *   A jQuery object referencing the widget in the DOM.
 */
ThemeBuilder.styles.SelectorEditor.prototype._createWidget = function (selector, identifier, type) {
  var $ = jQuery;
  var element = $(selector);
  
  if (type) {
    switch (type) {
    case 'HorizontalCarousel':
      var widget = new ThemeBuilder.ui.HorizontalCarousel(element);
      // If an identifier for this widget was provided, store it under that identifier
      // Otherwise just shove it into the widgets array
      if (identifier) {
        this.widgets[identifier] = widget;
      } else {
        this.widgets.push(widget); 
      }
      return widget.getPointer();
    case 'HorizontalSlider':
      // Placeholder for future widgets
      break;
    default:
      break;
    }
  }
  
  // If an identifier for this widget was provided, store it under that identifier
  // Otherwise just shove it into the widgets array
  if (identifier) {
    this.widgets[identifier] = widget;
  } else {
    this.widgets.push(widget); 
  }
  
  if (!element.updateUI) { // A temporary fix for the fact that non UI components do not have an updateUI() method
    /**
     * @ignore
     */
    element.updateUI = function () {
      return false; 
    };
  }
  
  return element;
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The SelectorNode object represents the visual display of part
 * of a css selector.  The user can interact with each node, toggling
 * it on or off to enable or disable that part of the css selector,
 * and change the specificity for nodes representing html elements
 * that have multiple specificity options, such as tag, id, and
 * classes.
 * @class
 */
ThemeBuilder.styles.SelectorNode = ThemeBuilder.initClass();

/**
 * The constructor for the SelectorNode class.
 *
 * @param {SelectorEditor} editor
 *   The SelectorEditor instance that caused this object to be
 *   instantiated.
 * @param {int} index
 *   The index within the Selector corresponding to this editor node.
 * @param {PathElement} pathElement
 *   The PathElement instance this object should manipulate as the
 *   user interacts with it.
 * @param {boolean} isLast
 *   Indicates whether this is instance corresponds to the last item
 *   in the path.  This flag is used to manipulate the style of the
 *   editor node.
 */
ThemeBuilder.styles.SelectorNode.prototype.initialize = function (editor, index, pathElement, isLast) {
  this.editor = editor;
  this.id = 'path-element-' + index;
  this.pathElement = pathElement;
  this.toggleNode = ThemeBuilder.bind(this, this._toggleNode);
  this.specificityOptionsVisible = false;
  
  this.toggleSpecificityOptions = ThemeBuilder.bind(this, this._toggleSpecificityOptions);
  this.showSpecificityOptions = ThemeBuilder.bind(this, this._showSpecificityOptions);
  this.selectSpecificity = ThemeBuilder.bind(this, this._selectSpecificity);
  this.cancelSpecificity = ThemeBuilder.bind(this, this._cancelSpecificity);

  this.isFirst = (index === 0);
  this.isLast = isLast;
};

/**
 * Causes the markup representing this editor node to be generated and
 * added to the DOM.
 *
 * @param {DomElement} element
 *   The DomElement within which this editor markup should be placed.
 */
ThemeBuilder.styles.SelectorNode.prototype.create = function (element) {
  var $ = jQuery;
  var body = $('<div id="' + this.id + '" class="path-element' +
           (this.isFirst ? ' first' : '') +
           (this.isLast ? ' last' : '') +
    '">');
  //.append('<div class="path-element-left"></div>');
  var middle = $('<div class="path-element-inner">');
  var options = this.pathElement.getSpecificityOptions();

  if (options.identification.length + options.pseudoclass.length > 1) {
    // We need a pulldown list for this element.
    var pulldown = $('<div class="path-element-pulldown-button">')
    .click(ThemeBuilder.bind(this, this.toggleSpecificityOptions));
    middle.append(pulldown);
  }
  middle.append('<div class="path-element-label"></div>');
  body.append(middle);
  //.append('<div class="path-element-right">' + (this.isLast ? '' : '<div class="path-element-expand"></div>') + '</div>');
  $(element).append(body);
  body.click(this.toggleNode);
  this.refresh();
};

/**
 * Causes the markup for this editor to be removed from the DOM.
 */
ThemeBuilder.styles.SelectorNode.prototype.destroy = function () {
  var $ = jQuery;
  var body = $('#' + this.id);
  if (body) {
    body.unbind('click', this.onClick)
      .remove();
  }
};

/**
 *  Refreshes the display of this editor.  This should be called when
 *  the corresponding node is enabled or disabled and when a different
 *  specificity is selected.
 */
ThemeBuilder.styles.SelectorNode.prototype.refresh = function () {
  var $ = jQuery;
  var body = $('#' + this.id);
  if (body) {
    if (this.pathElement.enabled === true) {
      body.removeClass('disabled')
        .attr({title: Drupal.t('Click to broaden your styling')})
        .find('.path-element-pulldown-button').css({display: 'inline-block'});
    }
    else {
      body.addClass('disabled')
        .attr({title: Drupal.t('Click to narrow your styling')})
        .find('.path-element-pulldown-button').css({display: 'none'});
    }
    var settings = ThemeBuilder.getApplicationInstance().getSettings();
    var naturalLanguageEnabled = settings.naturalLanguageEnabled();
    if (naturalLanguageEnabled === true) {
      var text = ThemeBuilder.util.capitalize(this.pathElement.getHumanReadableLabelFromSelector(this.pathElement.getCssSelector()));
    }
    else {
      text = this.pathElement.getCssSelector();
    }
    $('#' + this.id + ' .path-element-label')
      .text(text);
  }
};

/**
 * This callback method is used to toggle this node instance on and
 * off.
 *
 * @param {Event} event
 *   The event.
 */
ThemeBuilder.styles.SelectorNode.prototype._toggleNode = function (event) {
  if (this.editor.selector.path.length === 1) {
    // Do not allow the only node to be toggled.
    return false;
  }
  this.pathElement.setEnabled(!this.pathElement.enabled);
  this.editor.pathSettingsModified();
  return false;
};

/**
 * Determines if the specificity panel should be shown or hidden when the dropdown trigger is clicked
 *
 * @param {Event} event
 *   The event.
 */
ThemeBuilder.styles.SelectorNode.prototype._toggleSpecificityOptions = function (event) {
  event.stopImmediatePropagation(); // Prevents the puck from being deselected.
  
  if (!this.specificityOptionsVisible) {
    this.showSpecificityOptions(event);
  } else {
    this.cancelSpecificity(event);
  }
};

/**
 * This callback is used to display the dropdown containing
 * specificity options associated with this node.  While the dropdown
 * is displayed, the user will not be able to interact with anything
 * but the specificity panel.  Clicks outside of this panel will cause
 * the panel to be dismissed.
 *
 * @param {Event} event
 *   The event.
 */
ThemeBuilder.styles.SelectorNode.prototype._showSpecificityOptions = function (event) {
  var $ = jQuery;
  var veil = $(this.editor.veilSelector)
    .removeClass('show')
    .unbind('click');
  var dropdown = $(this.editor.specificitySelector)
  .removeClass('show');
  var dropdownCenter = $(this.editor.specificityCenterSelector)
  .unbind('click')
  .html('');
  var options = this.pathElement.getSpecificityOptions();
  if (options.identification.length + options.pseudoclass.length > 1) {
    var $panel = $('<div>');
    $panel.append(this._getSpecificityPanel(options, 'identification').click(this.selectSpecificity));
    $panel.append(this._getSpecificityPanel(options, 'pseudoclass').click(this.selectSpecificity));
    dropdownCenter.append($panel);
    veil.attr('style', 'width: ' + $(document).width() + 'px; ' +
      'height: ' + $(document).height() + 'px;')
      .click(this.cancelSpecificity)
      .addClass('show');
    // Position the panel so it makes sense to the user.
    var pos = $(event.currentTarget).position();

    $('#' + this.id + ' .path-element-pulldown-button')
    .addClass('open');
    
    dropdown.addClass('show'); // Show must be called before positioning or the dropdown won't have a size yet
    
    this.specificityOptionsVisible = true;
    
    // A function to position the specificity panel inside the document.width and prevent collisions with it
    var dropdownPos = this._positionSpecificityOptions(pos.left, pos.top);
    
    // Position the dropdown
    dropdown
    .css('left', (dropdownPos.left))
    .css('top', (dropdownPos.top));
  }
  return false;
};

/**
 * Creates a specificity selection panel for the specified options of the
 * specified type.
 *
 * @param {Array} options
 *   An array of objects that contain the specificity options that should be
 *   included in the panel.
 *
 * @param {String} type
 *   Either 'identification' or 'pseudoclass', depending on which panel needs
 *   to be created.  The 'identification' panel allows selection of the
 *   element's id, tag, or any of its classes.  'pseudoclass' allows selection
 *   of any of the available pseudoclasses.
 *
 * @return
 *   A jQuery object representing the newly created panel.
 */
ThemeBuilder.styles.SelectorNode.prototype._getSpecificityPanel = function (options, type) {
  var $ = jQuery;
  var $panel = $('<div class="tb-type-' + type + '">');
  for (var i = 0; i < options[type].length; i++) {
    var classes = 'option';
    if (i === 0) {
      classes += ' first';
    }
    if (i === options[type].length - 1) {
      classes += ' last';
    }
    if (options[type][i].selected === true) {
      classes += ' selected';
    }

    var labelText = options[type][i].name;
    $panel.append('<div class="' + classes + '"><span/>' +
      labelText + '</div>');
  }
  return $panel;
};

/**
 * This callback is invoked when the user selects a specificity within
 * the dropdown box.  This causes the corresponding specifitity to be
 * selected and the dropdown box is dismissed.
 *
 * @param {Event} event
 *   The event.
 */
ThemeBuilder.styles.SelectorNode.prototype._selectSpecificity = function (event) {
  var $ = jQuery;
  var originalTarget = event.srcElement || event.originalTarget || event.target;
  var type = 'identification';
  var $target = $(originalTarget);
  if ($target.parent().hasClass('tb-type-pseudoclass')) {
    type = 'pseudoclass';
  }
  for (var i = 0; i < event.currentTarget.childNodes.length; i++) {
    if (originalTarget === event.currentTarget.childNodes[i]) {
      this.pathElement.setSpecificity(type, i);
      this.editor.pathSettingsModified();
      break;
    }
  }
  return this.cancelSpecificity(event);
};

/**
 * This callback is invoked when the user clicks outside of the
 * specificity dropdown box when the box is being displayed.  This
 * action effectively dismisses the specificity box with no change to
 * the specificity of the corresponding node.
 *
 * @param {Event} event
 *   The event.
 */
ThemeBuilder.styles.SelectorNode.prototype._cancelSpecificity = function (event) {
  var $ = jQuery;
  $(this.editor.specificitySelector)
  .removeClass('show')
  .unbind('click');
  $(this.editor.veilSelector)
    .removeClass('show')
    .unbind('click');
  $('#' + this.id + ' .path-element-pulldown-button')
  .removeClass('open');
  this.specificityOptionsVisible = false;
  return false;
};

/**
 * Provides window edge detection for the Specificity Options Pulldown
 * 
 * @param {Number} posLeft
 *   Original left position of the dropdown before repositioning
 *
 * @param {Number} posTop
 *   Original top position of the dropdown before repositioning. Not really used at the moment except
 *   as a simple pass through.
 */
 
ThemeBuilder.styles.SelectorNode.prototype._positionSpecificityOptions = function (posLeft, posTop) {
  
  var $ = jQuery;
  ThemeBuilder.bind(this, ThemeBuilder.styles.SelectorEditor); // Get the editor.
  var contentPos = {left: 0, top: 0};
  var pos = {}; // The position for the dropdown that will be calculated.
  
  // If we're using a widget, the positioning is more complicated because the pucks could
  // could be shifted left relative to its initial rendered origin.
  if (this.editor && this.editor.widgets && this.editor.widgets.PathSelector) {
    var contentPosObj = this.editor.widgets.PathSelector.getContentPos();
    contentPos.left = contentPosObj.left;
    contentPos.top = contentPosObj.top; 
  }
  
  var docWidth = document.width;
  var dropdown = $(this.editor.specificitySelector);
  var dropdownCenter = $(this.editor.specificityCenterSelector);
  
  // Get the width of the options lists because the option lists will wrap
  // if the options pulldown hits the edge of the document.
  // We need to get the width of each object and add them together to know what the width
  // would have been if the lists hadn't wrapped.
  
  // Get the width of the option lists individually
  var typeIdWidth = dropdownCenter.find('.tb-type-identification').outerWidth();
  var typePseudoWidth = dropdownCenter.find('.tb-type-pseudoclass').outerWidth();
  
  // Get the width of the images to the left and right of the pulldown
  var dropdownLeftWidth = $(this.editor.specificitySelectorLeft).outerWidth();
  var dropdownRightWidth = $(this.editor.specificitySelectorRight).outerWidth();
  
  //
  var realWidth = typeIdWidth + typePseudoWidth + dropdownLeftWidth + dropdownRightWidth;
  var realSpace = realWidth + posLeft + contentPos.left;
  
  if (realSpace > docWidth) {
    pos.left = docWidth - realWidth - 20;
  } else {
    pos.left = posLeft + contentPos.left;
  }
  
  pos.top = posTop + 14;
  
  return pos;
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true */

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The SimpleNavigator isn't really a navigator at all.  It is the original
 * highlight mechanism we used to employ to show the user which element(s)
 * would be affected by their changes.  This has been abstracted out of the
 * ElementPicker so we could implement other more interesting strategies and
 * bind the strategy to the version of theme that it was meant to work with.
 * @class
 */
ThemeBuilder.styles.SimpleNavigator = ThemeBuilder.initClass();
ThemeBuilder.styles.SimpleNavigator.prototype.initialize = function () {
  this.highlighter = ThemeBuilder.styles.Stylesheet.getInstance('highlighter.css');
  this.advanced = false;
};

/**
 * Causes the element(s) identified by the specified selector to be highlighted.
 *
 * @param {String} selector
 *   The selector that describes the set of selected elements.
 */
ThemeBuilder.styles.SimpleNavigator.prototype.highlightSelection = function (selector) {
  this.unhighlightSelection();
  if (selector) {
    this.highlighter.setRule(selector, 'background', 'rgba(0, 0, 255, 0.2) !important');
  }
};

/**
 * Causes the entire navigator to be removed from the dom.
 */
ThemeBuilder.styles.SimpleNavigator.prototype.deleteNavigator = function () {
  this.unhighlightSelection();
};

/**
 * Remove the highlight from the elements identified by the current selector.
 */
ThemeBuilder.styles.SimpleNavigator.prototype.unhighlightSelection = function () {
  this.highlighter.clear();
};

/**
 * Highlight the selected element.  This method is provided for more
 * sophisticated navigators that allow the user to move through the DOM.
 *
 * @param {jQuery element} $element
 *   The selected element.
 */
ThemeBuilder.styles.SimpleNavigator.prototype.highlightClicked = function ($element) {
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true */

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The PowerNavigator allows the user to traverse through the DOM by
 * clicking on arrows on each side of a box that surrounds the selected
 * element.  This has been abstracted out of the ElementPicker class so we
 * could implement multiple strategies for selected element highlight and DOM
 * navigation, and bind the strategy to the version of the theme it was meant
 * to work with.
 * @class
 */
ThemeBuilder.styles.PowerNavigator = ThemeBuilder.initClass();
ThemeBuilder.styles.PowerNavigator.prototype.initialize = function () {
  this.arrowClicked = ThemeBuilder.bind(this, this._arrowClicked);
  this.selected = null;
  this.advanced = false;

  // Add the Power navigator markup
  var $ = jQuery;
  this.left = $('<div class="tb-nav tb-no-select"></div>').append('<div class="arrow  tb-no-select" title="Select the previous sibling element"></div>').addClass('left').appendTo('body');
  this.right = $('<div class="tb-nav tb-no-select"></div>').append('<div class="arrow  tb-no-select" title="Select the next sibling element"></div>').addClass('right').appendTo('body');
  this.top = $('<div class="tb-nav tb-no-select"></div>').append('<div class="arrow  tb-no-select" title="Select the parent element"></div>').addClass('top').appendTo('body');
  this.bottom = $('<div class="tb-nav tb-no-select"></div>').append('<div class="arrow  tb-no-select" title="Select the first child element"></div>').addClass('bottom').appendTo('body');
  $('.arrow').bind('click', this.arrowClicked);
};

/**
 * Causes the element(s) identified by the specified selector to be highlighted.
 *
 * @param {String} selector
 *   The selector that describes the set of selected elements.
 */
ThemeBuilder.styles.PowerNavigator.prototype.highlightSelection = function (selector) {
  var $ = jQuery;
  this.unhighlightSelection();
  if (!selector) { // If the highlighted element does not match the element selector, hide the Navigator arrows
    $('.tb-nav, .tb-hover').hide();
    return;
  }
  if (selector) {
    selector = ThemeBuilder.util.removeStatePseudoClasses(selector);
    
    // Wrap matching, non-selected elements in a secondary highlight.
    $(selector).not('.selected, .selected *, .tb-no-select').addClass('selection').append('<div class="selection-highlight tb-no-select"><div class="highlight-inner"></div></div>');

    if ($(selector).is('.selected')) {
      $('.tb-nav').show();
      $('.link-hover').show();
    } else {
      $('.tb-nav').hide();
      $('.link-hover').hide();
    }
  }
};

/**
 * Causes the entire navigator to be removed from the dom.
 */
ThemeBuilder.styles.PowerNavigator.prototype.deleteNavigator = function () {
  var $ = jQuery;
  this.unhighlightSelection();
  this.remove();
};

/**
 * Remove the highlight from the elements identified by the current selector.
 */
ThemeBuilder.styles.PowerNavigator.prototype.unhighlightSelection = function () {
  var $ = jQuery;
  $('.selection').removeClass('selection');
  $('.selection-highlight').remove();
};

/**
 * Highlight the selected element itself and add the controls for moving
 * around the DOM.
 *
 * @param {jQuery element} $element
 *   The selected element.
 */
ThemeBuilder.styles.PowerNavigator.prototype.highlightClicked = function ($element) {
  var $ = jQuery;

  $('.selected').removeClass('selected');
  $('.tb-inset').removeClass('tb-inset');

  if ($element) {
    this.selected = $element;
    $element.addClass('selected');
  }
  this.updateDisplay();
};

/**
 * Called when one of the navigator arrows is clicked.
 *
 * @private
 *
 * @param {Event} event
 *   The click event.
 */
ThemeBuilder.styles.PowerNavigator.prototype._arrowClicked = function (event) {
  var $ = jQuery;
  event.stopPropagation();
  event.preventDefault();
  var direction = this._getDirection($(event.currentTarget));

  switch (direction) {
  case 'up':
    this.selected.parent().closest('.style-clickable:visible').click();
    break;
  case 'down':
    this.selected.find('.style-clickable:visible').first().click();
    break;
  case 'right':
    if (this.selected.next('.style-clickable:visible').length > 0) {
      this.selected.next('.style-clickable:visible').click();
    } else {
      this.selected.nextUntil('.style-clickable:visible').next('.style-clickable:visible').click();
    }
    break;
  case 'left':
    if (this.selected.prev('.style-clickable:visible').length > 0) {
      this.selected.prev('.style-clickable:visible').click();
    } else {
      this.selected.prevUntil('.style-clickable:visible').prev('.style-clickable:visible').click();
    }
    break;
  }
};

/**
 * Returns a string the identifies the direction that the user clicked.
 *
 * @private
 *
 * @param {jQuery element} $currentTarget
 *   The element representing the arrow the user clicked on.
 *
 * @return
 *   A string indicating the direction within the DOM the user would like to
 *   navigate to.  It will be one of 'up', 'down', 'left' or 'right'.
 */
ThemeBuilder.styles.PowerNavigator.prototype._getDirection = function ($currentTarget) {
  var direction = 'up';
  var $ = jQuery;
  if ($currentTarget.is('.top .arrow')) {
    direction = 'up';
  } 
  else if ($currentTarget.is('.bottom .arrow')) {
    direction = 'down';
  } 
  else if ($currentTarget.is('.right .arrow')) {
    direction = 'right';
  } 
  else if ($currentTarget.is('.left .arrow')) {
    direction = 'left';
  }
  return direction;
};

ThemeBuilder.styles.PowerNavigator.prototype.updateDisplay = function () {
  var $ = jQuery;

  if (!this.selected) {
    return;
  }
  var selectedOffset = this.selected.offset();
  selectedOffset.height = this.selected.outerHeight(false);
  selectedOffset.width = this.selected.outerWidth(false);

  if (selectedOffset.height === 0) {
    var next = this.selected.children('.style-clickable:visible').first();
    while (selectedOffset.height === 0) {
      var prev = selectedOffset.height;
      selectedOffset.height = $(next).outerHeight(false);
      next = $(next).children('.style-clickable:visible').first();
    }
  }
  if (this.selected.is('.deco-bottom') && this.selected.outerHeight(false) === 0) {
    selectedOffset.top = selectedOffset.top - selectedOffset.height;
  }

  selectedOffset.right = selectedOffset.left + selectedOffset.width;
  selectedOffset.bottom = selectedOffset.top + selectedOffset.height;

  var pageWidth = $('body').width();
  var pageHeight = $('body').height();

  if (selectedOffset.right >= pageWidth - 4) {
    selectedOffset.right = selectedOffset.right - 4;
    this.right.addClass('tb-inset');
  }
  if (selectedOffset.bottom + 292 > pageHeight - 2) {
    selectedOffset.bottom = selectedOffset.bottom - 2;
  }
  if (selectedOffset.left === 0) {
    selectedOffset.left = 4;
    this.left.addClass('tb-inset');
  }
  if (selectedOffset.width >= pageWidth) {
    selectedOffset.width = selectedOffset.width - 8;
  }

  if (selectedOffset.top <= 40) {
    selectedOffset.top = selectedOffset.top + 8;
  }

  this.top.css({'top' : selectedOffset.top, 'left' : selectedOffset.left, 'width' : selectedOffset.width});
  this.right.css({'top' : selectedOffset.top, 'left' : selectedOffset.right, 'height' : selectedOffset.height});
  this.bottom.css({'top' : selectedOffset.bottom, 'left' : selectedOffset.left, 'width' : selectedOffset.width});
  this.left.css({'top' : selectedOffset.top, 'left' : selectedOffset.left, 'height' : selectedOffset.height});

  $('.tb-nav-enabled').removeClass('tb-nav-enabled');
  if (this.advanced) {
    if (this.selected.parent().closest('.style-clickable:visible').length > 0) {
      this.top.addClass('tb-nav-enabled');
    }
    if (this.selected.find('.style-clickable:visible').length > 0) {
      this.bottom.addClass('tb-nav-enabled');
    }
    if (this.selected.nextUntil('.style-clickable:visible').next('.style-clickable:visible').length > 0 || this.selected.next('.style-clickable:visible').length > 0) {
      this.right.addClass('tb-nav-enabled');
    }
    if (this.selected.prevUntil('.style-clickable:visible').prev('.style-clickable:visible').length > 0 || this.selected.prev('.style-clickable:visible').length > 0) {
      this.left.addClass('tb-nav-enabled');
    }
  }
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styleEditor = ThemeBuilder.styleEditor || {};

/**
 * Make a string into a CSS class identifier (.myclass).
 */
ThemeBuilder.styleEditor.classify = function (x, exclude) {
  if (!x) {
    return '';
  }
  var i;
  for (i = 0; i < exclude.length; i++) {
    x.replace(exclude[i], '');
  }
  return '.' + x.split(/\s+/).join('.');
};

/**
 * Creates a CSS selector for an item by tracing its lineage.
 *
 * @param <object> node
 *
 * @return <string> lineage
 *    the full lineage of a node
 */
ThemeBuilder.styleEditor.getNodePath = function (node) {
  if (!node) {
    return;
  }
  node = jQuery(node);
  var directory = node[0].nodeName.toLowerCase() + (node[0].id ? '#' + node[0].id : '') + ThemeBuilder.styleEditor.classify(node[0].className);
  while ((node = node.parent())) {
    if (!node.length) {
      break;
    }
    directory = node[0].nodeName.toLowerCase() + (node[0].id ? '#' + node[0].id : '') + ThemeBuilder.styleEditor.classify(node[0].className) + ' ' + directory;
  }
  return directory;
};

/**
 * internal function used by matchFullPath
 */
ThemeBuilder.styleEditor.matchOne = function (selector, path) {
  var subs = path.split('.');
  var nid = subs[0].split('#');
  var ssubs = selector.split('.');
  var snid = ssubs[0].split('#');

  if (snid[0].indexOf(':') !== -1) {
    snid[0] = snid[0].split(':')[0];
  }
  if (snid[1]) {
    if (snid[1] !== nid[1]) {
      return false;
    }
  }
  if (snid[0] && snid[0] !== nid[0]) {
    return false;
  }
  var i, e;
  for (i = 1; i < ssubs.length; i++) { // go through class names
    var good = false;
    for (e = 1; e < subs.length; e++) {
      if (ssubs[i] === subs[e]) {
        good = true;
        break;
      }
    }
    if (!good) {
      return false;
    }
  }
  return true;
};

/**
 * Check if full CSS selector matches a node path
 *
 * @param <string>  search
 *    node path
 * @param <string>  selector
 *    css rule selectorText
 * @param <bool>    truncate
 *    truncate selector only to the relevent part
 */
ThemeBuilder.styleEditor.matchFullPath = function (search, selector, truncate) {
  if (!search || !selector) {
    return false;
  }
  var parts = selector.split(/,\s*/g);
  for (var i = 0; i < parts.length; i++) {
    if (ThemeBuilder.styleEditor.matchPath(search, parts[i])) {
      if (truncate) {
        return parts[i];
      }
      else {
        return search;
      }
    }
  }
  return false;
};

/**
 * internal function used by matchFullPath
 */
ThemeBuilder.styleEditor.matchPath = function (selector, path, inherit) {
  if (!selector || !path) {
    return false;
  }
  var parts = selector.split(' ');
  var pparts = path.split(' ');
  var current = 0;
  var good;
  var i;
  for (i = 0; i < parts.length; i++) {
    good = false;
    for (; current < pparts.length; current++) {
      if (ThemeBuilder.styleEditor.matchOne(parts[i], pparts[current])) {
        good = true;
        break;
      }
    }
    if (!good) {
      return false;
    }
  }
  
  if (inherit || current >= pparts.length - 1) {
    return true;
  }
  return false;
};

/**
 * Convert a css attibute name into a DOM style attribute
 * ex:
 *    background-color   -> backgroundColor
 *    -moz-border-radius -> MozBorderRadius
 */
ThemeBuilder.styleEditor.cdash = function (x) {
  var p = x.split('-');
  var i;
  for (i = 1; i < p.length; i++) {
    p[0] += p[i][0].toUpperCase() + p[i].slice(1);
  }
  return p[0];
};

/**
 * opposite of cdash
 */
ThemeBuilder.styleEditor.uncdash = function (x) {
  return x.replace(/[A-Z]/g, function (x) {
    return '-' + x.toLowerCase();
  });
};

/**
 * Convers an r, g and b component into its hexidecimal equivalent.
 */
ThemeBuilder.styleEditor.rgb_hex = function (r, g, b) {
  return ThemeBuilder.styleEditor.hex(r) + ThemeBuilder.styleEditor.hex(g) + ThemeBuilder.styleEditor.hex(b);
};

/**
 * convert from CSS rgb format to hex.
 *    rgb(255,255,255) -> #FFFFFF
 */
ThemeBuilder.styleEditor.unrgb = function (x) {
  return x.toString().replace(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+\))/g, function (a, r, g, b) {
    return '#' + ThemeBuilder.styleEditor.rgb_hex(r, g, b);
  });
};

/**
 * Given a number between 0 and 255, convert it to a hexidecimal equivalent.
 */
ThemeBuilder.styleEditor.hex = function (n) {
  var hx = '0123456789ABCDEF';
  n = parseInt(n, 10);
  if (!n || isNaN(n)) {
    return '00';
  }
  n = n < 0 ? 0 : n;
  n = n > 255 ? 255 : n;
  return hx.charAt((n - n % 16) / 16) + hx.charAt(n % 16);
};

/**
 * Returns a getComputedStyle function for a given element.
 *
 * @param {DomObject} element
 *   The element for which the computed style should be calculated.
 */
ThemeBuilder.styleEditor.getComputedStyleFunction = function (element) {
  var style = '';
  if (document.defaultView && document.defaultView.getComputedStyle) {
    style = document.defaultView.getComputedStyle(element, '');
  }
  else if (element.currentStyle) {
    style = element.currentStyle;
  }
  // getComputedStyle is native code in FF, which means we have to clone the
  // CSSStyleDeclaration it returns in order to preserve its current value.
  style = ThemeBuilder.clone(style);
  var cssText = style.cssText;
  if (cssText) {
    // On Safari the property/value pairs are concatenated in the cssText
    // property.  Remove this property and instead add the properties to the
    // style object.
    delete style.cssText;
    var contents = cssText.split(';');
    for (var index = 0; index < contents.length; index++) {
      var line = contents[index];
      var propertyLength = line.indexOf(':');
      if (propertyLength === -1) {
        continue;
      }
      var property = jQuery.trim(line.slice(0, propertyLength));
      var value = jQuery.trim(line.slice(propertyLength + 1));
      if (value.indexOf('repeat ') > -1) {
        // Chrome mis-reports the value of background-repeat on some themes.
        // So far I haven't devised a rule that could make this more generic,
        // so for now I will fix only this particular issue.
        value = value.substr(value.lastIndexOf(' ') + 1);
      }
      style[property] = value;
    }
  }
  var getComputedStyle = ThemeBuilder.bind(style, ThemeBuilder.styleEditor._getComputedStyle);
  return getComputedStyle;
};

/**
 * Helper function for ThemeBuilder.styleEditor.getComputedStyleFunction.
 *
 * Returns the computed style for the specified property. The function
 * scope should be a CSSStyleDeclaration for a given DomElement.
 *
 * @private
 *
 * @param {string} property
 *   A CSS property such as "background-color".
 */
ThemeBuilder.styleEditor._getComputedStyle = function (property) {
  // Note: Normally we would use this.getPropertyValue if it were available.
  // However, at least in FF3.5, getPropertyValue() is native code that only
  // works with the original CSSStyleDeclaration object, not a cloned object.
  /*
  if (this.getPropertyValue) {
    value = this.getPropertyValue(property);
    return value;
  }
  */
  var value = this[property];
  if (!value) {
    property = property.replace(/\-(\w)/g, function (match, p1) {
      return  p1.toUpperCase();
    });
    value = this[property];
  }
  return value;
};

/**
 * Returns the size in pixels of the top border and top padding of the
 * specified element.
 *
 * @param {DomElement} element
 *   The element.
 */
ThemeBuilder.styleEditor.getTopOffset = function (element) {
  var properties = ['padding-top', 'border-top-width'];
  var getComputedStyle = ThemeBuilder.styleEditor.getComputedStyleFunction(element);
  var offset = 0;
  for (var i = 0; i < properties.length; i++) {
    offset += parseInt(getComputedStyle(properties[i]), 10);
  }
  return offset;
};

/**
 * Returns the size in pixels of the bottom border and bottom padding
 * of the specified element.
 *
 * @param {DomElement} element
 *   The element.
 */
ThemeBuilder.styleEditor.getBottomOffset = function (element) {
  var properties = ['padding-bottom', 'border-bottom-width'];
  var getComputedStyle = ThemeBuilder.styleEditor.getComputedStyleFunction(element);
  var offset = 0;
  for (var i = 0; i < properties.length; i++) {
    offset += parseInt(getComputedStyle(properties[i]), 10);
  }
  return offset;
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true */

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * @class
 */
ThemeBuilder.styles.Editor = ThemeBuilder.initClass();
ThemeBuilder.styles.Editor.prototype.initialize = function (elementPicker) {
  this.elementPicker = elementPicker;
  this.isVisible = false;
};

/**
 * This method is called when the corresponding tab is selected.
 */
ThemeBuilder.styles.Editor.prototype.tabSelectionChanged = function (tabName) {
  var $ = jQuery;
  if (this.tabName === tabName) {
    this.isVisible = true;
    this.tabSelected();
  }
  else if (this.isVisible) {
    this.isVisible = false;
    this.tabDeselected();
  }
};

ThemeBuilder.styles.Editor.prototype.tabSelected = function () {
};

ThemeBuilder.styles.Editor.prototype.tabDeselected = function () {
};

ThemeBuilder.styles.Editor.prototype.disableInputs = function () {
};

/**
 * Simple private function that simply returns the passed value.  This is
 * used in the case that one or more slider methods are not provided.
 *
 * @param {mixed} value
 *   The value that should be returned from this function.
 */
ThemeBuilder.styles.Editor.prototype._return = function (value) {
  return value;
};

/**
 * Attempts to determine the value associated with the specified attribute
 * name.  The value is determined by placing a new element at an appropriate
 * place in the DOM such that the specified selector would apply, and then
 * query for the specified value.
 *
 * @param {String} selector
 *   The selector.
 * @param {String} attr
 *   The attribute name.
 *
 * @return {String}
 *   The value of the specified property, or 'undefined' if it could not be
 *   determined.
 */
ThemeBuilder.styles.Editor.prototype.getPropertyValue = function (selector, attr) {
  var items = selector.split(' ');
  var node = 'body';
  var first = null;
  for (var it = 0; it < items.length; it++) {
    var parts = items[it].split('.');
    if (parts[0] === '' || parts[0][0] === '#') {
      node = jQuery('<div></div>').appendTo(node);
    }
    else {
      node = jQuery('<' + parts[0] + '></' + parts[0] + '>').appendTo(node);
    }
    if (!first) {
      first = node;
    }
    node.css('display', 'none');
    if (parts[0][0] === '#') {
      node.attr('id', parts[0]);
    }
    for (var i = 1; i < parts.length; i++) {
      node.addClass(parts[i]);
    }
  }
  var val = undefined;
  if (attr) {
    val = node.css(attr);
  }
  first.remove();
  return val;
};

/**
 * Returns the selected element.  This represents the element that the user
 * selected or a parent of the element the user selected based on the current
 * state of the Selector.  The idea is that we want to initialize values of
 * the properties based on the element the user selected (not, for example,
 * the first element in an array of elements that match the current selector).
 *
 * @return {DomElement}
 *   The element.  If the user has not yet selected an element, the body
 *   element is returned.
 */
ThemeBuilder.styles.Editor.prototype.getSelectedElement = function () {
  var $ = jQuery;
  var selector = this.elementPicker.path_selector;
  var element;
  if (selector) {
    element = selector.getSelectedElement();
  }
  else {
    element = $('body').get(0);
  }
  return element;
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The FontEditor class is responsible for editing font styles, sizes,
 * and colors.
 * @class
 * @extends ThemeBuilder.styles.Editor
 */
ThemeBuilder.styles.FontEditor = ThemeBuilder.initClass();
ThemeBuilder.styles.FontEditor.prototype = new ThemeBuilder.styles.Editor();

/**
 * The constructor of the FontEditor class.
 *
 * @param {ElementPicker} elementPicker
 *   The instance of ElementPicker that is used to select an element to theme.
 */
ThemeBuilder.styles.FontEditor.prototype.initialize = function (elementPicker) {
  this.elementPicker = elementPicker;
  this.tabName = "font";
  this.textAlignRadioButton = new ThemeBuilder.styles.RadioButton('.text-align-panel', 'text-align', 'left');
  this.textAlignRadioButton.addChangeListener(this);

  this.modifications = {};
  ThemeBuilder.getApplicationInstance().addApplicationInitializer(ThemeBuilder.bind(this, this.loadFontFaces));
};

/**
 * Add a stylesheet for @font-face fonts.
 *
 * The @font-face styles need to be lazy-loaded because they'll trigger lots of
 * font file downloading.
 */
ThemeBuilder.styles.FontEditor.prototype.loadFontFaces = function (appData) {
  this.fontFaces = appData.fontFaces;
  this.fontFaceStacks = {};
  var i, fontFace;
  var cssText = '';
  for (i = 0; i < this.fontFaces.length; i++) {
    fontFace = this.fontFaces[i];
    // For fonts with @font-face rules, add those rules to a stylesheet, and
    // create a lookup table for use in this.familyChanged().
    if (fontFace.fontFaceRule !== '') {
      cssText += fontFace.fontFaceRule + "\n";
      this.fontFaceStacks[fontFace.fontFamily] = fontFace.name;
    }
  }

  if (this.shouldRemoveServerFontStyles()) {
    // Some browsers can't handle @font-face fonts within a select element.
    // Remove the font-family from such elements.
    var $ = jQuery;
    $('#style-font-family .tb-server-font').css('font-family', 'inherit');
  }
  var stylesheet = ThemeBuilder.styles.Stylesheet.getInstance('fontface.css');
  stylesheet.setCssText(cssText);
};

/**
 * Determine whether the font styles should be removed for all server side
 * fonts within the themebuilder font-family select element.  On some browsers
 * setting @font-face fonts in the select list causes the select list to be
 * inoperative.
 *
 * @return
 *   True if the selector's font-face styles should be removed for server side
 *   fonts; false otherwise.
 */
ThemeBuilder.styles.FontEditor.prototype.shouldRemoveServerFontStyles = function () {
  var browserDetect = new ThemeBuilder.BrowserDetect();
  if (browserDetect.browser === 'Safari' && browserDetect.OS === 'Mac') {
    // If @font-face fonts are used in a select element in Safari, the select
    // element cannot be opened.  Note that this only occurs on Safari running
    // on Mac.
    return true;
  }
  return false;
};

/**
 * Initializes the Font tab.  The purpose of this method is to attach event
 * listeners to the relevant DOM elements, effectively wiring the behavior to
 * the controls.
 */
ThemeBuilder.styles.FontEditor.prototype.setupTab = function () {
  var $ = jQuery;
  $('#themebuilder-style-font input, #themebuilder-style-font select').attr('disabled', true);
  $('#style-font-family').change(ThemeBuilder.bind(this, this.familyChanged));
  this.palettePicker = new ThemeBuilder.styles.PalettePicker($('#style-font-color'), 'color', $('#themebuilder-wrapper'));

  // font size
  $('#style-font-size').inputslider({
    min: 8,
    max: 30,
    step: 2,
    onSlide: ThemeBuilder.bind(this, this.sizePreview),
    onStop: ThemeBuilder.bind(this, this.sizeChanged),
    onShow: ThemeBuilder.bind(this, this.showSizeSlider)
  });
  $('#style-font-size').change(ThemeBuilder.bind(this, this.sizeFieldChanged));
  $('#style-font-size-u').change(ThemeBuilder.bind(this, this.sizeUnitsChanged));

  // leading
  $('#style-line-height').inputslider({
    min: 90,
    max: 200,
    step: 2,
    onSlide: ThemeBuilder.bind(this, this.heightPreview),
    onStop: ThemeBuilder.bind(this, this.heightChanged),
    onShow: ThemeBuilder.bind(this, this.showHeightSlider)
  });

  $('#style-line-height').change(ThemeBuilder.bind(this, this.heightFieldChanged));

  // kerning
  $('#style-letter-spacing').inputslider({
    min: -5,
    max: 5,
    step: 0.2,
    onSlide: ThemeBuilder.bind(this, this.spacingPreview),
    onStop: ThemeBuilder.bind(this, this.spacingChanged),
    onShow: ThemeBuilder.bind(this, this.showSpacingSlider)
  });
  $('#style-letter-spacing').change(ThemeBuilder.bind(this, this.spacingFieldChanged));

  $("#themebuilder-style-font .fg-button").mousedown(ThemeBuilder.bind(this, this.styleButtonClicked));

  $("#themebuilder-style-font #typekit-toggle").click(ThemeBuilder.bind(this, this.toggleTypekit));
};

/**
 * This method is called by ElementPicker:selectorSelected when the user
 * selects an element.  This causes the state of the FontEditor controls to
 * change, reflecting the current state of the specified selector.  This
 * method is called when the user selects an element or changes the selector
 * by interacting with the element selector widget.
 *
 * @param {String} selector
 *   The new CSS selector.
 */
ThemeBuilder.styles.FontEditor.prototype.selectorChanged = function (selector) {
  var $ = jQuery;
  this.enableInputs();
  $('#themebuilder-style-background input, #themebuilder-style-background select,#themebuilder-style-background button').removeAttr('disabled');
  $('#style-font-family option').eq(0).attr('selected', true);
  $('#style-font-size').val('');
  $('#style-font-size-u option').eq(0).attr('selected', true);
  $('#style-font-weight option').eq(0).attr('selected', true);
  $('#style-font-style option').eq(0).attr('selected', true);
  $('#themebuilder-style-font input').val('');
  $('#themebuilder-style-font button').removeClass('ui-state-active');

  this.currentSelector = selector;
  this.palettePicker.setSelector(this.currentSelector);
  this.refreshDisplay();
};

/**
 * This method is called when the state of radio buttons is changed.  This
 * handles the text-align property.
 *
 * @param {String} propertyName
 *   The name of the property being changed.
 * @param {String} oldValue
 *   The original value.
 * @param {String} newValue
 *   The new value.
 */
ThemeBuilder.styles.FontEditor.prototype.valueChanged = function (propertyName, oldValue, newValue) {
  var modification = new ThemeBuilder.CssModification(this.currentSelector);
  modification.setPriorState(propertyName, oldValue);
  modification.setNewState(propertyName, newValue);
  ThemeBuilder.applyModification(modification);
};

/**
 * Refreshes the display.  This should occur when the user selects a new
 * element or when the display changes for some other reason, such as clicking
 * undo or redo.  This method looks at the current set of properties for the
 * current selector and makes the property values on the FontEditor match.
 */
ThemeBuilder.styles.FontEditor.prototype.refreshDisplay = function () {
  var element = this.getSelectedElement();
  var getComputedStyle = ThemeBuilder.styleEditor.getComputedStyleFunction(element);
  this._refreshFamily(getComputedStyle);
  this._refreshColor(getComputedStyle);
  this._refreshSize(getComputedStyle);
  this._refreshBoldButtonProperty(getComputedStyle, '#themebuilder-style-font .fg-button.bold', 'font-weight');
  this._refreshButtonProperty(getComputedStyle, '#themebuilder-style-font .fg-button.italic', 'font-style', 'italic');
  this._refreshButtonProperty(getComputedStyle, '#themebuilder-style-font .fg-button.underline', 'text-decoration', 'underline');
  this._refreshTextAlign(getComputedStyle);
  this._refreshButtonProperty(getComputedStyle, '#themebuilder-style-font .fg-button.uppercase', 'text-transform', 'uppercase');
  this._refreshSliderValue(getComputedStyle, '#style-line-height', 'line-height', 'normal', this.processLineHeightValue);
  this._refreshSliderValue(getComputedStyle, '#style-letter-spacing', 'letter-spacing', 'normal', this.processLetterSpacingValue);
};

/**
 * Responsible for refreshing the font-family.
 *
 * @private
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.FontEditor.prototype._refreshFamily = function (getComputedStyle) {
  var $ = jQuery;
  var value = getComputedStyle('font-family');
  if (!value) {
    value = '';
  }
  value = this.normalizeFontValue(value);
  $('#style-font-family').val(value);
  this.modifications['font-family'] = new ThemeBuilder.CssModification(this.currentSelector);
  this.modifications['font-family'].setPriorState('font-family', value);
};

/**
 * If the font value is not normalized, small inconsistencies will make it
 * such that the selected font will not appear in the font-family drop down
 * menu.
 *
 * @param {String} font
 *   A string representing the font family.
 *
 * @return
 *   The normalized representation of the font value.
 */
ThemeBuilder.styles.FontEditor.prototype.normalizeFontValue = function (font) {
  if (font === "'auto'") {
    return 'inherit';
  }
  var parts = font.split(',');
  var result = [];
  for (var i = 0; i < parts.length; i++) {
    var font_string = parts[i];
    // Remove quotes from the value so it will match the option menu.  This is
    // required for Safari.
    font_string = font_string.replace(/\"/g, '');
    font_string = font_string.replace(/\'/g, '');
    font_string = jQuery.trim(font_string);
    font_string = "'" + font_string + "'";
    result.push(font_string);
  }
  return result.join(',');
};

/**
 * Responsible for refreshing the color.
 *
 * @private
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.FontEditor.prototype._refreshColor = function (getComputedStyle) {
  var $ = jQuery;
  var value = getComputedStyle('color');
  this.palettePicker.setIndex(value);
};

/**
 * Responsible for refreshing the font-size.
 *
 * @private
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.FontEditor.prototype._refreshSize = function (getComputedStyle) {
  var $ = jQuery;
  var value = getComputedStyle('font-size');
  var size = parseInt(value, 10);
  // There has to be a more correct way to handle this.
  var units = (value.slice(-2));
  $('#style-font-size').val(size);
  $('#style-font-size-u').val(units);
  this.modifications['font-size'] = new ThemeBuilder.CssModification(this.currentSelector);
  this.modifications['font-size'].setPriorState('font-size', '' + size + units);
};

/**
 * Responsible for refreshing the value associated with a slider.
 *
 * @private
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 * @param {String} controlSelector
 *   The css selector that uniquely identifies the control in the themebuilder
 *   that should be updated.
 * @param {String} propertyName
 *   The property name that is edited with the slider.
 * @param {String} defaultValue
 *   The value to use should a value for the specified propertyName not be
 *   set.
 * @param {function} processValue
 *   The function used to map the css value to appropriate values for the
 *   themebuilder control and the modification instance.
 */
ThemeBuilder.styles.FontEditor.prototype._refreshSliderValue = function (getComputedStyle, controlSelector, propertyName, defaultValue, processValue) {
  var $ = jQuery;
  var size = '';
  var valueString = defaultValue;
  var value = ThemeBuilder.util.parseCssValue(getComputedStyle(propertyName), defaultValue);

  var processedValue = processValue(getComputedStyle, value);
  $(controlSelector).val(processedValue.value);
  this.modifications[propertyName] = new ThemeBuilder.CssModification(this.currentSelector);
  this.modifications[propertyName].setPriorState(propertyName, processedValue.valueString);
};

/**
 * Calculates appropriate values for the value displayed in the leading
 * control and for the modification.  These are not always the same.  The
 * default value for line-height is 'normal', which we take to mean '150%'.
 *
 * @param {function} getComputedStyle
 *   The function that returns the computed style for the selected element.
 * @param {Object} value
 *   The value returned from ThemeBuilder.util.parseCssValue.
 * @result {Object}
 *   An object that provides the value to display in the control and a
 *   separate value to set into the modification instance.
 */
ThemeBuilder.styles.FontEditor.prototype.processLineHeightValue = function (getComputedStyle, value) {
  var result = {};
  if (value.number) {
    switch (value.units) {
    case '%':
      var size = value.number;
      break;
    case 'px':
      // The units aren't in percent, so calculate the percent based on the
      // font size.
      var fontSize = ThemeBuilder.util.parseCssValue(getComputedStyle('font-size'), '13px');
      if (fontSize.units === 'px') {
        value.number = Math.round((value.number / fontSize.number) * 100);
        value.units = '%';
      }
      break;
    default:
      ThemeBuilder.logCallback('FontEditor::processLineHeightValue encountered a line-height value that is unexpectedly expressed in units ' + value.units);
    }
    result.value = value.number;
    result.valueString = value.number + value.units;
  }
  else {
    result.value = '150';
    result.valueString = 'normal';
  }
  return result;
};

/**
 * Calculates appropriate values for the value displayed in the kerning
 * control and for the modification.  These are not always the same.  The
 * default value for letter-spacing is 'normal', which we take to mean '0px'.
 *
 * @param {function} getComputedStyle
 *   The function that returns the computed style for the selected element.
 * @param {Object} value
 *   The value returned from ThemeBuilder.util.parseCssValue.
 * @result {Object}
 *   An object that provides the value to display in the control and a
 *   separate value to set into the modification instance.
 */
ThemeBuilder.styles.FontEditor.prototype.processLetterSpacingValue = function (getComputedStyle, value) {
  var result = {};
  if (value.number) {
    if (value.units === 'px') {
      result.value = value.number;
      result.valueString = value.number + value.units;
    }
    else {
      ThemeBuilder.logCallback('FontEditor::processLetterSpacingValue encountered a line-height value that is unexpectedly expressed in units ' + value.units);
    }
  }
  else {
    result.value = '0';
    result.valueString = 'normal';
  }
  return result;
};

/**
 * Responsible for refreshing the bold toggle button on the font tab.
 *
 * This method is distinct from the _refreshButtonProerty method
 * because it deals with the possibility of either a string or an
 * integer value for the bold property.  Note that IE returns an
 * integer rather than retaining the string value used to set the
 * property.
 *
 * @private
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 * @param {String} controlSelector
 *   The css selector used to uniquely identify the button element.
 * @param {String} propertyName
 *   The name of the css property associated with the button.
 */
ThemeBuilder.styles.FontEditor.prototype._refreshBoldButtonProperty = function (getComputedStyle, controlSelector, propertyName) {
  var $ = jQuery;
  var value = getComputedStyle(propertyName);
  if (value && value.toLower) {
    // This is a string
  }
  if (value && !value.toLower && value > 500) {
    // Internet Explorer passes back the actual font weight as an
    // integer rather than retaining the value name that was used.
    value = 'bold';
  }

  if (value === 'bold') {
    $(controlSelector).addClass('ui-state-active');
  }
  else {
    $(controlSelector).removeClass('ui-state-active');
  }
  this.modifications[propertyName] = new ThemeBuilder.CssModification(this.currentSelector);
  this.modifications[propertyName].setPriorState(propertyName, value);
};

/**
 * Responsible for refreshing toggle buttons on the font tab.
 *
 * @private
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 * @param {String} controlSelector
 *   The css selector used to uniquely identify the button element.
 * @param {String} propertyName
 *   The name of the css property associated with the button.
 * @param {String} onValue
 *   The value associated with the 'on' state for the button.
 */
ThemeBuilder.styles.FontEditor.prototype._refreshButtonProperty = function (getComputedStyle, controlSelector, propertyName, onValue) {
  var $ = jQuery;
  var value = getComputedStyle(propertyName);
  if (value === onValue) {
    $(controlSelector).addClass('ui-state-active');
  }
  else {
    $(controlSelector).removeClass('ui-state-active');
  }
  this.modifications[propertyName] = new ThemeBuilder.CssModification(this.currentSelector);
  this.modifications[propertyName].setPriorState(propertyName, value);
};

/**
 * Refreshes the text-align control to match the current
 * selection.
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.FontEditor.prototype._refreshTextAlign = function (getComputedStyle) {
  var $ = jQuery;
  // Initialize the background-repeat value.
  var value = getComputedStyle('text-align');
  if (!value) {
    value = 'left';
  }
  switch (value) {
  case 'start':
  case 'auto':
    value = 'left';
    break;
  case 'end':
    value = 'right';
    break;
  }
  // Cause the display to be updated without simulating a user click.
  try {
    this.textAlignRadioButton.setEnabledButton(value);
  }
  catch (e) {
  }
  this.modifications['text-align'] = new ThemeBuilder.CssModification(this.currentSelector);
  this.modifications['text-align'].setPriorState('text-align', value);
};

/**
 * Called when the specified property has been changed to the specified value.
 * This method causes the change to be applied.
 *
 * @param {String} property
 *   The property that has changed.
 * @param {String} value
 *   The new value for the specified property.
 * @param {Array} resources
 *   Any resources that are required for the new property (font, image, etc.)
 */
ThemeBuilder.styles.FontEditor.prototype.propertyChanged = function (property, value, resources) {
  this.modifications[property].setNewState(property, value, resources);
  ThemeBuilder.applyModification(this.modifications[property]);
  this.modifications[property] = this.modifications[property].getFreshModification();
};

/**
 * Called when the user changes the font-family using the option menu.
 *
 * @param {DomEvent} event
 *   The event that represents the change.
 */
ThemeBuilder.styles.FontEditor.prototype.familyChanged = function (event) {
  var property = 'font-family';
  var resources = [];
  if (event && event.currentTarget) {
    var value = event.currentTarget.value;
    // Determine whether this is a @font-face font that requires a server-side
    // resource to be added to the theme.
    var fontName = this.fontFaceStacks[value];
    if (fontName) {
      resources.push({type: 'font', name: fontName});
    }
    this.propertyChanged(property, value, resources);
  }
};

/**
 * Called when the user changes the font-size units using the option menu.
 *
 * @param {DomEvent} event
 *   The event that represents the change.
 */
ThemeBuilder.styles.FontEditor.prototype.sizeUnitsChanged = function (event) {
  var $ = jQuery;
  var units = $('#style-font-size-u').val();
  var defaulthash = {'px': {min: 10, max: 30, step: 2},
                     'em': {min: 0.5, max: 4, step: 0.1}};
  var defaults = defaulthash[units];
  if ($('#style-font-size').val() > defaults.max) {
    $('#style-font-size').val(defaults.max);
  }
  else if ($('#style-font-size').val() < defaults.min) {
    $('#style-font-size').val(defaults.min);
  }
  this.propertyChanged('font-size', $('#style-font-size').val() + units);
};

/**
 * Called when the user clicks either the bold, italic, or uppercase button.
 * This causes the associated font property to be toggled.
 *
 * @param {DomEvent} event
 *   The event that represents the change.
 */
ThemeBuilder.styles.FontEditor.prototype.styleButtonClicked = function (event) {
  var node = jQuery(event.currentTarget);
  var propertyName = this.getPropertyFromClass(node);
  if (!propertyName) {
    return;
  }
  var value;
  var enabled;
  if (node.is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active')) {
    node.removeClass("ui-state-active");
    enabled = false;
  }
  else {
    node.addClass('ui-state-active');
    enabled = true;
  }
  switch (propertyName) {
  case 'font-weight':
    value = enabled === true ? 'bold' : 'normal';
    break;
  case 'font-style':
    value = enabled === true ? 'italic' : 'normal';
    break;
  case 'text-decoration':
    value = enabled === true ? 'underline' : 'none';
    break;
  case 'text-transform':
    value = enabled === true ? 'uppercase' : 'none';
    break;
  default:
    return;
  }
  if (value) {
    this.propertyChanged(propertyName, value);
  }
};

/**
 * Event handler to display the site with or without Typekit fonts enabled.
 */
ThemeBuilder.styles.FontEditor.prototype.toggleTypekit = function (event) {
  var $ = jQuery;
  var typekitCss = $('link[href^=http://use.typekit.com]');
  var link = event.currentTarget;
  var text = $(link).html();
  var disableText = Drupal.t('show site without Typekit fonts');
  var enableText = Drupal.t('re-enable Typekit fonts');
  switch (text) {
  case disableText:
    // Turn off Typekit fonts.
    typekitCss.get(0).disabled = true;
    $(link).html(enableText);
    break;

  case enableText:
    // Turn on Typekit fonts.
    typekitCss.get(0).disabled = false;
    $(link).html(disableText);
    break;
  }
};

/**
 * Determines what the property name is based on the class associated with the
 * specified element.
 *
 * @param {jQuery element} node
 *   The element associated with the button.
 * @return {String}
 *   The property name that the specified element is meant to adjust.
 *   Undefined is returned if it cannot be determined from the element's
 *   classes.
 */
ThemeBuilder.styles.FontEditor.prototype.getPropertyFromClass = function (node) {
  var classMap = {'bold': 'font-weight',
                  'italic': 'font-style',
                  'underline': 'text-decoration',
                  'uppercase': 'text-transform'};
  for (var name in classMap) {
    if (typeof(classMap[name]) === 'string') {
      if (node.hasClass(name)) {
        return classMap[name];
      }
    }
  }
  return undefined;
};

/**
 * Causes the slider that adjusts the font size to be displayed.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.showSizeSlider = function (slider, target) {
  var $ = jQuery;
  if ($('#element-to-edit .theelement').html() === 'no element selected') {
    return false;
  }
  var defaulthash = {'px': {min: 10, max: 72, step: 2},
                     'em': {min: 0.5, max: 4, step: 0.1}};
  var defaults = defaulthash[$('#style-font-size-u').val()];
  if (!defaults) {
    throw "Invalid Size Unit";
  }
  slider.slider.slider('option', 'max', defaults.max);
  slider.slider.slider('option', 'min', defaults.min);
  slider.slider.slider('option', 'step', defaults.step);
  var val = $(target).val();
  $(target).focus();
  if (val > defaults.max) {
    val = defaults.max;
  }
  else if (val < defaults.min) {
    val = defaults.min;
  }
  slider.slider.slider('value', val);
};

/**
 * Called when the size slider has moved and the change should be displayed.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomEvent} event
 *   The event associated with sliding the thumb of the slider.
 * @param {String} value
 *   The new value
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.sizePreview = function (sizer, event, value, target) {
  var $ = jQuery;
  this.modifications['font-size'].setNewState('font-size',
    value + $('#style-font-size-u').val());
  ThemeBuilder.preview(this.modifications['font-size']);
  $(target).val(value);
};

/**
 * Called when the size slider has been dismissed and the change should be
 * applied.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomEvent} event
 *   The event associated with sliding the thumb of the slider.
 * @param {String} value
 *   The new value
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.sizeChanged = function (sizer, event, value, target) {
  this.propertyChanged('font-size', value + jQuery('#style-font-size-u').val());
};

/**
 * Called when the user enters a value in the size field.
 *
 * @param {DomEvent} event
 *   The event that represents the change.
 */
ThemeBuilder.styles.FontEditor.prototype.sizeFieldChanged = function (event) {
  var $ = jQuery;
  var value = $('#style-font-size').val();
  if (value.currentTarget) {
    value = value.currentTarget.value;
  }
  this.propertyChanged('font-size', value + $('#style-font-size-u').val());
};

/**
 * Causes the slider that adjusts the font size to be displayed.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.showHeightSlider = function (slider, target) {
  var $ = jQuery;
  if ($('#element-to-edit .theelement').html() === 'no element selected') {
    return false;
  }
  var val = $(target).val();
  if (!ThemeBuilder.util.isNumeric(val)) {
    val = '150';
  }
  $(target).focus();
  slider.slider.slider('value', val);
};

/**
 * Called when the height slider has moved and the change should be displayed.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomEvent} event
 *   The event associated with sliding the thumb of the slider.
 * @param {String} value
 *   The new value
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.heightPreview = function (sizer, event, value, target) {
  var $ = jQuery;
  var valueString = value;
  if (ThemeBuilder.util.isNumeric(value)) {
    valueString = value + '%';
  }
  else {
    // The default value is 150%.  Use this when the value entered is 'normal'.
    value = '150';
    valueString = value + '%';
  }
  this.modifications['line-height'].setNewState('line-height',
    valueString);
  ThemeBuilder.preview(this.modifications['line-height']);
  $(target).val(value);
};

/**
 * Called when the size slider has been dismissed and the change should be
 * applied.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomEvent} event
 *   The event associated with sliding the thumb of the slider.
 * @param {String} value
 *   The new value
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.heightChanged = function (sizer, event, value, target) {
  this.propertyChanged('line-height', value + '%');
};

/**
 * Called when the user enters a value in the size field.
 *
 * @param {DomEvent} event
 *   The event that represents the change.
 */
ThemeBuilder.styles.FontEditor.prototype.heightFieldChanged = function (event) {
  var $ = jQuery;
  var value = $('#style-line-height').val();
  if (ThemeBuilder.util.isNumeric(value)) {
    value += '%';
  }
  this.propertyChanged('line-height', value);
};

/**
 * Causes the slider that adjusts the font size to be displayed.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.showSpacingSlider = function (slider, target) {
  var $ = jQuery;
  if ($('#element-to-edit .theelement').html() === 'no element selected') {
    return false;
  }
  var val = $(target).val();
  if (!ThemeBuilder.util.isNumeric(val)) {
    val = '0';
  }
  $(target).focus();
  slider.slider.slider('value', val);
};

/**
 * Called when the kerning slider has moved and the change should be displayed.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomEvent} event
 *   The event associated with sliding the thumb of the slider.
 * @param {String} value
 *   The new value
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.spacingPreview = function (sizer, event, value, target) {
  var $ = jQuery;
  var valueString = value;
  if (ThemeBuilder.util.isNumeric(value)) {
    valueString = value + 'px';
  }
  else {
    // The default value is 0px.  Use this when the value entered is 'normal'.
    value = '0';
    valueString = value + 'px';
  }
  this.modifications['letter-spacing'].setNewState('letter-spacing',
    valueString);
  ThemeBuilder.preview(this.modifications['letter-spacing']);
  $(target).val(value);
};

/**
 * Called when the kerning slider has been dismissed and the change should be
 * applied.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomEvent} event
 *   The event associated with sliding the thumb of the slider.
 * @param {String} value
 *   The new value
 * @param {DomElement} target
 *   The target element that will be 
 */
ThemeBuilder.styles.FontEditor.prototype.spacingChanged = function (sizer, event, value, target) {
  this.propertyChanged('letter-spacing', value + 'px');
};

/**
 * Called when the user enters a value in the kerning field.
 *
 * @param {DomEvent} event
 *   The event that represents the change.
 */
ThemeBuilder.styles.FontEditor.prototype.spacingFieldChanged = function (event) {
  var $ = jQuery;
  var value = $('#style-letter-spacing').val();
  if (ThemeBuilder.util.isNumeric(value)) {
    value += 'px';
  }
  this.propertyChanged('letter-spacing', value);
};

/**
 * Causes the inputs on this FontEditor instance to be disabled.
 */
ThemeBuilder.styles.FontEditor.prototype.disableInputs = function () {
  var $ = jQuery;
  $('#themebuilder-style-font input, #themebuilder-style-font select').attr('disabled', true);  
};

/**
 * Causes the inputs on this FontEditor instance to be enabled.
 */
ThemeBuilder.styles.FontEditor.prototype.enableInputs = function () {
  var $ = jQuery;
  $('#themebuilder-style-font input, #themebuilder-style-font select').attr('disabled', false);
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true */

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The BoxEditor class is responsible for the CSS box model editor.
 * @class
 * @extends ThemeBuilder.styles.Editor
 */
ThemeBuilder.styles.BoxEditor = ThemeBuilder.initClass();
ThemeBuilder.styles.BoxEditor.prototype = new ThemeBuilder.styles.Editor();

ThemeBuilder.styles.BoxEditor.prototype.initialize = function (elementPicker) {
  this.elementPicker = elementPicker;
  this.tabName = "spacing";
};

/**
 * Refreshes the display.  This should occur when the user selects a
 * new element or when the display changes for some other reason, such
 * as clicking undo or redo.  This method looks at the current set of
 * properties for the selector and makes the property values match.
 */
ThemeBuilder.styles.BoxEditor.prototype.refreshDisplay = function () {
  var selectedElement = this.getSelectedElement();
  var getComputedStyle = ThemeBuilder.styleEditor.getComputedStyleFunction(selectedElement);
  this.modifications = {};
  this.refreshBoxEditor(getComputedStyle);
  this.refreshBorderStyle(getComputedStyle);
  this.refreshBorderColor(getComputedStyle);
  this.refreshElementSize(getComputedStyle);
};

/**
 * Refreshes the display of the box editor.
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.BoxEditor.prototype.refreshBoxEditor = function (getComputedStyle) {
  var $ = jQuery;
  var properties = {'margin-%': {id: '#tb-style-margin', fallback: 'margin', type: 'margin'},
    'border-%-width': {id: '#tb-style-border', fallback: 'border-width', type: 'border'},
    'padding-%': {id: '#tb-style-padding', fallback: 'padding', type: 'padding'}};
  var directions = ['top', 'right', 'bottom', 'left'];

  for (var property in properties) {
    if (properties[property].id) {
      for (var index = 0; index < directions.length; index++) {
        var direction = directions[index];
        var propertyName = property.replace(/%/, direction);
        var value = getComputedStyle(propertyName);
        value = parseInt(value, 10);
        if (isNaN(value)) {
          value = 0;
        }
        $(this._getElementForProperty(propertyName)).val(value);
      }
    }
  }
};

/**
 * Refreshes the display of the border style.
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.BoxEditor.prototype.refreshBorderStyle = function (getComputedStyle) {
  var $ = jQuery;
  var value = getComputedStyle('border-top-style');
  if (!value) {
    value = 'none';
  }
  $('#style-border-style').val(value);
  var modification = new ThemeBuilder.CssModification(this.currentSelector);
  modification.setPriorState('border-style', value);
  this.modifications['border-style'] = modification;
};

/**
 * Refreshes the display of the border color.
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.BoxEditor.prototype.refreshBorderColor = function (getComputedStyle) {
  var style = getComputedStyle('border-top-color');
  this.picker.setIndex(style);
};

/**
 * Refreshes the display of the element size.
 */
ThemeBuilder.styles.BoxEditor.prototype.refreshElementSize = function (getComputedStyle) {
  var $ = jQuery;
  var height = ThemeBuilder.util.parseCssValue(getComputedStyle('height'));
  var width = ThemeBuilder.util.parseCssValue(getComputedStyle('width'));
  if (ThemeBuilder.util.isNumeric(height.number)) {
    height.number = Math.round(height.number);
    height.string = height.number + height.units;
  } else {
    height.number = 'auto';
    height.units = 'px';
    height.string = 'auto';
  }
  if (ThemeBuilder.util.isNumeric(width.number)) {
    width.number = Math.round(width.number);
    width.string = width.number + width.units;
  } else {
    width.number = 'auto';
    width.units = 'px';
    width.string = 'auto';
  }

  $('#style-element-height').val(height.number);
  $('#style-element-height-u').val(height.units);
  $('#style-element-width').val(width.number);
  $('#style-element-width-u').val(width.units);

  var modification = new ThemeBuilder.CssModification(this.currentSelector);
  modification.setPriorState('height', height.string);
  this.modifications.height = modification;
  modification = new ThemeBuilder.CssModification(this.currentSelector);
  modification.setPriorState('width', width.string);
  this.modifications.width = modification;
};

ThemeBuilder.styles.BoxEditor.prototype.attributeTarget = function (target) {
  var $ = jQuery;
  var attribute;
  target = $(target);
  if (target.hasClass('corner')) {
    while (target[0].nodeName !== 'TABLE' && (target = target.parent())) {
    }
    attribute = target[0].id.split('-').slice(2).join('-');
    target = $('input[id*=tb-style-' + attribute + ']', target);
  }
  else {
    if (!target.is('input')) {
      target = target.children('input');
      target.focus();
    }
    attribute = target.attr('id').split('-').slice(2).join('-');
  }
  return {
    target: target,
    attribute: attribute
  };
};

ThemeBuilder.styles.BoxEditor.prototype._highlightBoxProperty = function (event, turnOn) {
  var $ = jQuery;
  var highlightClass = 'hovering';
  var element = $(event.currentTarget).closest('table');
  if (true === turnOn) {
    element.addClass(highlightClass);
  }
  else {
    element.removeClass(highlightClass);
  }
};

/**
 * Indicates whether the current modification is associated with the specified
 * element.  The element should be one of the text fields in the box editor.
 * If the current modification is changing the property associated with the
 * specified element, this method will return true.
 *
 * @param {DomElement} element
 *   The element that represents a text field in the box editor.
 *
 * @return
 *   true if the specified element matches the property currently being
 *   edited; false otherwise.
 */
ThemeBuilder.styles.BoxEditor.prototype._elementMatchesModification = function (element) {
  if (this.currentModification) {
    var info = this.attributeTarget(element);
    var modification = this.textEntryGetModification();
    var priorState = modification.getPriorState();
    if (info.attribute === priorState.property) {
      return true;
    }
  }
  return false;
};

/**
 * Called as the user presses keys while focused in the text fields in the box
 * editor.  This action will cause the new values to be previewed.
 *
 * @param {DomEvent} event
 *   The associated event.
 */
ThemeBuilder.styles.BoxEditor.prototype.textEntryChanged = function (event) {
  if (event.keyCode === 9) {
    // This is the tab key.  The user changed focus using tab.  Don't
    // initialize until the value is actually changed.
    return;
  }
  var element = event.currentTarget;
  if (!this._elementMatchesModification(element)) {
    this.createBoxModification(element);
  }
  var modification = this.textEntryGetModification();
  var property = modification.getPriorState().property;
  var value = element.value;
  if (ThemeBuilder.util.isNumeric(value)) {
    value = value + 'px';
  }
  modification.setNewState(property, value);
  ThemeBuilder.preview(this.currentModification);
};

/**
 * Returns a modification instance that is representative of a change being
 * done to the box editor.  Specifically this would be an instance of a
 * margin, border, or padding size modification (not a color or style
 * modification).
 *
 * @return
 *   A modification instance.
 */
ThemeBuilder.styles.BoxEditor.prototype.textEntryGetModification = function () {
  switch (this.currentModification.getType()) {
  case ThemeBuilder.CssModification.TYPE:
    return this.currentModification;

  case ThemeBuilder.GroupedModification.TYPE:
    for (var childname in this.currentModification.children) {
      if (this.currentModification.children.hasOwnProperty(childname)) {
        var child = this.currentModification.getChild(childname);
        var property = child.getPriorState().property;
        if (property !== 'border-style' || property !== 'border-color') {
          return child;
        }
      }
    }
    break;
  }
};

/**
 * Called when the user commits a value in one of the text fields in the box
 * editor.  This act will apply the modification.
 *
 * @param {DomEvent} event
 *   The associated event.
 */
ThemeBuilder.styles.BoxEditor.prototype.textEntryCommitted = function (event) {
  if (this._elementMatchesModification(event.currentTarget)) {
    if (this.currentModification.hasChanged()) {
      ThemeBuilder.applyModification(this.currentModification);
      delete this.currentModification;
    }
  }
};

/**
 * Called when the slider is displayed.
 *
 * @param {Input slider} slider
 *   The slider instance.
 * @param {DomElement} target
 *   The element the slider acts on.
 */
ThemeBuilder.styles.BoxEditor.prototype.slider_show = function (slider, target) {
  if (this.elementPicker.currentSelector === '#none#') {
    return false;
  }
  var info = this.attributeTarget(target);
  var value = info.target.val();
  slider.set('value', value);
  return true;
};

/**
 * Called when the slider is moved.
 *
 * @param {Input slider} slider
 *   The slider instance.
 * @param {Event} event
 *   The event associated with moving the slider.
 * @param {String} value
 *   The new value.
 * @param {DomElement} target
 *   The element the slider acts on.
 */
ThemeBuilder.styles.BoxEditor.prototype.slider_slide = function (slider, event, value, target) {
  var $ = jQuery;
  var info = this.attributeTarget(target);
  var modValue = value;
  if (ThemeBuilder.util.isNumeric(value)) {
    modValue = value + "px";
  }
  if (!this.currentModification) {
    if ($(target).hasClass('corner')) {
      this.currentModification = this._createCornerModification(info.attribute);
    }
    else {
      this.currentModification = new ThemeBuilder.CssModification(this.currentSelector);
      this.currentModification.setPriorState(info.attribute, modValue);
      this.currentModification.setNewState(info.attribute, modValue);
    }
  }

  this._updateModification(this.currentModification, modValue);
  ThemeBuilder.preview(this.currentModification);
  info.target.val(value);
};

/**
 * Returns the element responsible for displaying or editing the specified property.
 *
 * @param {String} property
 *   The name of the property.
 * @return {DomElement}
 *   The element responsible for editing the specified property.
 */
ThemeBuilder.styles.BoxEditor.prototype._getElementForProperty = function (property) {
  var id = 'tb-style-' + property;
  return document.getElementById(id);
};

/**
 * Returns the css property associated with the specified element.
 *
 * @param {DomElement} element
 *   The element.  Generally this will be an input field.
 * @return {String}
 *   The property associated with the element.
 */
ThemeBuilder.styles.BoxEditor.prototype._getPropertyForElement = function (element) {
  var property = '';
  var id = element.id;
  if (new RegExp('^tb-style-(.)*').test(id)) {
    property = id.slice('tb-style-'.length);
  }
  return property;
};

/**
 * Creates a Modification instance for a theming act initiated from one of the
 * BoxEditor corners.  This will cause all four sides to be modified, but not
 * through the use of the shortcut properties (padding, margin, border-width)
 * because that can cause subsequent theming of a single side to fail,
 * depending on the order of the contents of the custom.css file.
 *
 * Instead, this method creates a GroupedModification that represents four
 * independent changes (one for each side).  This also allows the use to undo
 * to get back to the previous state even if each side had a different border
 * width, for example.
 *
 * @param {String} property
 *   The property name being edited.  Can be one of "padding", "border", or "margin"
 * @return {Modification}
 *   A grouped modification with a child CssModification that represents each
 *   of the 4 sides of the box.  This modification should be updated using the
 *   _updateModification method.
 */
ThemeBuilder.styles.BoxEditor.prototype._createCornerModification = function (property) {
  var childProperties;
  switch (property) {
  case 'padding':
    childProperties = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
    break;
  case 'border':
    childProperties = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    break;
  case 'margin':
    childProperties = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'];
    break;
  default:
    return undefined;
  }
  var modification = new ThemeBuilder.GroupedModification();
  for (var i = 0; i < childProperties.length; i++) {
    var child = new ThemeBuilder.CssModification(this.currentSelector);
    var propertyName = childProperties[i];
    var element = this._getElementForProperty(propertyName);
    var value = element.value;
    if (ThemeBuilder.util.isNumeric(value)) {
      value = value + 'px';
    }
    child.setPriorState(propertyName, value);
    modification.addChild(propertyName, child);
  }
  return modification;
};

/**
 * Updates the specified modification with the specified value.  If the
 * modification is ungrouped, this is the same as calling
 * modification.setNewState(modification.getPriorState().property, value);
 *
 * If the specified modification is a GroupedModification, the value change
 * will apply to all children that are not a border-style or border-color
 * change.  In effect, this changes all modifications that represent sides of
 * the box being edited.
 *
 * @param {Modification} modification
 *   The modification instance to update.
 * @param {String} value
 *   The new value
 */
ThemeBuilder.styles.BoxEditor.prototype._updateModification = function (modification, value) {
  var priorState;
  var child;
  switch (modification.getType()) {
  case ThemeBuilder.CssModification.TYPE:
    priorState = modification.getPriorState();
    modification.setNewState(priorState.property, value);
    break;
  case ThemeBuilder.GroupedModification.TYPE:
    for (var childName in modification.children) {
      if ((child = modification.getChild(childName))) {
        priorState = child.getPriorState();
        if (priorState.property !== 'border-style' && priorState.property !== 'border-color') {
          child.setNewState(priorState.property, value);
        }
      }
    }
    break;
  }
};

/**
 * Creates an appropriate Modification instance for the specified element.
 *
 * The new modification will be set into this.currentModification.
 *
 * @param {DomElement} target
 *   The element in the box UI that was clicked.
 */
ThemeBuilder.styles.BoxEditor.prototype.createBoxModification = function (target) {
  var $ = jQuery;
  var info = this.attributeTarget(target);
  if ($(target).hasClass('corner')) {
    this.currentModification = this._createCornerModification(info.attribute);
  }
  else {
    this.currentModification = new ThemeBuilder.CssModification(this.currentSelector);
    var propertyName = this._getPropertyForElement(info.target[0]);
    var getComputedStyle = ThemeBuilder.styleEditor.getComputedStyleFunction(this.getSelectedElement());
    var value = getComputedStyle(propertyName);
    this.currentModification.setPriorState(info.attribute, value);
    this.currentModification.setNewState(info.attribute, value);
  }

  // Handle border-width, as well as border-{top|right|bottom|left}-width.  If
  // If any part of the border is being modified and the style is set to
  // 'none', create a GroupedModification that includes a border style change
  // and a border width change.  This will cause both attributes to be modified
  // at the same time, and clicking undo will revert both changes.
  if (/^border/.test(info.attribute)) {
    if (jQuery('#style-border-style').val() === 'none') {
      jQuery('#style-border-style').val('solid');
      // Here we are changing both the style and the border width.  In
      // this case a GroupedModification must be used so undo will cause
      // both properties to be reverted at once.
      this.convertToGroupModification(info.attribute);
      var border = this.getNamedModification('border-style');
      if (!border) {
        // Add a modification that changes the border style.
        border = new ThemeBuilder.CssModification(this.currentSelector);
        border.setPriorState('border-style', 'none');
        border.setNewState('border-style', 'solid');
        this.currentModification.addChild('border-style', border);
      }
    }
  }
};

/**
 * Called when the slider is started.
 *
 * @param {Input slider} slider
 *   The slider instance.
 * @param {Event} event
 *   The event associated with moving the slider.
 * @param {String} value
 *   The starting value.
 * @param {DomElement} target
 *   The element the slider acts on.
 */
ThemeBuilder.styles.BoxEditor.prototype.slider_start = function (slider, event, value, target) {
  this.createBoxModification(event.currentTarget);
  return ThemeBuilder.util.stopEvent(event);
};

/**
 * Called when the slider is stopped.
 *
 * @param {Input slider} slider
 *   The slider instance.
 * @param {Event} event
 *   The event associated with moving the slider.
 * @param {String} value
 *   The final value.
 * @param {DomElement} target
 *   The element the slider acts on.
 */
ThemeBuilder.styles.BoxEditor.prototype.slider_stop = function (slider, event, value, target) {
  if (!this.currentModification) {
    return;
  }
  this._updateModification(this.currentModification, value + 'px');
  if (this.currentModification.getType() === ThemeBuilder.GroupedModification.TYPE ||
      this.currentModification.hasChanged()) {
    ThemeBuilder.applyModification(this.currentModification);
    this.currentModification = undefined;
  }
  this.attributeTarget(target).target.focus();
};

/**
 * This method sets up the tab.
 */
ThemeBuilder.styles.BoxEditor.prototype.setupTab = function () {
  var $ = jQuery;

  // Highlight the entire style if hovering over a corner element.  This applies
  // to margin, border, and padding.
  $('#themebuilder-style-spacing td.corner').
    hover(ThemeBuilder.bind(this, this._highlightBoxProperty, true),
      ThemeBuilder.bind(this, this._highlightBoxProperty, false)
    );

  $('#themebuilder-style-spacing td.corner,#themebuilder-style-spacing td.side,').inputslider({
    min: 0,
    max: 99,
    step: 1,
    autofocus: false,
    onShow: ThemeBuilder.bind(this, this.slider_show),
    onSlide: ThemeBuilder.bind(this, this.slider_slide),
    onStart: ThemeBuilder.bind(this, this.slider_start),
    onStop: ThemeBuilder.bind(this, this.slider_stop)
  });

  $('#themebuilder-style-spacing td input')
  .focusout(ThemeBuilder.bind(this, this.textEntryCommitted))
  .keyup(ThemeBuilder.bind(this, this.textEntryChanged))
  .change(ThemeBuilder.bind(this, this.textEntryCommitted));
  $('#style-border-style').change(ThemeBuilder.bind(this, this.borderStyleChanged));

  this.picker = new ThemeBuilder.styles.PalettePicker($('#style-border-color'), 'border-color', $('#themebuilder-wrapper', parent.document));

  var options = {
    min: 0,
    max: 1100,
    step: 1,
    onSlide: ThemeBuilder.bind(this, this.sizePreview),
    onStop: ThemeBuilder.bind(this, this.sizeSliderStop),
    onShow: ThemeBuilder.bind(this, this.showSizeSlider)
  };
  $('#style-element-width').inputslider(options);
  options.max = 400;
  $('#style-element-height').inputslider(options);
  $('#style-element-width, #style-element-width-u, #style-element-height, #style-element-height-u').change(ThemeBuilder.bind(this, this.sizeChanged));

};

/**
 * Initialize the element size slider.
 *
 * @param {Input slider} slider
 *   The slider instance.
 * @param {DomElement} target
 *   The element the slider is attached to.
 */
ThemeBuilder.styles.BoxEditor.prototype.showSizeSlider = function (slider, target) {
  var $ = jQuery;
  var val = $(target).val();
  if (!ThemeBuilder.util.isNumeric(val)) {
    val = '';
  }
  $(target).focus();
  slider.slider.slider('value', val);
};


/**
 * Called when a size slider has moved and the change should be displayed.
 *
 * @param {jQuerySlider} slider
 *   The slider instance.
 * @param {DomEvent} event
 *   The event associated with sliding the thumb of the slider.
 * @param {String} value
 *   The new value
 * @param {DomElement} target
 *   The target element.
 */
ThemeBuilder.styles.BoxEditor.prototype.sizePreview = function (sizer, event, value, target) {
  var $ = jQuery;
  var property = this._getSizeProperty(target.id);
  this.modifications[property].setNewState(property,
    value + $('#style-element-' + property + '-u').val());
  ThemeBuilder.preview(this.modifications[property]);
  $(target).val(value);
};

/**
 * Helper function to get the CSS property from one of the size sliders.
 */
ThemeBuilder.styles.BoxEditor.prototype._getSizeProperty = function (id) {
  var property;
  switch (id) {
  case 'style-element-width':
  case 'style-element-width-u':
    property = 'width';
    break;

  case 'style-element-height':
  case 'style-element-height-u':
    property = 'height';
    break;
  }
  return property;
};

/**
 * React to one of the size sliders stopping.
 */
ThemeBuilder.styles.BoxEditor.prototype.sizeSliderStop = function (sizer, event, value, target) {
  var $ = jQuery;
  // Trigger a change event on the input element.
  $(target).change();
};

/**
 * React to the element height or width UI elements being changed.
 */
ThemeBuilder.styles.BoxEditor.prototype.sizeChanged = function (event) {
  if (event && event.currentTarget) {
    var $ = jQuery;
    var property = this._getSizeProperty(event.currentTarget.id);
    var value = $('#style-element-' + property).val();
    if (value === 'auto') {
      value = 'auto';
    }
    else {
      var units = $('#style-element-' + property + '-u').val();
      value = value + units;
    }
    var modification = this.modifications[property];
    modification.setNewState(property, value);
    ThemeBuilder.applyModification(modification);
    this.modifications[property] = modification.getFreshModification();
    this.currentModification = undefined;
  }
};

/**
 * Called when the user selects a different border style.  This
 * function is responsible for causing the change to take effect.
 *
 * @param {DomEvent} event
 *   The event that contains the newly selected value.
 */
ThemeBuilder.styles.BoxEditor.prototype.borderStyleChanged = function (event) {
  var property = 'border-style';
  if (event && event.currentTarget) {
    var value = event.currentTarget.value;
    if (value === 'auto') {
      value = '';
    }
    var modification = this.modifications[property];
    modification.setNewState(property, value);
    ThemeBuilder.applyModification(modification);
    this.modifications[property] = modification.getFreshModification();
    this.currentModification = undefined;
  }
};

/**
 * This method is called by loadSelection when the user selects an element
 * or an item in the option control.  Here we initialize the spacing tab.
 *
 * @param {String} selector
 *   The new selector.
 */
ThemeBuilder.styles.BoxEditor.prototype.selectorChanged = function (selector) {
  var $ = jQuery;
  $('#themebuilder-style-spacing input').val('0');
  $('#themebuilder-style-spacing option').eq(0).attr('selected', true);

  this.currentSelector = selector;
  this.picker.setSelector(selector);
  this.refreshDisplay();
};

/**
 * Converts the current modification to a grouped modification.  This is
 * useful when modifying one attribute requires the modification of another
 * attribute simultaneously.  For example, changing the border width might
 * require that the style be set.
 *
 * If the current modification is already of type GroupModification, no
 * action is taken.
 *
 * @param {String} childName
 *   The name used to reference the current modification within the new group.
 */
ThemeBuilder.styles.BoxEditor.prototype.convertToGroupModification = function (childName) {
  if (!this.currentModification) {
    throw Drupal.t('The current modification has not yet been set.');
  }
  if (this.currentModification.getType() !== ThemeBuilder.GroupedModification.TYPE) {
    // Convert the current modification into a grouped modification.
    var group = new ThemeBuilder.GroupedModification();
    group.addChild(childName, this.currentModification);
    this.currentModification = group;
  }
};

/**
 * Returns the named modification if the current modification is a group.
 * Otherwise the current modification is returned.
 *
 * @param {String} childName
 *   The name of the child within the group.
 * @return
 *   The named child if the current modification is a GroupedModification,
 *   or the current modification otherwise.
 */
ThemeBuilder.styles.BoxEditor.prototype.getNamedModification = function (childName) {
  if (!this.currentModification) {
    throw Drupal.t('The current modification has not yet been set.');
  }
  if (this.currentModification.getType() === ThemeBuilder.GroupedModification.TYPE) {
    return this.currentModification.getChild(childName);
  }
  return this.currentModification;
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true AjaxUpload: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The RadioButton class turns a set of divs into radio button behavior,
 * allowing the user to toggle one of the divs on and providing the
 * associated selected value to the application for processing.  Each
 * div that represents a button must have a class associated with it,
 * which must be specified in the constructor.  Also, each button div
 * must have an element id which is the concatenation of the button
 * class and "-<value>".  In this way the id is made unique and it identifies
 * the value associated with the button.
 * 
 * @class
 */
ThemeBuilder.styles.RadioButton = ThemeBuilder.initClass();

/**
 * The constructor of the RadioButton class.  Currently the markup for the
 * buttons must be created before this call is made.  The constructor
 * identifies the set of buttons being managed by this RadioButton instance
 * and it sets the default state and wires the buttons to an appropriate
 * event handler.
 *
 * @param {String} parentSelector
 *   The selector used to identify the container that serves as the parent
 *   to all of the buttons being managed by this RadioButton instance.
 * @param {String} buttonClass
 *   The classname common to all buttons in this RadioButton set.  This is
 *   also the id prefix and the property name.
 * @param {String} defaultValue
 *   The default value.  The associated button will be set into the enabled
 *   state.
 */
ThemeBuilder.styles.RadioButton.prototype.initialize = function (parentSelector, buttonClass, defaultValue) {
  this.parentSelector = parentSelector;
  this.buttonClass = buttonClass;
  this.defaultValue = defaultValue;

  this.listeners = [];
  this.buttonPressed = ThemeBuilder.bind(this, this._buttonPressed);
  this.buttons = this.findButtons();
  this.setEnabledButton(defaultValue);
  this.addClickHandlers();
};

/**
 * Returns the property name associated with this RadioButton instance.
 *
 * @return {String}
 *   The property name.
 */
ThemeBuilder.styles.RadioButton.prototype.getPropertyName = function () {
  return this.buttonClass;
};

/**
 * Finds all of the buttons that should be managed by this RadioButton
 * instance.
 *
 * @return {object}
 *   An object that represents a mapping between the value that a button
 *   represents and the button's id, for each button being managed by
 *   this RadioButton instance.
 */
ThemeBuilder.styles.RadioButton.prototype.findButtons = function () {
  var $ = jQuery;
  var buttons = {};
  var children = $(this.parentSelector + ' .' + this.buttonClass);
  for (var i = 0; i < children.length; i++) {
    // Determine the value associated with the button.
    var value = children[i].id.substr((this.buttonClass + '-').length);
    buttons[value] = {value: value, id: '#' + children[i].id};
  }
  return buttons;
};

/**
 * Enables the button associated with the specified value.  If the specified
 * value does not have an associated button, an exception is thrown.
 *
 * @param {String} buttonValue
 *   The value identifying the button that should be enabled.
 */
ThemeBuilder.styles.RadioButton.prototype.setEnabledButton = function (buttonValue) {
  var $ = jQuery;
  var element = this.valueToElement(buttonValue);
  if (element) {
    $('.' + this.buttonClass).removeClass('enabled');
    element.addClass('enabled');
    return;
  }
  throw 'Radio button (' + this.buttonClass + ') set to unknown value "' + buttonValue + '"';
};

/**
 * Causes an appropriate click handler to be associated with each button
 * being managed by this RadioButton instance.
 */
ThemeBuilder.styles.RadioButton.prototype.addClickHandlers = function () {
  var $ = jQuery;
  for (var value in this.buttons) {
    if (this.buttons[value]) {
      $(this.buttons[value].id).click(this.buttonPressed);
    }
  }
};

/**
 * Sets the associated value.  If the value doesn't have an associated button
 * being managed by this RadioButton instance, nothing changes.  Change
 * listeners are called when the value is successfully changed.
 *
 * @param {String} newValue
 *   The value to set.
 */
ThemeBuilder.styles.RadioButton.prototype.setValue = function (newValue) {
  try {
    var oldValue = this.getValue();
    if (oldValue !== newValue) {
      this.setEnabledButton(newValue);
      this.notifyListeners(oldValue, newValue);
    }
  }
  catch (e) {
  }
};

/**
 * Returns the current value represented by the state of this Radio Button
 * instance.
 *
 * @return {String}
 *   The current value.
 */
ThemeBuilder.styles.RadioButton.prototype.getValue = function () {
  var $ = jQuery;
  var selected = $(this.parentSelector + ' .' + this.buttonClass + '.enabled');
  if (selected.length !== 1) {
    throw ('Radio button is in a bad state - ' + selected.legth +
      ' buttons are selected.');
  }
  return this.elementToValue(selected);
};

/**
 * Retrieves the value associated with the specified element.
 *
 * @param {DomObject} element
 *   The element for which the associated value should be determined.
 * @return {String}
 *   The value associated with the specified element.
 */
ThemeBuilder.styles.RadioButton.prototype.elementToValue = function (element) {
  if (element.length === 1) {
    element = element[0];
  }
  for (var value in this.buttons) {
    if (value && this.buttons[value].id === '#' + element.id) {
      return value;
    }
  }
  return undefined;
};

/**
 * Retrieves the element associated with the specified value.  If no element
 * is associated with the specified value within this RadioButton instance,
 * the value 'undefined' is returned instead.
 *
 * @param {String} value
 *   The value associated with the desired element.
 * @return {DomObject}
 *   The associated DOM element, or undefined if it doesn't exist.
 */
ThemeBuilder.styles.RadioButton.prototype.valueToElement = function (value) {
  var $ = jQuery;
  var id = '#' + this.buttonClass + '-' + value;
  var element = $(id);
  return element.length === 1 ? element : undefined;
};

/**
 * The event handler that responds when the user clicks one of the buttons.
 * This handler simply enables the associated button, and all other buttons
 * being managed by this RadioButton instance are disabled as a result.
 *
 * @param {DomEvent} event
 *   The click event.
 */
ThemeBuilder.styles.RadioButton.prototype._buttonPressed = function (event) {
  var value = this.elementToValue(event.currentTarget);
  this.setValue(value);
};

/**
 * Adds a change listener that will be notified when the user selects a
 * new value in this RadioButton instance.
 *
 * @param {Object} listener
 *   The change listener to add.
 */
ThemeBuilder.styles.RadioButton.prototype.addChangeListener = function (listener) {
  this.listeners.push(listener);
};

/**
 * Notifies all listeners that the value represented by this RadioButton
 * instance has changed to the specified value.
 *
 * @param {String} oldValue
 *   The original value.
 * @param {String} newValue
 *   The newly selected value.
 */
ThemeBuilder.styles.RadioButton.prototype.notifyListeners = function (oldValue, newValue) {
  for (var i = 0; i < this.listeners.length; i++) {
    if (this.listeners[i].valueChanged) {
      this.listeners[i].valueChanged(this.getPropertyName(), oldValue, newValue);
    }
  }
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true AjaxUpload: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * The BackgroundEditor class is responsible for the background tab.
 * @class
 * @extends ThemeBuilder.styles.Editor
 */
ThemeBuilder.styles.BackgroundEditor = ThemeBuilder.initClass();
ThemeBuilder.styles.BackgroundEditor.prototype = new ThemeBuilder.styles.Editor();

ThemeBuilder.styles.BackgroundEditor.uploadDisabledTxt = Drupal.t('Uploading...');
ThemeBuilder.styles.BackgroundEditor.uploadEnabledTxt = null;

ThemeBuilder.styles.BackgroundEditor.prototype.initialize = function (elementPicker) {
  this.elementPicker = elementPicker;
  this.tabName = "background";
  this.repeatRadioButton = new ThemeBuilder.styles.RadioButton('.background-repeat-panel', 'background-repeat', 'repeat');
  this.repeatRadioButton.addChangeListener(this);
  this.scrollRadioButton = new ThemeBuilder.styles.RadioButton('.background-attachment-panel', 'background-attachment', 'scroll');
  this.scrollRadioButton.addChangeListener(this);
  this.highlighter = ThemeBuilder.styles.Stylesheet.getInstance('highlighter.css');
};

/**
 * This method is called when the state of radio buttons is changed.  This
 * handles the repeat and scroll properties.
 *
 * @param {String} propertyName
 *   The name of the property being changed.
 * @param {String} oldValue
 *   The original value.
 * @param {String} newValue
 *   The new value.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.valueChanged = function (propertyName, oldValue, newValue) {
  var modification = new ThemeBuilder.CssModification(this.selector);
  modification.setPriorState(propertyName, oldValue);
  modification.setNewState(propertyName, newValue);
  ThemeBuilder.applyModification(modification);
};

ThemeBuilder.styles.BackgroundEditor.prototype.setThumbnail = function (image) {
  var $ = jQuery;
  if (image === "none" || !image) {
    var $background = $('#themebuilder-style-background .background-image');
    $background.css('background-image', '');
    try {
      $background.css('background-repeat', 'none');
    }
    catch (err) {
      // IE has a problem with this.
    }
    $('#themebuilder-style-background .background-image img').attr('src', "").hide();
    return;
  }
  var image_url = this.fixImage(image);
  $('<img src="' + image_url + '">').load(ThemeBuilder.bindFull(this, this._imageLoaded, true, true, image_url));
};

/**
 * This function displays the thumbnail in the themebuilder interface.
 *
 * Called when a recently set background image is loaded into the browser.
 * @private
 *
 * @param {Image} image
 *   The image object.
 * @param {String} image_url
 *   The url to the image that was loaded.
 */
ThemeBuilder.styles.BackgroundEditor.prototype._imageLoaded = function (image, image_url) {
  var $ = jQuery;
  var $image = $(image);
  var $background = $('#themebuilder-style-background .background-image');
  var $backgroundImage = $('#themebuilder-style-background .background-image img');
  if ($image.attr('width') < 75 || $image.attr('height') < 75) {
    // Use a background image
    $background.css('background-image', 'url(' + image_url + ')')
      .css('background-repeat', 'repeat');
    $backgroundImage.attr('src', "").hide();
  }
  else {
    $background.css('background-image', 'none')
      .css('background-repeat', 'none');
    $backgroundImage.attr('src', image_url).show();
  }
};

/**
 * Extracts a urlencoded image path from a CSS image property value.
 *
 * @param {string} value
 *   A CSS image property value (e.g.
 *   "url(http://example.com/sites/all/themes/mytheme/Nice image.jpg").
 *
 * @return {string}
 *   The image path (e.g. "/sites/all/themes/mytheme/Nice%20image.jpg").
 */
ThemeBuilder.styles.BackgroundEditor.prototype.cleanImage = function (value) {
  var result = value
    .replace(new RegExp('^url\\(\\"?(.+)\\"?\\)$'), "$1")
    .replace(new RegExp("^http(s)*://" + document.domain), '')
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/ /g, "%20")
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
  return result;
};

/**
 * Returns an absolute URL path to an image.
 *
 * @param value string
 *   A string in the form of url(imageurl_relative_to_theme_root).
 *
 * @return string
 */
ThemeBuilder.styles.BackgroundEditor.prototype.fixImage = function (value) {
  var imagePath = this.cleanImage(value);
  if (value && imagePath[0] === '/') { // Already an absolute URL.
    return imagePath;
  }
  return Drupal.settings.basePath + Drupal.settings.themebuilderCurrentThemePath + "/" + imagePath;
};

/**
 * Disables the controls on the background editor.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.disableInputs = function () {
  var $ = jQuery;
  $('#themebuilder-style-background select, #themebuilder-style-background select, #themebuilder-style-background button, #themebuilder-style-background input')
  .attr('disabled', true);
};

/**
 * Causes the uploader to be disabled.  This is desireable when the uploader is uploading
 * a file, thus preventing the user from interacting with it while it is busy.
 *
 * @param {String} newText
 *   Optional text that can be used to replace the button text as the uploader is disabled.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.disableUploader = function (newText) {
  var $ = jQuery;
  var button = $('#uploader');
  if (newText) {
    button.text(newText);
  }
  // @TOOD: Make this functional again.  JS disabled the disabler in demo panic.
  // AN-9040.
  this.uploader.disable();
};

/**
 * Causes the uploader to be enabled.  This reverses the actions taken when the
 * uploader was disabled.
 *
 * @param {String} newText
 *   Optional text that can be used to replace the button text.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.enableUploader = function (newText) {
  var $ = jQuery;
  if (newText) {
    $('#uploader').text(newText);
  }
  this.uploader.enable();
};

/**
 * Called when the background image has changed.  This method is responsible
 * for sending the change to the server.
 *
 * @param {string} value
 *   The new value of the background-image property.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.backgroundImageChanged = function (value, options) {
  var property = 'background-image';
  var modification = new ThemeBuilder.CssModification(this.selector);

  modification.setPriorState('background-image', this.currentImage);
  modification.setNewState(property, value);
  this.currentImage = value;
  if (options && options.setAutoHeight === true) {
    var $ = jQuery;
    // Retrieve a getComputedStyle function for the selected element that will
    // return styles excluding the blue box highlight.
    this.highlighter.disable();
    var getComputedStyle = ThemeBuilder.styleEditor.getComputedStyleFunction($(this.selector).get(0));
    this.highlighter.enable();

    var group = new ThemeBuilder.GroupedModification();
    group.addChild('image', modification);
    var height = new ThemeBuilder.CssModification(this.selector);
    height.setPriorState('height', getComputedStyle('height'));
    height.setNewState('height', options.height);
    group.addChild('height', height);
    var position = new ThemeBuilder.CssModification(this.selector);
    position.setPriorState('background-position', getComputedStyle('background-position'));
    var newPosition = '0% 0%';
    if (options.repeat === 'no-repeat') {
      newPosition = 'center';
    }
    position.setNewState('background-position', newPosition);
    group.addChild('background-position', position);
    modification = group;
  }
  ThemeBuilder.applyModification(modification);
};


/**
 * Called when the uploader is finished uploading a file.
 *
 * @param {String} file
 *   The name of the file that was uploaded.
 * @param {String} response
 *   The response code from the upload.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.uploadComplete = function (file, response) {
  var $ = jQuery;
  var elements = $(this.selector);
  if (elements.length === 1 && elements.hasClass('tb-auto-adjust-height')) {
    var image = new Image();
    image.onload = ThemeBuilder.bindIgnoreCallerArgs(this, this.imageReadyToApply, file, response, true, image);
    image.onerror = ThemeBuilder.bind(this, this.imageFailure, file, response);
    image.src = '/' + Drupal.settings.themebuilderCurrentThemePath + '/' + response;
  }
  else {
    this.imageReadyToApply(file, response, false);
  }
};

/**
 * Called if the recently uploaded image could not be loaded for any reason.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.imageFailure = function (event, file, response) {
  var $ = jQuery;
  $('#background-remove').removeClass('ui-state-disabled');
  this.enableUploader(ThemeBuilder.styles.BackgroundEditor.uploadEnabledTxt);
  if (event && event.currentTarget && event.currentTarget.src) {
    ThemeBuilder.errorHandler.logSilently('Failed to load file ' + event.currentTarget.src);
  }
};

/**
 * Called when the recently uploaded image is loaded and ready to apply
 * to the theme.
 *
 * @param {String} file
 *   A string that holds the filename of the uploaded image.
 * @param {String} response
 *   A string that holds the partial path (within the theme) of the
 *   uploaded image.
 * @param {Boolean} setAutoHeight
 *   If true, the height of the containing element will be adjusted to
 *   reflect the height of the image.
 * @param {Image} image
 *   Optional parameter that holds the Image instance if setAutoHeight
 *   is true.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.imageReadyToApply = function (file, response, setAutoHeight, image) {
  // Use a regex to make sure that this takes the form of a valid url.
  var validateRegex = "^([-a-zA-Z0-9_/. ]+)$";
  if (!response.match(validateRegex)) {
    alert("An error occurred while loading the image.  Please try again.");
    // Need to re-enable the uploader so users can actually try again
    this.enableUploader(ThemeBuilder.styles.BackgroundEditor.uploadEnabledTxt);
    return;
  }

  var $ = jQuery;
  this.enableUploader(ThemeBuilder.styles.BackgroundEditor.uploadEnabledTxt);
  // Set the background image to the upload path from the server.
  var imageValue = 'url("' + response + '")';
  //$('#themebuilder-style-background .background-image').empty();
  this.setThumbnail(response);
  var options = {};
  if (setAutoHeight === true) {
    var selectedElement = $(this.selector).get(0);
    // Retrieve a getComputedStyle function for this element that excludes
    // blue box highlighter styles.
    this.highlighter.disable();
    var getComputedStyle = ThemeBuilder.styleEditor.getComputedStyleFunction(selectedElement);
    this.highlighter.enable();

    var repeat = getComputedStyle('background-repeat');
    if (repeat === 'no-repeat' || repeat === 'repeat-x') {
      // Figure out what the size of the element should be.
      var element = $(this.selector)[0];
      var sizeOffset = ThemeBuilder.styleEditor.getTopOffset(element) +
        ThemeBuilder.styleEditor.getBottomOffset(element);
      options.height = '' + (image.height - sizeOffset) + 'px';
      options.repeat = repeat;
      options.setAutoHeight = true;
    }
  }
  this.backgroundImageChanged(imageValue, options);
  $('#background-remove').removeClass('ui-state-disabled');
};

ThemeBuilder.styles.BackgroundEditor.prototype.removeImage = function (event) {
  var $ = jQuery;
  if (!$('#background-remove').hasClass('ui-state-disabled')) {
    this.backgroundImageChanged('none');
    this.setThumbnail();
    $('#background-remove').addClass('ui-state-disabled');
    return ThemeBuilder.util.stopEvent(event);
  }
};

/**
 * Initializes the Background edit tab on the "Fonts, colors, & sizes" tab in the
 * themebuilder.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.setupTab = function () {
  var $ = jQuery;
  var that = this;
  /* @group Background Tab */
  this.disableInputs();

  this.picker = new ThemeBuilder.styles.PalettePicker($('#style-background-color'), 'background-color', $('#themebuilder-wrapper', parent.document));
  
  $('#background-remove').click(ThemeBuilder.bind(this, this.removeImage));
  var button = $('#uploader');
  ThemeBuilder.styles.BackgroundEditor.uploadEnabledTxt = Drupal.t(button.html());

  this.uploader = new AjaxUpload(button, {
    action: Drupal.settings.basePath + 'styleedit-file-upload',
    name: 'files[styleedit]',
    data: {
      'form_token': ThemeBuilder.getToken('styleedit-file-upload')
    },
    //responseType: 'json',
    onSubmit: ThemeBuilder.bindIgnoreCallerArgs(this, this.disableUploader, this.uploadDisabledText),
    onComplete: ThemeBuilder.bind(this, this.uploadComplete)
  });
};

/**
 * Refreshes the display.  This should occur when the user selects a
 * new element or when the display changes for some other reason, such
 * as clicking undo or redo.  This method looks at the current set of
 * properties for the selector and makes the property values match.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.refreshDisplay = function () {
  var selectedElement = this.getSelectedElement();

  this.highlighter.disable();
  var getComputedStyle = ThemeBuilder.styleEditor.getComputedStyleFunction(selectedElement);
  this.highlighter.enable();

  this.refreshBackgroundColor(getComputedStyle);
  this.refreshBackgroundImage(getComputedStyle);
  this.refreshBackgroundRepeat(getComputedStyle);
  this.refreshBackgroundAttachment(getComputedStyle);
};

/**
 * Refreshes the display of the color selection.
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.refreshBackgroundColor = function (getComputedStyle) {
  var color = getComputedStyle('background-color');
  if (!color) {
    color = 'transparent';
  }
  this.picker.setIndex(color);
};

/**
 * Refreshes the background image control to match the current
 * selection.
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.refreshBackgroundImage = function (getComputedStyle) {
  var $ = jQuery;
  $('#themebuilder-style-background select,#themebuilder-style-background button,#themebuilder-style-background input').attr('disabled', false);
  $('#themebuilder-style-background input').val('');
  var image = getComputedStyle('background-image');
  if (!image) {
    image = 'none';
  }
  $('#background-remove').addClass('ui-state-disabled');
  this.setThumbnail(image);
  if (image !== 'none') {
    // Enable the remove button.
    $('#background-remove').removeClass('ui-state-disabled');
  }
  this.currentImage = image;
};

/**
 * Refreshes the background-repeat control to match the current
 * selection.
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.refreshBackgroundRepeat = function (getComputedStyle) {
  var $ = jQuery;
  // Initialize the background-repeat value.
  var repeat = getComputedStyle('background-repeat');
  if (!repeat) {
    repeat = 'repeat';
  }
  // Cause the display to be updated without simulating a user click.
  this.repeatRadioButton.setEnabledButton(repeat);
};

/**
 * Refreshes the background-attachment control to match the current
 * selection.
 *
 * @param {function} getComputedStyle
 *   A getComputedStyle function specific to the currently selected element.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.refreshBackgroundAttachment = function (getComputedStyle) {
  var $ = jQuery;
  // Initialize the background-attachment value.
  var attach = getComputedStyle('background-attachment');
  if (!attach) {
    attach = 'scroll';
  }
  // Cause the display to be updated without simulating a user click.
  this.scrollRadioButton.setEnabledButton(attach);
};

/**
 * This method is called by loadSelection when the user selects an element
 * or an item in the option control.  Here we initialize the background tab.
 *
 * @param {String} selector
 *   The new selector.
 */
ThemeBuilder.styles.BackgroundEditor.prototype.selectorChanged = function (selector) {
  this.selector = selector;
  this.picker.setSelector(selector);
  this.refreshDisplay();
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * This class represents a stylesheet, such as custom.css or palette.css.
 */
ThemeBuilder.styles.Stylesheet = ThemeBuilder.initClass();

/**
 * Factory method to get an instance of a particular stylesheet.
 * 
 * @static
 * 
 * @param {string} sheetName
 *   Enough of the <link> element's href attribute to uniquely identify
 *   the stylesheet (e.g. "custom.css", "palette.css", "module/path/style.css").
 */
ThemeBuilder.styles.Stylesheet.getInstance = function (sheetName) {
  ThemeBuilder.styles.Stylesheet._sheets = ThemeBuilder.styles.Stylesheet._sheets || {};
  if (!ThemeBuilder.styles.Stylesheet._sheets[sheetName]) {
    ThemeBuilder.styles.Stylesheet._sheets[sheetName] = new ThemeBuilder.styles.Stylesheet(sheetName);
  }
  return (ThemeBuilder.styles.Stylesheet._sheets[sheetName]);
};

/**
 * Create a new <style> element.
 * 
 * We can't do this with standard jQuery methods since Internet Explorer
 * doesn't handle those well when it comes to <style> tags. See also:
 * http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
 * http://www.mail-archive.com/jquery-en@googlegroups.com/msg16487.html
 * 
 * @static
 *
 * @return
 *   The <style> DOM element.
 */
ThemeBuilder.styles.Stylesheet.createStyleElement = function () {
  var stylesheet = document.createElement('style');
  stylesheet.setAttribute("type", "text/css");
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(stylesheet);
  // We need to explicitly initialize the stylesheet object with empty CSS
  // or it won't work correctly.
  var css = '';
  if (stylesheet.styleSheet) {
    // Internet Explorer.
    try {
      stylesheet.styleSheet.cssText = ''; //css;
    }
    catch (e) {
      // IE8 no longer allows the cssText to be set.  Provide a line
      // of code as a breakpoint for debugging.
      var breakpoint = true;
    }
  }
  else {
    // Everyone else.
    var text = document.createTextNode(css);
    stylesheet.appendChild(text);
  }
  return stylesheet;
};

/**
 * Constructor for the Stylesheet class. This should not be called directly.
 *
 * @private
 *
 * @param {string} sheetName
 *   Enough of the <link> element's href attribute to uniquely identify
 *   the stylesheet (e.g. "custom.css", "palette.css", "module/path/style.css").
 */
ThemeBuilder.styles.Stylesheet.prototype.initialize = function (sheetName) {
  if (ThemeBuilder.styles.Stylesheet._sheets[sheetName]) {
    throw "ThemeBuilder.styles.Stylesheet objects should be created via ThemeBuilder.styles.Stylesheet.getInstance.";
  }
  var $ = jQuery;
  this.sheetSelector = 'link[href*=' + sheetName + ']';
  this.$sheet = $(this.sheetSelector, parent.document).eq(0);
  if (!this.$sheet.length) {
    var stylesheet = ThemeBuilder.styles.Stylesheet.createStyleElement();
    this.$sheet = jQuery(stylesheet);
  }
  this.sheet = this.$sheet.get(0);
};

/**
 * Get the rules from this stylesheet for a given selector.
 *
 * @param selector string
 *   The selector to grep for ("h1").
 * @return jQuery.rule
 */
ThemeBuilder.styles.Stylesheet.prototype.getRules = function (selector) {
  return jQuery.rule(selector, this.sheetSelector);
};

/**
 * Get all CSS rules from the stylesheet.
 */
ThemeBuilder.styles.Stylesheet.prototype.getAllCssRules = function () {
  return this.$sheet.sheet().cssRules();
};

/**
 * Add a CSS rule to this stylesheet.
 *
 * If a CSS rule already exists for the given selector, the new information will
 * be merged in as a new declaration for the existing rule.
 *
 * @param selector string
 *   The selector ("h1").
 * @param property string
 *   The property ("border-color").
 * @param value string
 *   The value ("#000000").
 */
ThemeBuilder.styles.Stylesheet.prototype.setRule = function (selector, property, value) {
  // Instead of setting an empty value in a rule, just remove the rule.
  if (value === '') {
    this.removeRule(selector, property);
    return;
  }

  var rules = this.getRules(selector);

  // If there's an existing rule for this selector, modify it.

  // KS: Tried rules.length, which Firebug thinks is a valid property, but in
  // practice it evaluates to undefined. I have no idea why.
  if (rules[0]) {
    // If there's more than one rule in the stylesheet for a given selector,
    // modify the last one.
    var rule = jQuery.rule(rules.slice(-1)[0]);

    var declarationFound = false;
    //var declarations = rule.text().replace(/;$/, '').split(";");
    var declarations = ThemeBuilder.styles.Declaration.getDeclarations(rule);
    var i;
    for (i = 0; i < declarations.length; i++) {
      if (declarations[i].property.toLowerCase() === property) {
        // We've found a previous declaration for this property. Replace it with
        // our new declaration.
        declarations[i].setProperty(property);
        declarations[i].setValue(value);
        declarationFound = true;
      }
    }
    if (!declarationFound) {
      // We'll need a new declaration for this property.
      declarations.push(new ThemeBuilder.styles.Declaration(property + ":" + value));
    }

    // Reassemble the rule's text() from the declarations we split it into.
    rule.text(ThemeBuilder.styles.Declaration.joinDeclarations(declarations));
  }
  // If there's no existing rule for this selector, create one.
  else {
    jQuery.rule(selector + "{" + property + ": " + value + ";}").appendTo(this.$sheet);
  }
};

/**
 * Remove a CSS rule.
 *
 * Note that the caller can ask to remove a property for a particular selector
 * without needing to know whether any other properties are defined for that
 * selector. In other words, given the following rule,
 *   h1 {color: #000; border-width: 2px;}
 * the caller can safely ask to remove the color property for h1. The rest of
 * the rule will stay intact.
 *
 * @param selector string
 *   The selector ("h1").
 * @param property string
 *   The property to remove ("color").
 */
ThemeBuilder.styles.Stylesheet.prototype.removeRule = function (selector, property) {
  var rules = this.getRules(selector);
  var i, j;
  // KS: Again, rules.length should work but doesn't, so no for loop for you!
  i = 0;
  while (rules[i]) {
    var declarations = ThemeBuilder.styles.Declaration.getDeclarations(rules[i]);
    // Check to see if this rule includes a declaration for our property.
    for (j = 0; j < declarations.length; j++) {
      // If there's a declaration for our property, get rid of it, but leave the
      // rest of the rule's declarations intact.
      if (declarations[j].property === property) {
        declarations[j].remove();
      }
    }
    // Reassemble the remaining declarations, to see if we still have a rule.
    var ruleText = ThemeBuilder.styles.Declaration.joinDeclarations(declarations);
    if (ruleText === '') {
      jQuery.rule(rules[i]).remove();
    } else {
      jQuery.rule(rules[i]).text(ruleText);
    }
    i++;
  }
};

/**
 * Disable the stylesheet.
 */
ThemeBuilder.styles.Stylesheet.prototype.disable = function () {
  this.$sheet.attr('disabled', 'disabled');
};

ThemeBuilder.styles.Stylesheet.prototype.enable = function () {
  this.$sheet.removeAttr('disabled');
};

/**
 * Remove the entire contents of a stylesheet.
 */
ThemeBuilder.styles.Stylesheet.prototype.clear = function () {
  var rules = this.getAllCssRules();
  jQuery.rule(rules).remove();
};

/**
 * Rewrite the stylesheet's color-related rules according to a given palette.
 *
 * @param {Palette} oldPalette
 *   A Palette object representing the existing colors.
 * @param {Palette} newPalette
 *   The new Palette object.
 */
ThemeBuilder.styles.Stylesheet.prototype.replacePalette = function (oldPalette, newPalette) {
  var i, j;
  var rules = this.getAllCssRules();
  for (i in rules) {
    if (ThemeBuilder.util.isNumeric(i)) {
      // Get a jQuery.rule object for the CSS rule we're editing.
      var rule = jQuery.rule(rules[i]);
      // Split the rule into declarations.
      var declarations = ThemeBuilder.styles.Declaration.getDeclarations(rule);
      for (j in declarations) {
        if (ThemeBuilder.util.isNumeric(j)) {
          declarations[j].replaceColor(oldPalette, newPalette);
        }
      }
      // Rewrite the rule with the new hex color.
      rule.text(ThemeBuilder.styles.Declaration.joinDeclarations(declarations));
    }
  }

};

/**
 * Set the contents of a stylesheet.
 *
 * TODO AN-14564: This only works with empty stylesheets created via
 * ThemeBuilder.styles.Stylesheet.prototype.createStyleElement().
 */
ThemeBuilder.styles.Stylesheet.prototype.setCssText = function (cssText) {
  cssText = cssText.toString();
  if (this.sheet.styleSheet) {
    // Internet Explorer.
    if (!cssText) {
      // For some reason, the browser crashes if we don't explicitly set
      // cssText to an empty string in this case.
      cssText = '';
    }
    try {
      this.sheet.styleSheet.cssText = cssText;
    }
    catch (e) {
      // IE8 is not allowing us to set the value of the cssText
      // property.  Provide a line of code as a breakpoint for
      // debugging.
      var breakpoint = true;
    }
  }
  else {
    // Everyone else.
    if (!this.sheet.firstChild) {
      this.sheet.appendChild(document.createTextNode(cssText));
    }
    else {
      this.sheet.replaceChild(document.createTextNode(cssText), this.sheet.firstChild);
    }
  }
};

/**
 * Returns the css rules as text.
 *
 * @return
 *   A string containing the text representation of the css rules associated
 *   with this stylesheet instance.
 */
ThemeBuilder.styles.Stylesheet.prototype.getCssText = function () {
  return this.cssRulesToText(this.getAllCssRules());
};

/**
 * Converts the specified rules into a text representation.
 *
 * @param cssRules
 *   The css rules to convert into text.
 * @return
 *   The text representation of the specified rules.
 */
ThemeBuilder.styles.Stylesheet.prototype.cssRulesToText = function (cssRules) {
  var result = '';
  if (cssRules && cssRules.length) {
    for (var i = 0; i < cssRules.length; i++) {
      result += cssRules[i].cssText + "\n";
    }
  }
  return result;
};

/**
 * Adds the specified rules to this stylesheet instance.
 *
 * @param {String array} rules
 *   The text form of the css rules.
 * @return
 *   An integer that identifies the number of rules added to this stylesheet
 *   instance.
 */
ThemeBuilder.styles.Stylesheet.prototype.addRules = function (rules) {
  var result = 0;
  var ruleCount = rules.length;
  for (var i = 0; i < ruleCount; i++) {
    var rule = rules[i];
    if (rule && rule.length > 0) {
      jQuery.rule(rule).appendTo(this.$sheet);
      result++;
    }
  }
  return result;
};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.styles = ThemeBuilder.styles || {};

/**
 * This class represents a CSS declaration (such as "border-width: 1px;").
 * @class
 */
ThemeBuilder.styles.Declaration = ThemeBuilder.initClass();

/**
 * The constructor for the Declaration class.
 *
 * @param {string} declarationText
 *   The declaration text ("background-image: url(https://domain/image.jpg);").
 */
ThemeBuilder.styles.Declaration.prototype.initialize = function (declarationText) {
  if (declarationText) {
    var pieces = declarationText.split(":");
    // The property is the section to the left of the first colon. Example:
    // background-image
    this.property = jQuery.trim(pieces.shift());
    // The entire remaining string, including any colons that were originally
    // in it, is the value. Example:
    //   url(https://domain:8080/image.jpg);
    this.value = pieces.join(':');
    // Remove the trailing semicolon and any stray whitespace remaining in the
    // value. Example:
    // url(https://domain:8080/image.jpg)
    var re = new RegExp('\\s*(.+);\\s*$');
    this.value = this.value.replace(re, '$1');
  }
  else {
    this.property = this.value = "";
  }
  this.toRemove = false;
};

/**
 * Static method to split a rule's declaration block into Declarations.
 */
ThemeBuilder.styles.Declaration.getDeclarations = function (rule) {
  var ruleText = jQuery.rule(rule).text();
  // Split the rule into individual declaration lines, without semicolons.
  var declarations = ruleText.replace(/;$/, '').split(";");
  var i;
  var declarationObjects = [];
  for (i = 0; i < declarations.length; i++) {
    declarationObjects[i] = new ThemeBuilder.styles.Declaration(declarations[i]);
  }
  return declarationObjects;
};

/**
 * Static method to join declarations into one declaration block.
 *
 * @return string
 *   A CSS declaration block ("border-width: 2px; border-color: #000000;").
 */
ThemeBuilder.styles.Declaration.joinDeclarations = function (declarations) {
  var i;
  var declarationText = "";
  for (i = 0; i < declarations.length; i++) {
    declarationText += declarations[i].toString();
  }
  return declarationText;
};

/**
 * Set a delete flag on the Declaration object.
 */
ThemeBuilder.styles.Declaration.prototype.remove = function () {
  this.toRemove = true;
};

/**
 * Return a declaration as text that can be added to a CSS rule.
 *
 * @return string
 *   A CSS declaration in text form ("border-width: 2px;").
 */
ThemeBuilder.styles.Declaration.prototype.toString = function () {
  if (this.toRemove) {
    return "";
  }
  else {
    return this.property + ": " + this.value + ";";
  }
};

/**
 * Set the declaration's property ("border-width").
 */
ThemeBuilder.styles.Declaration.prototype.setProperty = function (property) {
  this.property = jQuery.trim(property);
};

/**
 * Set the declaration's value ("2px").
 */
ThemeBuilder.styles.Declaration.prototype.setValue = function (value) {
  if (value instanceof String !== true) {
    value = "" + value;
  }
  this.value = jQuery.trim(value);
};

/**
 * Convert a declaration from one palette to another.
 * 
 * @param {Palette} oldPalette
 * @param {Palette} newPalette
 */
ThemeBuilder.styles.Declaration.prototype.replaceColor = function (oldPalette, newPalette) {
  if (this.property.toLowerCase().indexOf('color') !== -1) {
    var colorManager = ThemeBuilder.getColorManager();
    var hex;
    if (this.value === 'transparent') {
      hex = 'transparent';
    }
    else {
      if (this.value.indexOf('rgb') !== -1) {
        // Standards-compliant browsers.
        var matches = this.value.match(new RegExp('rgb\\((.+),\\s?(.+),\\s?(.+)\\)'));
        hex = ThemeBuilder.styleEditor.RGBToHex({
          r: parseInt(matches[1], 10),
          g: parseInt(matches[2], 10),
          b: parseInt(matches[3], 10)
        });
      }
      else if (this.value.indexOf('#') === 0) {
        // IE.
        hex = this.value.substr(1, 6);
      }
      else {
        // This doesn't appear to be a real color-related declaration.
        // Do nothing to change it.
        return;
      }
    }
    var paletteIndex = oldPalette.hexToPaletteIndex(hex);
    if (paletteIndex) {
      var newHex = newPalette.paletteIndexToHex(paletteIndex);
      newHex = colorManager.addHash(newHex);
      // Replace the declaration's value.
      this.setValue(newHex);
    }
    else {
      // If the old color wasn't in the old palette, it didn't belong in
      // palette.css in the first place. Don't rewrite it.
    }
  }

};
;

/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * The SwatchModification is a subclass of the abstract Modification class.  An
 * instance of this class can hold a modification to a swatch in a palette such
 * that it can be applied and reverted.
 * @class
 * @extends ThemeBuilder.Modification
 */
ThemeBuilder.SwatchModification = ThemeBuilder.initClass();

// Subclass the Modification class.
ThemeBuilder.SwatchModification.prototype = new ThemeBuilder.Modification();

/**
 * The type string that indicates this is a swatch modification.
 */
ThemeBuilder.SwatchModification.TYPE = 'swatch';
ThemeBuilder.registerModificationClass('SwatchModification');

/**
 * This static method returns a correctly initialized SwatchModification
 * instance that contains the specified prior state and new state.  Enough
 * checking is performed to ensure that the newly instantiated object is valid.
 *
 * @return
 *   A new instance of SwatchModification that contains the specified prior
 *   state and new state.
 */
ThemeBuilder.SwatchModification.create = function (priorState, newState) {
  if (ThemeBuilder.SwatchModification.TYPE !== priorState.type) {
    throw 'Cannot create a SwatchModification from state type ' + priorState.type;
  }

  var instance = new ThemeBuilder.SwatchModification(priorState.index, priorState.hex);
  instance.setPriorState(priorState.index, priorState.hex);
  if (newState) {
    instance.setNewState(newState.index, newState.hex);
  }
  return instance;
};

/**
 * The constructor for the SwatchModification class.  This initializes the type
 * and palette id for the modification.  You should never call this method
 * directly, but rather use code such as:
 * <pre>
 *   var modification = new PaletteModification();
 * </pre>
 *
 * @param selector
 *   Where to apply the palette change. For the entire site, this should be
 *   'global'.
 */
ThemeBuilder.SwatchModification.prototype.initialize = function (selector) {
  ThemeBuilder.Modification.prototype.initialize.call(this, selector);
  this.type = ThemeBuilder.SwatchModification.TYPE;
};

/**
 * Creates a simple object that encapsulates a state (either a prior state or
 * a new state) which will be associated with this modification instance.
 *
 * @param property string
 *   The property name.
 *
 * @param value string
 *   The value associated with the property.
 */
ThemeBuilder.SwatchModification.prototype.createState = function (index, hex) {
  return {
    'index' : index,
    'hex' : hex
  };
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true */

var ThemeBuilder = ThemeBuilder || {};
ThemeBuilder.styleEditor = ThemeBuilder.styleEditor || {};

ThemeBuilder.styleEditor.getPaletteStylesheet = function () {
  if (jQuery.rule) {
    return jQuery('link[href*=palette.css]').sheet();
  } else {
    return false;
  }
};

ThemeBuilder.styleEditor.changePalette = function (new_palette_id) {
  console.warn("ThemeBuilder.styleEditor.changePalette is deprecated. Use a PaletteModification instead.");
  // Validate palette_id.
  if (!ThemeBuilder.styleEditor.palettes[new_palette_id]) {
    alert("That palette does not exist.");
    return false;
  }

  ThemeBuilder.styleEditor.previewNewPalette(new_palette_id, ThemeBuilder.styleEditor.currentPalette);

  // Let Javascript know what the new palette id is.
  ThemeBuilder.styleEditor.currentPalette = new_palette_id;
  // Let the server know what the new palette id is.
  ThemeBuilder.postBack(Drupal.settings.styleSetPalettePath,
    {'palette_id': new_palette_id});
};



/**
 * Converts HSB to RGB.
 *
 * Taken from colorpicker.js.
 *
 * @param <object> hsb
 * @return <object>
 */
ThemeBuilder.styleEditor.HSBToRGB = function (hsb) {
  var rgb = {};
  var h = Math.round(hsb.h);
  var s = Math.round(hsb.s * 255 / 100);
  var v = Math.round(hsb.b * 255 / 100);
  if (s === 0) {
    rgb.r = rgb.g = rgb.b = v;
  } else {
    var t1 = v;
    var t2 = (255 - s) * v / 255;
    var t3 = (t1 - t2) * (h % 60) / 60;
    if (h === 360) {
      h = 0;
    }
    if (h < 60) {
      rgb.r = t1;
      rgb.b = t2;
      rgb.g = t2 + t3;
    }
    else if (h < 120) {
      rgb.g = t1;
      rgb.b = t2;
      rgb.r = t1 - t3;
    }
    else if (h < 180) {
      rgb.g = t1;
      rgb.r = t2;
      rgb.b = t2 + t3;
    }
    else if (h < 240) {
      rgb.b = t1;
      rgb.r = t2;
      rgb.g = t1 - t3;
    }
    else if (h < 300) {
      rgb.b = t1;
      rgb.g = t2;
      rgb.r = t2 + t3;
    }
    else if (h < 360) {
      rgb.r = t1;
      rgb.g = t2;
      rgb.b = t1 - t3;
    }
    else {
      rgb.r = 0;
      rgb.g = 0;
      rgb.b = 0;
    }
  }
  return { r: Math.round(rgb.r),
           g: Math.round(rgb.g),
           b: Math.round(rgb.b) };
};

/**
 * Converts RGB to a hex value.
 *
 * Taken from colorpicker.js.
 *
 * @param <object> rgb
 * @return <string>
 *   The hex color value (i.e. FFFFFF).
 */
ThemeBuilder.styleEditor.RGBToHex = function (rgb) {
  if (typeof(rgb.r) === 'undefined') {
    if (rgb.indexOf('(') !== -1) {
      rgb = rgb.replace(/^rgb\(/g, '').replace(/\)$/g, '').split(/, */g);
      rgb = {
        r: parseInt(rgb[0], 10),
        g: parseInt(rgb[1], 10),
        b: parseInt(rgb[2], 10)
      };
    }
  }
  var hex = [
    rgb.r.toString(16),
    rgb.g.toString(16),
    rgb.b.toString(16)
  ];
  jQuery.each(hex, function (nr, val) {
    if (val.length === 1) {
      hex[nr] = '0' + val;
    }
  });
  return hex.join('');
};

/**
 * Converts HSB to a hex value.
 *
 * Taken from colorpicker.js.
 *
 * @param <object> hsb
 * @return <string>
 *   The hex color value (i.e. FFFFFF).
 */
ThemeBuilder.styleEditor.HSBToHex = function (hsb) {
  return ThemeBuilder.styleEditor.RGBToHex(ThemeBuilder.styleEditor.HSBToRGB(hsb));
};
;
// $Id$

/*jslint bitwise: true, eqeqeq: false, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true*/

/* Change above to white: true, indent: 2 after getting the other important
   stuff.  Also, change eqeqeq back to true.  Saving this for last as it
   has potential to change behavior in unexpected ways.  Saving the indentation
   to be committed after the rest of the team knows.  Otherwise there will be
   numerous svn conflicts if we work on the same file.*/


var ThemeBuilder = ThemeBuilder || {};

/**
 * @namespace
 */
ThemeBuilder.styleEditor = ThemeBuilder.styleEditor || {};

/**
 * @class
 */
Drupal.behaviors.styleEditor = {
  attach: function (context, settings) {
    jQuery('#themebuilder-style').bind('init', ThemeBuilder.styleEditor.init);
  }
};

ThemeBuilder.styleEditor.rules = [];
ThemeBuilder.styleEditor.selecting = false;
ThemeBuilder.styleEditor.hoverrule = null;
ThemeBuilder.styleEditor.hovershow = false;
ThemeBuilder.styleEditor.styling = false;
ThemeBuilder.styleEditor.modifications = {};
ThemeBuilder.styleEditor.currentTab = 'font';
ThemeBuilder.addModificationHandler(ThemeBuilder.CssModification.TYPE, ThemeBuilder.styleEditor);

/**
 * The themebuilder_bar module calls the init method after it's finished
 * loading the html for the "Fonts, colors and sizes" tab.
 */
ThemeBuilder.styleEditor.init = function () {
  var that = this;
  var $ = jQuery;

  // Create the sub-tabs under the main "Fonts, colors & sizes" tab.
  var editors = ["fontEditor", "boxEditor", "backgroundEditor"];
  $('#themebuilder-style').tabs({
    select: function (event, ui) {
      var tab_name = ui.panel.id.split('-').slice(-1)[0];
      var editor;
      for (var index in editors) {
        if (typeof(index) === 'string') {
          editor = that[editors[index]];
          if (editor) {
            if (false === editor.tabSelectionChanged(tab_name)) {
              return false;
            }
          }
        }
      }
      that.currentTab = tab_name;
      return true;
    },
    show: function (event, ui) {
      return true;
    }
  });
  this.elementPicker = new ThemeBuilder.styles.ElementPicker();
  this.fontEditor = new ThemeBuilder.styles.FontEditor(this.elementPicker);
  this.fontEditor.setupTab();
  this.boxEditor = new ThemeBuilder.styles.BoxEditor(this.elementPicker);
  this.boxEditor.setupTab();
  this.backgroundEditor = new ThemeBuilder.styles.BackgroundEditor(this.elementPicker);
  this.backgroundEditor.setupTab();

  // When the user is hovering over a selectable element, and then moves
  // to the themebuilder pane, quit highlighting it as clickable.
  $('#themebuilder-main').mouseover(this.elementPicker.hideHoverHighlight);
};

/**
 * Called when the contents for this tab have been loaded.  If the showOnLoad
 * method has been called, this will invoke the show method.
 */
ThemeBuilder.styleEditor.loaded = function () {
  this._isLoaded = true;
  if (this._showOnLoad === true) {
    this.show();
  }
};

/**
 * Returns a flag that indicates whether the contents for this tab have been
 * loaded.
 *
 * @return {boolean}
 *   true if the contents have been loaded; false otherwise.
 */
ThemeBuilder.styleEditor.isLoaded = function () {
  return this._isLoaded === true;
};

/**
 * Sets a flag that causes this tab to be displayed as soon as the contents
 * have been loaded.
 */
ThemeBuilder.styleEditor.showOnLoad = function () {
  this._showOnLoad = true;
};

/**
 * generic ThemeBuilder Tab function overrides: setTab, show, hide
 */
ThemeBuilder.styleEditor.setTab = function (i) {
  var $ = jQuery;
  if ($('#themebuilder-style').tabs('option', 'selected') === i) {
    return;
  }
  $('#themebuilder-style').tabs('select', i);
};

/**
 * Called when the associated tab is selected by the user and the tab's
 * contents are to be displayed.
 */
ThemeBuilder.styleEditor.show = function () {
  var $ = jQuery;
  var $currentSelection;
  if (!this.isLoaded()) {
    // Not ready to actually show anything yet.
    this.showOnLoad();
  }
  else {
    // Registering elements in the ElementPicker takes a fair bit of time.  Do
    // that after the tab has been switched to minimize the visual delay
    // during tab changes.
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this.elementPicker, this.elementPicker.registerElements), 150);

    $currentSelection = $(ThemeBuilder.util.getSelector());
    if ($currentSelection.size() > 0) {
      // The current selector refers to at least one element on the
      // current page.  Select that element by default.
      // TODO: We need to use the current selector if possible.
      setTimeout(function () {
        $($currentSelection.get(0)).triggerHandler('click');
      }, 200);
    }
  }
  return true;
};

ThemeBuilder.styleEditor.hide = function () {
  // Unregistering elements in the ElementPicker takes a fair bit of time.  Do
  // that after the tab has been switched to minimize the visual delay during
  // tab changes.
  if (this.elementPicker) {
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this.elementPicker, this.elementPicker.unregisterElements), 150);
  }
};

/**
 * This function is responsible for updating the themebuilder display
 * when a modification is applied.
 **/
ThemeBuilder.styleEditor.processModification = function (modification, state) {
  if (this.fontEditor) {
    this.fontEditor.refreshDisplay();
  }
  if (this.boxEditor) {
    this.boxEditor.refreshDisplay();
  }
  if (this.backgroundEditor) {
    this.backgroundEditor.refreshDisplay();
  }
};

/**
 * Create a hidden dummy node used to ascertain current CSS properties.
 *    used by ThemeBuilder.styles.FontEditor.prototype.selectorChanged in @FontEditor.js
 *    to supplement already known properties
 *
 * @param <string> selector
 */
ThemeBuilder.styleEditor.makeDummyNode = function (selector) {
  var $ = jQuery;
  var items = selector.split(' ');
  var node = 'body';
  var first = null;
  for (var it = 0; it < items.length; it++) {
    var parts = items[it].split('.');
    if (parts[0] === '' || parts[0][0] === '#') {
      node = $('<div></div>').appendTo(node);
    }
    else {
      node = $('<' + parts[0] + '></' + parts[0] + '>').appendTo(node);
    }
    if (!first) {
      first = node;
    }
    node.css('display', 'none');
    if (parts[0][0] === '#') {
      node.attr('id', parts[0].slice(1));
    }
    for (var i = 1; i < parts.length; i++) {
      node.addClass(parts[i]);
    }
  }
  var oldremove = first.remove;
  /**
   * @ignore
   */
  node.remove = function () {
    return oldremove.apply(first);
  };
  return node;
};

/**
 * Applies the specified modification description to the client side only.
 * This allows the user to preview the modification without committing it
 * to the theme.  Useful when sliding, selecting colors, etc.
 *
 * @param desc object
 *   The modification description.  To get this value, you should pass in
 *   the result of Modification.getNewState() or Modification.getPriorState().
 */
ThemeBuilder.styleEditor.preview = function (desc) {
  var $ = jQuery;
  var hexValue;
  if (!desc || !desc.selector || !desc.property) {
    return false;
  }
  desc.value = desc.value === undefined ? "" : desc.value;

  /**
   * JS: I don't like this too much... seems hardcoded and hacky.
   * I wonder if we shouldn't just pass the actual value?
   */
  if (this.backgroundEditor && (typeof desc.value).toLowerCase() == 'string' && desc.value.indexOf('url(') === 0) {
    desc.value = 'url(' + this.backgroundEditor.fixImage(desc.value) + ')';
  }
  var stylesheet;

  // Handle the case in which a color rule is being deleted.
  if (desc.value === '') {
    stylesheet = ThemeBuilder.styles.Stylesheet.getInstance('palette.css');
    stylesheet.removeRule(desc.selector, desc.property);
    stylesheet = ThemeBuilder.styles.Stylesheet.getInstance('custom.css');
    stylesheet.removeRule(desc.selector, desc.property);
    return;
  }
  
  // Handle palette indexes.
  if ((typeof desc.value).toLowerCase() == 'string' && desc.value.indexOf("{") !== -1) {
    // Convert the palette index to a hex code.
    var colorManager = ThemeBuilder.getColorManager();
    hexValue = colorManager.paletteIndexToHex(desc.value);
    // Only continue with the preview if we had a valid palette index.
    if (hexValue) {
      hexValue = colorManager.addHash(hexValue);
    }
    else {
      return false;
    }
    // Add the new rule to palette.css.
    stylesheet = ThemeBuilder.styles.Stylesheet.getInstance('palette.css');
    stylesheet.setRule(desc.selector, desc.property, hexValue);
    // Remove it from custom.css.
    stylesheet = ThemeBuilder.styles.Stylesheet.getInstance('custom.css');
    stylesheet.removeRule(desc.selector, desc.property);
  }
  // If the value wasn't a palette index, pass it into custom.css.
  else {
    stylesheet = ThemeBuilder.styles.Stylesheet.getInstance('custom.css');
    stylesheet.setRule(desc.selector, desc.property, desc.value);
  }

  // All border-related properties need to appear in the same stylesheet, for
  // IE's benefit. See AN-12796.
  if ($.browser.msie && desc.property.indexOf('border') > -1) {
    stylesheet = ThemeBuilder.styles.Stylesheet.getInstance('border.css');
    stylesheet.setRule(desc.selector, desc.property, hexValue || desc.value);
  }

  // If we are changing a background property, disable the highlighter.
  if (desc.property.indexOf('background') !== -1) {
    var highlighter = ThemeBuilder.styles.Stylesheet.getInstance('highlighter.css');
    highlighter.disable();
  }
  if (this.elementPicker) {
    this.elementPicker.domNavigator.updateDisplay();
  }
};
;
/*!
 * jCarousel - Riding carousels with jQuery
 *   http://sorgalla.com/jcarousel/
 *
 * Copyright (c) 2006 Jan Sorgalla (http://sorgalla.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 * Inspired by the "Carousel Component" by Bill Scott
 *   http://billwscott.com/carousel/
 */

/*global window, jQuery */
(function($) {
    // Default configuration properties.
    var defaults = {
        vertical: false,
        rtl: false,
        start: 1,
        offset: 1,
        size: null,
        scroll: 3,
        visible: null,
        animation: 'normal',
        easing: 'swing',
        auto: 0,
        wrap: null,
        initCallback: null,
        setupCallback: null,
        reloadCallback: null,
        itemLoadCallback: null,
        itemFirstInCallback: null,
        itemFirstOutCallback: null,
        itemLastInCallback: null,
        itemLastOutCallback: null,
        itemVisibleInCallback: null,
        itemVisibleOutCallback: null,
        animationStepCallback: null,
        buttonNextHTML: '<div></div>',
        buttonPrevHTML: '<div></div>',
        buttonNextEvent: 'click',
        buttonPrevEvent: 'click',
        buttonNextCallback: null,
        buttonPrevCallback: null,
        itemFallbackDimension: null
    }, windowLoaded = false;

    $(window).bind('load.jcarousel', function() { windowLoaded = true; });

    /**
     * The jCarousel object.
     *
     * @constructor
     * @class jcarousel
     * @param e {HTMLElement} The element to create the carousel for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/jCarousel
     */
    $.jcarousel = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});

        this.locked          = false;
        this.autoStopped     = false;

        this.container       = null;
        this.clip            = null;
        this.list            = null;
        this.buttonNext      = null;
        this.buttonPrev      = null;
        this.buttonNextState = null;
        this.buttonPrevState = null;

        // Only set if not explicitly passed as option
        if (!o || o.rtl === undefined) {
            this.options.rtl = ($(e).attr('dir') || $('html').attr('dir') || '').toLowerCase() == 'rtl';
        }

        this.wh = !this.options.vertical ? 'width' : 'height';
        this.lt = !this.options.vertical ? (this.options.rtl ? 'right' : 'left') : 'top';

        // Extract skin class
        var skin = '', split = e.className.split(' ');

        for (var i = 0; i < split.length; i++) {
            if (split[i].indexOf('jcarousel-skin') != -1) {
                $(e).removeClass(split[i]);
                skin = split[i];
                break;
            }
        }

        if (e.nodeName.toUpperCase() == 'UL' || e.nodeName.toUpperCase() == 'OL') {
            this.list      = $(e);
            this.clip      = this.list.parents('.jcarousel-clip');
            this.container = this.list.parents('.jcarousel-container');
        } else {
            this.container = $(e);
            this.list      = this.container.find('ul,ol').eq(0);
            this.clip      = this.container.find('.jcarousel-clip');
        }

        if (this.clip.size() === 0) {
            this.clip = this.list.wrap('<div></div>').parent();
        }

        if (this.container.size() === 0) {
            this.container = this.clip.wrap('<div></div>').parent();
        }

        if (skin !== '' && this.container.parent()[0].className.indexOf('jcarousel-skin') == -1) {
            this.container.wrap('<div class=" '+ skin + '"></div>');
        }

        this.buttonPrev = $('.jcarousel-prev', this.container);

        if (this.buttonPrev.size() === 0 && this.options.buttonPrevHTML !== null) {
            this.buttonPrev = $(this.options.buttonPrevHTML).appendTo(this.container);
        }

        this.buttonPrev.addClass(this.className('jcarousel-prev'));

        this.buttonNext = $('.jcarousel-next', this.container);

        if (this.buttonNext.size() === 0 && this.options.buttonNextHTML !== null) {
            this.buttonNext = $(this.options.buttonNextHTML).appendTo(this.container);
        }

        this.buttonNext.addClass(this.className('jcarousel-next'));

        this.clip.addClass(this.className('jcarousel-clip')).css({
            position: 'relative'
        });

        this.list.addClass(this.className('jcarousel-list')).css({
            overflow: 'hidden',
            position: 'relative',
            top: 0,
            margin: 0,
            padding: 0
        }).css((this.options.rtl ? 'right' : 'left'), 0);

        this.container.addClass(this.className('jcarousel-container')).css({
            position: 'relative'
        });

        if (!this.options.vertical && this.options.rtl) {
            this.container.addClass('jcarousel-direction-rtl').attr('dir', 'rtl');
        }

        var di = this.options.visible !== null ? Math.ceil(this.clipping() / this.options.visible) : null;
        var li = this.list.children('li');

        var self = this;

        if (li.size() > 0) {
            var wh = 0, j = this.options.offset;
            li.each(function() {
                self.format(this, j++);
                wh += self.dimension(this, di);
            });

            this.list.css(this.wh, (wh + 100) + 'px');

            // Only set if not explicitly passed as option
            if (!o || o.size === undefined) {
                this.options.size = li.size();
            }
        }

        // For whatever reason, .show() does not work in Safari...
        this.container.css('display', 'block');
        this.buttonNext.css('display', 'block');
        this.buttonPrev.css('display', 'block');

        this.funcNext   = function() { self.next(); };
        this.funcPrev   = function() { self.prev(); };
        this.funcResize = function() { 
            if (self.resizeTimer) {
                clearTimeout(self.resizeTimer);
            }

            self.resizeTimer = setTimeout(function() {
                self.reload();
            }, 100);
        };

        if (this.options.initCallback !== null) {
            this.options.initCallback(this, 'init');
        }

        if (!windowLoaded && $.browser.safari) {
            this.buttons(false, false);
            $(window).bind('load.jcarousel', function() { self.setup(); });
        } else {
            this.setup();
        }
    };

    // Create shortcut for internal use
    var $jc = $.jcarousel;

    $jc.fn = $jc.prototype = {
        jcarousel: '0.2.8'
    };

    $jc.fn.extend = $jc.extend = $.extend;

    $jc.fn.extend({
        /**
         * Setups the carousel.
         *
         * @method setup
         * @return undefined
         */
        setup: function() {
            this.first       = null;
            this.last        = null;
            this.prevFirst   = null;
            this.prevLast    = null;
            this.animating   = false;
            this.timer       = null;
            this.resizeTimer = null;
            this.tail        = null;
            this.inTail      = false;

            if (this.locked) {
                return;
            }

            this.list.css(this.lt, this.pos(this.options.offset) + 'px');
            var p = this.pos(this.options.start, true);
            this.prevFirst = this.prevLast = null;
            this.animate(p, false);

            $(window).unbind('resize.jcarousel', this.funcResize).bind('resize.jcarousel', this.funcResize);

            if (this.options.setupCallback !== null) {
                this.options.setupCallback(this);
            }
        },

        /**
         * Clears the list and resets the carousel.
         *
         * @method reset
         * @return undefined
         */
        reset: function() {
            this.list.empty();

            this.list.css(this.lt, '0px');
            this.list.css(this.wh, '10px');

            if (this.options.initCallback !== null) {
                this.options.initCallback(this, 'reset');
            }

            this.setup();
        },

        /**
         * Reloads the carousel and adjusts positions.
         *
         * @method reload
         * @return undefined
         */
        reload: function() {
            if (this.tail !== null && this.inTail) {
                this.list.css(this.lt, $jc.intval(this.list.css(this.lt)) + this.tail);
            }

            this.tail   = null;
            this.inTail = false;

            if (this.options.reloadCallback !== null) {
                this.options.reloadCallback(this);
            }

            if (this.options.visible !== null) {
                var self = this;
                var di = Math.ceil(this.clipping() / this.options.visible), wh = 0, lt = 0;
                this.list.children('li').each(function(i) {
                    wh += self.dimension(this, di);
                    if (i + 1 < self.first) {
                        lt = wh;
                    }
                });

                this.list.css(this.wh, wh + 'px');
                this.list.css(this.lt, -lt + 'px');
            }

            this.scroll(this.first, false);
        },

        /**
         * Locks the carousel.
         *
         * @method lock
         * @return undefined
         */
        lock: function() {
            this.locked = true;
            this.buttons();
        },

        /**
         * Unlocks the carousel.
         *
         * @method unlock
         * @return undefined
         */
        unlock: function() {
            this.locked = false;
            this.buttons();
        },

        /**
         * Sets the size of the carousel.
         *
         * @method size
         * @return undefined
         * @param s {Number} The size of the carousel.
         */
        size: function(s) {
            if (s !== undefined) {
                this.options.size = s;
                if (!this.locked) {
                    this.buttons();
                }
            }

            return this.options.size;
        },

        /**
         * Checks whether a list element exists for the given index (or index range).
         *
         * @method get
         * @return bool
         * @param i {Number} The index of the (first) element.
         * @param i2 {Number} The index of the last element.
         */
        has: function(i, i2) {
            if (i2 === undefined || !i2) {
                i2 = i;
            }

            if (this.options.size !== null && i2 > this.options.size) {
                i2 = this.options.size;
            }

            for (var j = i; j <= i2; j++) {
                var e = this.get(j);
                if (!e.length || e.hasClass('jcarousel-item-placeholder')) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Returns a jQuery object with list element for the given index.
         *
         * @method get
         * @return jQuery
         * @param i {Number} The index of the element.
         */
        get: function(i) {
            return $('>.jcarousel-item-' + i, this.list);
        },

        /**
         * Adds an element for the given index to the list.
         * If the element already exists, it updates the inner html.
         * Returns the created element as jQuery object.
         *
         * @method add
         * @return jQuery
         * @param i {Number} The index of the element.
         * @param s {String} The innerHTML of the element.
         */
        add: function(i, s) {
            var e = this.get(i), old = 0, n = $(s);

            if (e.length === 0) {
                var c, j = $jc.intval(i);
                e = this.create(i);
                while (true) {
                    c = this.get(--j);
                    if (j <= 0 || c.length) {
                        if (j <= 0) {
                            this.list.prepend(e);
                        } else {
                            c.after(e);
                        }
                        break;
                    }
                }
            } else {
                old = this.dimension(e);
            }

            if (n.get(0).nodeName.toUpperCase() == 'LI') {
                e.replaceWith(n);
                e = n;
            } else {
                e.empty().append(s);
            }

            this.format(e.removeClass(this.className('jcarousel-item-placeholder')), i);

            var di = this.options.visible !== null ? Math.ceil(this.clipping() / this.options.visible) : null;
            var wh = this.dimension(e, di) - old;

            if (i > 0 && i < this.first) {
                this.list.css(this.lt, $jc.intval(this.list.css(this.lt)) - wh + 'px');
            }

            this.list.css(this.wh, $jc.intval(this.list.css(this.wh)) + wh + 'px');

            return e;
        },

        /**
         * Removes an element for the given index from the list.
         *
         * @method remove
         * @return undefined
         * @param i {Number} The index of the element.
         */
        remove: function(i) {
            var e = this.get(i);

            // Check if item exists and is not currently visible
            if (!e.length) {
                return;
            }

            var d = this.dimension(e);

            if (i < this.first) {
                this.list.css(this.lt, $jc.intval(this.list.css(this.lt)) + d + 'px');
            }

            e.hide('slow', function () { $(this).remove(); });

            this.list.css(this.wh, $jc.intval(this.list.css(this.wh)) - d + 'px');
        },

        /**
         * Moves the carousel forwards.
         *
         * @method next
         * @return undefined
         */
        next: function() {
            if (this.tail !== null && !this.inTail) {
                this.scrollTail(false);
            } else {
                this.scroll(((this.options.wrap == 'both' || this.options.wrap == 'last') && this.options.size !== null && this.last == this.options.size) ? 1 : this.first + this.options.scroll);
            }
        },

        /**
         * Moves the carousel backwards.
         *
         * @method prev
         * @return undefined
         */
        prev: function() {
            if (this.tail !== null && this.inTail) {
                this.scrollTail(true);
            } else {
                this.scroll(((this.options.wrap == 'both' || this.options.wrap == 'first') && this.options.size !== null && this.first == 1) ? this.options.size : this.first - this.options.scroll);
            }
        },

        /**
         * Scrolls the tail of the carousel.
         *
         * @method scrollTail
         * @return undefined
         * @param b {Boolean} Whether scroll the tail back or forward.
         */
        scrollTail: function(b) {
            if (this.locked || this.animating || !this.tail) {
                return;
            }

            this.pauseAuto();

            var pos  = $jc.intval(this.list.css(this.lt));

            pos = !b ? pos - this.tail : pos + this.tail;
            this.inTail = !b;

            // Save for callbacks
            this.prevFirst = this.first;
            this.prevLast  = this.last;

            this.animate(pos);
        },

        /**
         * Scrolls the carousel to a certain position.
         *
         * @method scroll
         * @return undefined
         * @param i {Number} The index of the element to scoll to.
         * @param a {Boolean} Flag indicating whether to perform animation.
         */
        scroll: function(i, a) {
            if (this.locked || this.animating) {
                return;
            }

            this.pauseAuto();
            this.animate(this.pos(i), a);
        },

        /**
         * Prepares the carousel and return the position for a certian index.
         *
         * @method pos
         * @return {Number}
         * @param i {Number} The index of the element to scoll to.
         * @param fv {Boolean} Whether to force last item to be visible.
         */
        pos: function(i, fv) {
            var pos  = $jc.intval(this.list.css(this.lt));

            if (this.locked || this.animating) {
                return pos;
            }

            if (this.options.wrap != 'circular') {
                i = i < 1 ? 1 : (this.options.size && i > this.options.size ? this.options.size : i);
            }

            var back = this.first > i;

            // Create placeholders, new list width/height
            // and new list position
            var f = this.options.wrap != 'circular' && this.first <= 1 ? 1 : this.first;
            var c = back ? this.get(f) : this.get(this.last);
            var j = back ? f : f - 1;
            var e = null, l = 0, p = false, d = 0, g;

            while (back ? --j >= i : ++j < i) {
                e = this.get(j);
                p = !e.length;
                if (e.length === 0) {
                    e = this.create(j).addClass(this.className('jcarousel-item-placeholder'));
                    c[back ? 'before' : 'after' ](e);

                    if (this.first !== null && this.options.wrap == 'circular' && this.options.size !== null && (j <= 0 || j > this.options.size)) {
                        g = this.get(this.index(j));
                        if (g.length) {
                            e = this.add(j, g.clone(true));
                        }
                    }
                }

                c = e;
                d = this.dimension(e);

                if (p) {
                    l += d;
                }

                if (this.first !== null && (this.options.wrap == 'circular' || (j >= 1 && (this.options.size === null || j <= this.options.size)))) {
                    pos = back ? pos + d : pos - d;
                }
            }

            // Calculate visible items
            var clipping = this.clipping(), cache = [], visible = 0, v = 0;
            c = this.get(i - 1);
            j = i;

            while (++visible) {
                e = this.get(j);
                p = !e.length;
                if (e.length === 0) {
                    e = this.create(j).addClass(this.className('jcarousel-item-placeholder'));
                    // This should only happen on a next scroll
                    if (c.length === 0) {
                        this.list.prepend(e);
                    } else {
                        c[back ? 'before' : 'after' ](e);
                    }

                    if (this.first !== null && this.options.wrap == 'circular' && this.options.size !== null && (j <= 0 || j > this.options.size)) {
                        g = this.get(this.index(j));
                        if (g.length) {
                            e = this.add(j, g.clone(true));
                        }
                    }
                }

                c = e;
                d = this.dimension(e);
                if (d === 0) {
                    throw new Error('jCarousel: No width/height set for items. This will cause an infinite loop. Aborting...');
                }

                if (this.options.wrap != 'circular' && this.options.size !== null && j > this.options.size) {
                    cache.push(e);
                } else if (p) {
                    l += d;
                }

                v += d;

                if (v >= clipping) {
                    break;
                }

                j++;
            }

             // Remove out-of-range placeholders
            for (var x = 0; x < cache.length; x++) {
                cache[x].remove();
            }

            // Resize list
            if (l > 0) {
                this.list.css(this.wh, this.dimension(this.list) + l + 'px');

                if (back) {
                    pos -= l;
                    this.list.css(this.lt, $jc.intval(this.list.css(this.lt)) - l + 'px');
                }
            }

            // Calculate first and last item
            var last = i + visible - 1;
            if (this.options.wrap != 'circular' && this.options.size && last > this.options.size) {
                last = this.options.size;
            }

            if (j > last) {
                visible = 0;
                j = last;
                v = 0;
                while (++visible) {
                    e = this.get(j--);
                    if (!e.length) {
                        break;
                    }
                    v += this.dimension(e);
                    if (v >= clipping) {
                        break;
                    }
                }
            }

            var first = last - visible + 1;
            if (this.options.wrap != 'circular' && first < 1) {
                first = 1;
            }

            if (this.inTail && back) {
                pos += this.tail;
                this.inTail = false;
            }

            this.tail = null;
            if (this.options.wrap != 'circular' && last == this.options.size && (last - visible + 1) >= 1) {
                var m = $jc.intval(this.get(last).css(!this.options.vertical ? 'marginRight' : 'marginBottom'));
                if ((v - m) > clipping) {
                    this.tail = v - clipping - m;
                }
            }

            if (fv && i === this.options.size && this.tail) {
                pos -= this.tail;
                this.inTail = true;
            }

            // Adjust position
            while (i-- > first) {
                pos += this.dimension(this.get(i));
            }

            // Save visible item range
            this.prevFirst = this.first;
            this.prevLast  = this.last;
            this.first     = first;
            this.last      = last;

            return pos;
        },

        /**
         * Animates the carousel to a certain position.
         *
         * @method animate
         * @return undefined
         * @param p {Number} Position to scroll to.
         * @param a {Boolean} Flag indicating whether to perform animation.
         */
        animate: function(p, a) {
            if (this.locked || this.animating) {
                return;
            }

            this.animating = true;

            var self = this;
            var scrolled = function() {
                self.animating = false;

                if (p === 0) {
                    self.list.css(self.lt,  0);
                }

                if (!self.autoStopped && (self.options.wrap == 'circular' || self.options.wrap == 'both' || self.options.wrap == 'last' || self.options.size === null || self.last < self.options.size || (self.last == self.options.size && self.tail !== null && !self.inTail))) {
                    self.startAuto();
                }

                self.buttons();
                self.notify('onAfterAnimation');

                // This function removes items which are appended automatically for circulation.
                // This prevents the list from growing infinitely.
                if (self.options.wrap == 'circular' && self.options.size !== null) {
                    for (var i = self.prevFirst; i <= self.prevLast; i++) {
                        if (i !== null && !(i >= self.first && i <= self.last) && (i < 1 || i > self.options.size)) {
                            self.remove(i);
                        }
                    }
                }
            };

            this.notify('onBeforeAnimation');

            // Animate
            if (!this.options.animation || a === false) {
                this.list.css(this.lt, p + 'px');
                scrolled();
            } else {
                var o = !this.options.vertical ? (this.options.rtl ? {'right': p} : {'left': p}) : {'top': p};
                // Define animation settings.
                var settings = {
                    duration: this.options.animation,
                    easing:   this.options.easing,
                    complete: scrolled
                };
                // If we have a step callback, specify it as well.
                if ($.isFunction(this.options.animationStepCallback)) {
                    settings.step = this.options.animationStepCallback;
                }
                // Start the animation.
                this.list.animate(o, settings);
            }
        },

        /**
         * Starts autoscrolling.
         *
         * @method auto
         * @return undefined
         * @param s {Number} Seconds to periodically autoscroll the content.
         */
        startAuto: function(s) {
            if (s !== undefined) {
                this.options.auto = s;
            }

            if (this.options.auto === 0) {
                return this.stopAuto();
            }

            if (this.timer !== null) {
                return;
            }

            this.autoStopped = false;

            var self = this;
            this.timer = window.setTimeout(function() { self.next(); }, this.options.auto * 1000);
        },

        /**
         * Stops autoscrolling.
         *
         * @method stopAuto
         * @return undefined
         */
        stopAuto: function() {
            this.pauseAuto();
            this.autoStopped = true;
        },

        /**
         * Pauses autoscrolling.
         *
         * @method pauseAuto
         * @return undefined
         */
        pauseAuto: function() {
            if (this.timer === null) {
                return;
            }

            window.clearTimeout(this.timer);
            this.timer = null;
        },

        /**
         * Sets the states of the prev/next buttons.
         *
         * @method buttons
         * @return undefined
         */
        buttons: function(n, p) {
            if (n == null) {
                n = !this.locked && this.options.size !== 0 && ((this.options.wrap && this.options.wrap != 'first') || this.options.size === null || this.last < this.options.size);
                if (!this.locked && (!this.options.wrap || this.options.wrap == 'first') && this.options.size !== null && this.last >= this.options.size) {
                    n = this.tail !== null && !this.inTail;
                }
            }

            if (p == null) {
                p = !this.locked && this.options.size !== 0 && ((this.options.wrap && this.options.wrap != 'last') || this.first > 1);
                if (!this.locked && (!this.options.wrap || this.options.wrap == 'last') && this.options.size !== null && this.first == 1) {
                    p = this.tail !== null && this.inTail;
                }
            }

            var self = this;

            if (this.buttonNext.size() > 0) {
                this.buttonNext.unbind(this.options.buttonNextEvent + '.jcarousel', this.funcNext);

                if (n) {
                    this.buttonNext.bind(this.options.buttonNextEvent + '.jcarousel', this.funcNext);
                }

                this.buttonNext[n ? 'removeClass' : 'addClass'](this.className('jcarousel-next-disabled')).attr('disabled', n ? false : true);

                if (this.options.buttonNextCallback !== null && this.buttonNext.data('jcarouselstate') != n) {
                    this.buttonNext.each(function() { self.options.buttonNextCallback(self, this, n); }).data('jcarouselstate', n);
                }
            } else {
                if (this.options.buttonNextCallback !== null && this.buttonNextState != n) {
                    this.options.buttonNextCallback(self, null, n);
                }
            }

            if (this.buttonPrev.size() > 0) {
                this.buttonPrev.unbind(this.options.buttonPrevEvent + '.jcarousel', this.funcPrev);

                if (p) {
                    this.buttonPrev.bind(this.options.buttonPrevEvent + '.jcarousel', this.funcPrev);
                }

                this.buttonPrev[p ? 'removeClass' : 'addClass'](this.className('jcarousel-prev-disabled')).attr('disabled', p ? false : true);

                if (this.options.buttonPrevCallback !== null && this.buttonPrev.data('jcarouselstate') != p) {
                    this.buttonPrev.each(function() { self.options.buttonPrevCallback(self, this, p); }).data('jcarouselstate', p);
                }
            } else {
                if (this.options.buttonPrevCallback !== null && this.buttonPrevState != p) {
                    this.options.buttonPrevCallback(self, null, p);
                }
            }

            this.buttonNextState = n;
            this.buttonPrevState = p;
        },

        /**
         * Notify callback of a specified event.
         *
         * @method notify
         * @return undefined
         * @param evt {String} The event name
         */
        notify: function(evt) {
            var state = this.prevFirst === null ? 'init' : (this.prevFirst < this.first ? 'next' : 'prev');

            // Load items
            this.callback('itemLoadCallback', evt, state);

            if (this.prevFirst !== this.first) {
                this.callback('itemFirstInCallback', evt, state, this.first);
                this.callback('itemFirstOutCallback', evt, state, this.prevFirst);
            }

            if (this.prevLast !== this.last) {
                this.callback('itemLastInCallback', evt, state, this.last);
                this.callback('itemLastOutCallback', evt, state, this.prevLast);
            }

            this.callback('itemVisibleInCallback', evt, state, this.first, this.last, this.prevFirst, this.prevLast);
            this.callback('itemVisibleOutCallback', evt, state, this.prevFirst, this.prevLast, this.first, this.last);
        },

        callback: function(cb, evt, state, i1, i2, i3, i4) {
            if (this.options[cb] == null || (typeof this.options[cb] != 'object' && evt != 'onAfterAnimation')) {
                return;
            }

            var callback = typeof this.options[cb] == 'object' ? this.options[cb][evt] : this.options[cb];

            if (!$.isFunction(callback)) {
                return;
            }

            var self = this;

            if (i1 === undefined) {
                callback(self, state, evt);
            } else if (i2 === undefined) {
                this.get(i1).each(function() { callback(self, this, i1, state, evt); });
            } else {
                var call = function(i) {
                    self.get(i).each(function() { callback(self, this, i, state, evt); });
                };
                for (var i = i1; i <= i2; i++) {
                    if (i !== null && !(i >= i3 && i <= i4)) {
                        call(i);
                    }
                }
            }
        },

        create: function(i) {
            return this.format('<li></li>', i);
        },

        format: function(e, i) {
            e = $(e);
            var split = e.get(0).className.split(' ');
            for (var j = 0; j < split.length; j++) {
                if (split[j].indexOf('jcarousel-') != -1) {
                    e.removeClass(split[j]);
                }
            }
            e.addClass(this.className('jcarousel-item')).addClass(this.className('jcarousel-item-' + i)).css({
                'float': (this.options.rtl ? 'right' : 'left'),
                'list-style': 'none'
            }).attr('jcarouselindex', i);
            return e;
        },

        className: function(c) {
            return c + ' ' + c + (!this.options.vertical ? '-horizontal' : '-vertical');
        },

        dimension: function(e, d) {
            var el = $(e);

            if (d == null) {
                return !this.options.vertical ?
                       (el.outerWidth(true) || $jc.intval(this.options.itemFallbackDimension)) :
                       (el.outerHeight(true) || $jc.intval(this.options.itemFallbackDimension));
            } else {
                var w = !this.options.vertical ?
                    d - $jc.intval(el.css('marginLeft')) - $jc.intval(el.css('marginRight')) :
                    d - $jc.intval(el.css('marginTop')) - $jc.intval(el.css('marginBottom'));

                $(el).css(this.wh, w + 'px');

                return this.dimension(el);
            }
        },

        clipping: function() {
            return !this.options.vertical ?
                this.clip[0].offsetWidth - $jc.intval(this.clip.css('borderLeftWidth')) - $jc.intval(this.clip.css('borderRightWidth')) :
                this.clip[0].offsetHeight - $jc.intval(this.clip.css('borderTopWidth')) - $jc.intval(this.clip.css('borderBottomWidth'));
        },

        index: function(i, s) {
            if (s == null) {
                s = this.options.size;
            }

            return Math.round((((i-1) / s) - Math.floor((i-1) / s)) * s) + 1;
        }
    });

    $jc.extend({
        /**
         * Gets/Sets the global default configuration properties.
         *
         * @method defaults
         * @return {Object}
         * @param d {Object} A set of key/value pairs to set as configuration properties.
         */
        defaults: function(d) {
            return $.extend(defaults, d || {});
        },

        intval: function(v) {
            v = parseInt(v, 10);
            return isNaN(v) ? 0 : v;
        },

        windowLoaded: function() {
            windowLoaded = true;
        }
    });

    /**
     * Creates a carousel for all matched elements.
     *
     * @example $("#mycarousel").jcarousel();
     * @before <ul id="mycarousel" class="jcarousel-skin-name"><li>First item</li><li>Second item</li></ul>
     * @result
     *
     * <div class="jcarousel-skin-name">
     *   <div class="jcarousel-container">
     *     <div class="jcarousel-clip">
     *       <ul class="jcarousel-list">
     *         <li class="jcarousel-item-1">First item</li>
     *         <li class="jcarousel-item-2">Second item</li>
     *       </ul>
     *     </div>
     *     <div disabled="disabled" class="jcarousel-prev jcarousel-prev-disabled"></div>
     *     <div class="jcarousel-next"></div>
     *   </div>
     * </div>
     *
     * @method jcarousel
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.jcarousel = function(o) {
        if (typeof o == 'string') {
            var instance = $(this).data('jcarousel'), args = Array.prototype.slice.call(arguments, 1);
            return instance[o].apply(instance, args);
        } else {
            return this.each(function() {
                var instance = $(this).data('jcarousel');
                if (instance) {
                    if (o) {
                        $.extend(instance.options, o);
                    }
                    instance.reload();
                } else {
                    $(this).data('jcarousel', new $jc(this, o));
                }
            });
        }
    };

})(jQuery);
;
(function ($) {
// The remove and format functions do not work properly in the jcarousel
// plugin. So we overwrite them.
if ($.isFunction($.jcarousel)) {
  $.jcarousel.fn.extend({
    // Add is broken in the plugin. We fix it here. 
    add: function(s, i) {
      var pivot, carousel = this.list, items = carousel.find('.jcarousel-item'), item = $(s);
      // Prepend the item before the index passed in
      if (i && i >= 0) {
        pivot = items.get(i);
        pivot.before(item);
        item.css({visibility: 'hidden'});
      }
      // Otherwise tack it on the end if no index is passed in
      else {
        items.filter(':last').after(item);
        item.css({visibility: 'hidden'});
      }
      // Renumber the carousel items
      var _renumerate = ThemeBuilder.bind(this, this.renumerate, 'add', item);
      // Scroll to the new item
      // this.scroll((items.length + 1), true);
      // Make the item visible, then hide it, then show it slowly.
      item.css({visibility: 'visible'}).hide().show('slow', _renumerate);
    },
    remove: function (i) {
      var e = this.get(i);

      // The actual remove() call happens in renumerate because the hide() call takes time
      // and the renumeration can't happen until this operation completes. So it's necessary
      // to call remove() from the hide() callback.
      var _renumerate = ThemeBuilder.bind(this, this.renumerate, 'remove', e);
      e.hide('slow', _renumerate);
    },
    // This is a new function that correctly sets the number of carousel items and
    // re-classes them according to their updated index positions.
    renumerate: function (action, e) {
      // Lock the scrolling buttons
      this.lock();

      if (typeof action === "string") {
        switch (action) {
        case "remove":
          e.remove();
          this.options.size--;
          break;
        case "add":
          this.options.size++;
          break;
        default:
          break;
        }
      }

      var li = this.list.children('li');
      var self = this;

      if (li.length > 0) {
        var wh = 0, i = this.options.offset;
        li.each(function () {
          self.format(this, i++);
          wh += self.dimension(this, null);
        });

        this.list.css(this.wh, wh + 'px');
      }
      li.filter(':last-child').addClass('last');
      // Unlock the scrolling buttons
      this.unlock();
    },
    format: function (e, i) {
      // remove all class names matches 'jcarousel-item' at the start
      $(e)[0].className = $(e)[0].className.replace(/\bjcarousel\-item\-\d+\b/g, '');
      // add new class names  
      var $e = $(e).addClass('jcarousel-item').addClass('jcarousel-item-' + i);
      $e.attr('jcarouselindex', i);
      return $e;
    },
    // The scroll function is overridden because there is no way to pass in 
    // the second parameter (true) to the pos() function to force it to show
    // the complete item that is scrolled to
    scroll: function(i, a) {
      if (this.locked || this.animating) {
        return;
      }

      this.pauseAuto();
      this.animate(this.pos(i, true), a);
    }
  });
}
})(jQuery);;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true debug: true Drupal: true window: true */

var ThemeBuilder = ThemeBuilder || {};

/**
 * @class
 */
Drupal.behaviors.editThemes = {
  attach: function (context, settings) {
    var $ = jQuery;
    var $themebuilderMain = $('#themebuilder-main');

    $themebuilderMain.bind('save', function (e, data) {
      // If the server tells us that a screenshot has been scheduled as a
      // result of the new theme being saved (which is normally expected if
      // themebuilder_screenshot.module is enabled), start polling the server
      // so we can update our theme listing once the screenshot is ready.
      if (data.theme_screenshot_scheduled) {
        ThemeBuilder.getApplicationInstance().startPolling('themebuilder_screenshot');
      }
    });

    // This event is triggered on application initialization, if the server has
    // pending screenshot requests that still need to be processed (for
    // example, from a previous themebuilder session). If that's the case,
    // start polling the server so we can get the new screenshot (and update
    // our theme listing with it) as soon as it's ready.
    $themebuilderMain.bind('theme_screenshots_scheduled', function (e) {
      ThemeBuilder.getApplicationInstance().startPolling('themebuilder_screenshot');
    });

    // This event is triggered when we've been trying to poll the server for
    // new screenshots to add to our theme listing, but the server tells us
    // that no more are available. In that case, we can stop polling the
    // server.
    $themebuilderMain.bind('theme_screenshots_complete', function (e) {
      ThemeBuilder.getApplicationInstance().stopPolling('themebuilder_screenshot');
    });
  }
};

/**
 * @class
 */
ThemeBuilder.themeSelector = {
  carousels: {
    base: null,
    custom: null
  },
  deadnode: null,
  currentTheme: null,
  showing: false,
  themeChanged: false,
  themeSwitching: false,
  /**
   * Magically named function that's called the first time the Themes tab is loaded.
   */
  init: function () {
    var app = ThemeBuilder.getApplicationInstance();
    // Set the current theme.
    this.currentTheme = Drupal.settings.currentTheme;
    // Draw the UI as soon as we have application data.
    app.addApplicationInitializer(ThemeBuilder.bind(this, this.drawUI));
    // Refresh the UI whenever the application data changes.
    app.addUpdateListener(ThemeBuilder.bind(this, this.refreshUI));
  },
  /**
   * Draw the initial UI.
   *
   * @param data
   *   Application data from ThemeBuilder.getApplicationInstance().
   */
  drawUI: function (data) {
    var $ = jQuery;
    var i, theme, $actions, $tab, $ul, $li;
    var carousels = {};
    var tabs = {};
    var panel = $('#themebuilder-themes');
    // Set the published theme and selected theme
    this.publishedTheme = data.published_theme;
    this.selectedTheme = data.selectedTheme;
    // Add the Choose new theme link
    var chooseNewTheme = ThemeBuilder.bind(this, this.chooseNewTheme);
    var actionList = new ThemeBuilder.ui.ActionList(
      {
        actions: [
          {
            label: Drupal.t('+ Choose a new theme'),
            action: chooseNewTheme
          }
        ]
      }
    );
    // Add the theme tab's actions. Create a top-level-tab actions container
    $('<div>', {
      id: "themebuilder-themes-actions"
    }).append(
      $('<span>', {
        html: Drupal.t('Saved themes')
      }).addClass('header'),
      actionList.getPointer()
    )
    .addClass('secondary-actions horizontal')
    .prependTo(panel);
    // Create the markup for the two carousels.
    var types = ['mythemes', 'featured'];
    for (i = 0; i < types.length; i++) {
      $tab = $('<div>', {
        id: 'themebuilder-themes-' + types[i]
      })
      .addClass('mode');
      if (i > 0) {
        $tab.smartToggle();
      }
      $tab.appendTo(panel);
      $ul = $('<ul>').addClass('carousel');
      $('<div>').addClass('carousel-wrap carousel-themes punch-out').append($ul).appendTo($tab);
      tabs[types[i]] = $tab;
      carousels[types[i]] = $ul;
    }
    // Create a tile for each theme and put it in the proper carousel.
    for (i = 0; i < data.themes.length; i++) {
      theme = data.themes[i];
      $ul = carousels[theme.type];
      if (!$ul) {
        continue;
      }
      $li = this.getThemeTile(theme, this.selectedTheme === theme.system_name, data.published_theme === theme.system_name);
      $li.appendTo($ul);
    }
    // Initialize the carousels.
    this.carousels.base = $('#themebuilder-themes-featured .carousel').jcarousel();
    this.carousels.custom = $('#themebuilder-themes-mythemes .carousel').jcarousel();

    // Add the last class to the last carousel item
    this.carousels.base.find('li:last-child').addClass('last');
    this.carousels.custom.find('li:last-child').addClass('last');

    // Invoke the feature theme modal interaction. If the page was created from choosing a new
    // theme, this will cause the featured theme modal interaction to be active.
    ThemeBuilder.themes.FeaturedThemeInteraction.invoke();

    // Create the flyout links menu
    var themes = data.themes;
    var len = themes.length;
    for (i = 0; i < len; i++) {
      theme = themes[i];
      this.buildThemeActionList(theme);
    }
  },
  /**
   * Return markup for one entry in the theme carousel.
   */
  getThemeTile: function (theme, selected, live) {
    var $ = jQuery;
    var tile, img, authorLine, meta = '';
    var li = $('<li>', {
      id: 'themetile_' + theme.system_name
    });
    tile = $('<div>', {
      click: ThemeBuilder.bindIgnoreCallerArgs(this, this.switchTheme, theme.system_name)
    }).addClass('theme-shot')
      .appendTo(li);
    if (selected) {
      tile.addClass('applied');
    }
    if (live) {
      tile.addClass('live');
    }
    
    //Add the last modified info if this is not a base theme.
    if (!theme.is_base) {
      $('<div>', {
        html: Drupal.t('Saved ') + ThemeBuilder.util.niceTime(theme.time_current, theme.time_last_saved)
      }).addClass('last-saved')
        .appendTo(tile);
    }
    
    // Add the image.
    $('<img>', {
      src: theme.screenshot_url
    }).addClass('image')
      .appendTo(tile);
      
    // Add the flag.
    $('<div>')
      .addClass('flag')
      .appendTo(tile);
      
    // Add the preview hover div, and tile hover action.
    if (theme.is_base) {
      $('<div>')
        .addClass('preview')
        .append($("<span>", {
          html: Drupal.t("Preview")
        })).hide()
        .appendTo(tile);

      tile.mouseenter(function () {
          $(this).find(".preview").show();
        })
        .mouseleave(function () {
          $(this).find(".preview").hide();
        });
    }
    
    // Add the label.
    $('<div>', {
      html: theme.name,
      name: theme.system_name
    }).addClass('label')
      .appendTo(tile);
    
    return li;
  },
  show: function () {
    return true;
  },
  hide: function () {
    return true;
  },
  checkChanges: function () {
    var $ = jQuery;
    if (ThemeBuilder.Bar.getInstance().exitConfirm()) {
      $.ajax({
        url: Drupal.settings.themeSavePath,
        data: {
          'form_token': Drupal.settings.themeSaveToken,
          'discard': true
        },
        async: false,
        dataType: 'json',
        success: function (x) {
          if (x.error) {
            alert('An error occurred discarding session data: ' + x.error);
          }
        },
        error: function (x, status, error) {
          alert('Error: ' + status + error);
        },
        type: 'POST'
      });
    }
    else {
      return false;
    }
  },
  /**
   * Switch between view modes of this tab
   */
  chooseNewTheme: function (e, active) {
    e.preventDefault();
    // Make sure the user wants to discard any changes before entering the
    // featured themes modal.
    if (ThemeBuilder.Bar.getInstance().exitConfirm()) {
      this.modal = new ThemeBuilder.themes.FeaturedThemeInteraction();
      this.modal.start();
    }
  },
  switchTheme: function (theme) {
    if (this.themeSwitching) {
      return;
    }
    this.themeSwitching = true;

    // Switching themes takes a bit of time; display the loading image.
    var bar = ThemeBuilder.Bar.getInstance();
    bar.showWaitIndicator();
    // Ask for confirmation when discarding a dirty theme, unless we're in the
    // featured theme modal dialog, where the user has already confirmed.
    var inModal = (this.modal && this.modal.getCurrentState() === 'ready') ? true : false;
    if (!inModal && !bar.exitConfirm()) {
      bar.hideWaitIndicator();
      this.themeSwitching = false;
      return;
    }
    bar.disableThemebuilder();

    // Do the theme switch and the cache clear simultaneously, but
    // don't refresh the page until both are done.
    this._stacksCleared = false;
    this._themeChanged = false;
    this._newThemeName = theme;
    ThemeBuilder.postBack('themebuilder-start', {'theme_name': this._newThemeName}, ThemeBuilder.bind(this, this.themeChangeSuccess), ThemeBuilder.bind(this, this.themeChangeFail));
    ThemeBuilder.clearModificationStacks(this.currentTheme, ThemeBuilder.bind(this, this.stackClearSuccess), ThemeBuilder.bind(this, this.stackClearFail));
  },
  /**
   * Build the action list for a theme in the carousel. The action list for a
   * theme depends on what actions it is allowed to call.
   */
  buildThemeActionList: function (theme) {
    var $ = jQuery;
    var actions, $themeTile;
    // Create the flyout list menu
    if (!theme.is_base) {
      actions = this.getThemeActions(theme.system_name);
      $themeTile = $('#' + theme.dom_id);
      // Build and attach the flyout list to the UI
      var $flyoutList = $themeTile.flyoutList({
        items: actions
      }).find('.flyout-list');
      // Add a handler to the action list to deal with interactions
      this.registerActionList(theme.system_name, $themeTile, $flyoutList, actions);
    }
  },
  /**
   * The list of all actions that a theme might have access to.
   *
   * @param {String} theme_name
   *   The system name of the theme
   */
  getThemeActions: function (theme_name) {
    var actions = [];
    // Make live
    actions.push({
      label: Drupal.t('Publish'),
      linkClasses: [(theme_name === this.publishedTheme) ? 'disabled' : '', 'action-publish']
    });
    // Duplicate
    actions.push({
      label: Drupal.t('Duplicate'),
      linkClasses: ['action-duplicate']
    });
    // Delete action
    actions.push({
      label: Drupal.t('Delete'),
      linkClasses: [((theme_name === this.publishedTheme) || (theme_name === this.selectedTheme)) ? 'disabled' : '', 'action-delete']
    });
    // Push more actions into the actions array as needed...

    return actions;
  },

  /**
   * Attaches handlers to the list of actions in a theme's action list
   *
   * @param {String} system_name
   *   The system name of the theme
   * @param {Array} $themeTile
   *    A jQuery object pointer to the theme tile in the theme carousel list
   * @param {Array} $flyoutList
   *    A jQuery object pointer to the flyout list being registered
   * @param {Array} actions
   *    A list of actions to be included in this flyout list
   */
  registerActionList: function (system_name, $themeTile, $flyoutList, actions) {
    var theme = ThemeBuilder.Theme.getTheme(system_name);
    $flyoutList.click(ThemeBuilder.bind(this, this.flyoutPanelClicked, theme, {tileId: $themeTile.attr('id'), actions: actions}));
  },

  /**
   * Called when any item on the flyout panel is clicked.
   * 
   * @param {Event} event
   *   The click event
   * @param {Theme} theme
   *    The Theme instance that represents the theme associated with
   *    the clicked flyout menu.
   * @param {Object} info
   *    Additional information associated with the flyout menu that
   *    may be useful.
   */
  flyoutPanelClicked: function (event, theme, info) {
    var $ = jQuery;
    var $target = $(event.target);
    var actionCallbacks;
    var action;
    // isLive is the last attempt to stop a user from deleting their published
    // theme. The 'disabled' class on the delete action of a published theme
    // should prevent it from being clicked in the first place.
    var isLive = $target.closest('.flyout-list-context').find('.theme-shot').hasClass('live');
    if ($target.hasClass('disabled')) {
      return ThemeBuilder.util.stopEvent(event);
    }
    if ($target.hasClass('action-publish')) {
      actionCallbacks = {
        success: ThemeBuilder.bind(this, this.themePublished),
        fail: ThemeBuilder.bind(this, this.themePublishFailed)
      };
      action = ThemeBuilder.bind(theme, theme.publishTheme, actionCallbacks);
      ThemeBuilder.Bar.getInstance().showWaitIndicator();
      theme.publishTheme(actionCallbacks);
    }
    if ($target.hasClass('action-duplicate')) {
      // Ask the user for the new theme name.
      var duplicate = new ThemeBuilder.themes.DuplicateInteraction(theme);
      var newThemeName = Drupal.t('@theme copy', {'@theme': theme.getName()});
      var data = {
        name: newThemeName
      };
      duplicate.start(data);
    }
    if ($target.hasClass('action-delete') && !isLive) {
      // Confirm that the user wants to delete this theme
      var del = new ThemeBuilder.themes.DeleteInteraction(theme);
      del.start();
    }
    return ThemeBuilder.util.stopEvent(event);
  },

  /**
   * The callback for a successful theme publish.
   *
   * @param {Theme} theme
   *    The Theme instance that was published.
   */
  themePublished: function (theme) {
    var $ = jQuery;
    var bar = ThemeBuilder.Bar.getInstance();
    bar.hideWaitIndicator();
    bar.setStatus(Drupal.t('%theme is now the live theme.', {'%theme': theme.getName()}));
    //Mark the right tile as being live and having the delete function disabled.
    var oldPublishedThemeShot = $('#themebuilder-themes-mythemes .live');
    // Remove the live class
    oldPublishedThemeShot.removeClass('live');
    // Remove the disabled classes as appropriate
    var actionsList = oldPublishedThemeShot.parent().find('.flyout-list');
    actionsList.find('.action-publish').removeClass('disabled');
    if (!oldPublishedThemeShot.hasClass('applied')) {
      actionsList.find('.action-delete').removeClass('disabled');
    }
    // Process the active theme tile
    var newPublishedThemeTile = $('#themetile_' + theme.getSystemName());
    newPublishedThemeTile.find('.theme-shot').addClass('live');
    newPublishedThemeTile.find('.action-delete').addClass('disabled');
    newPublishedThemeTile.find('.action-publish').addClass('disabled');
    // If we published the active theme, reset the message
    ThemeBuilder.Bar.getInstance().setVisibilityText();
  },

  /**
   * The callback for a failed theme publish.
   *
   * @param {Theme} theme
   *    The Theme instance that could not be published.
   */
  themePublishFailed: function (theme) {
    var bar = ThemeBuilder.Bar.getInstance();
    bar.hideWaitIndicator();
    bar.setStatus(Drupal.t('Failed to make %theme the live theme.', {'%theme': theme.getName()}));
  },

  /**
   * Causes the themebuilder user interface to be refreshed after
   * application data has been updated.
   * 
   * @param {Object} data
   *   An object containing the Application data fields that have been
   *   modified.
   */
  refreshUI: function (data) {
    var $ = jQuery;
    if (data.themes) {
      // The theme list has been modified.
      this.refreshThemes(data);
      this.refreshScreenshots(data);
    }
    // This is a temporary hack until we get the publish button in themebuilder_bar
    // working the same as the publish action on each theme tile.
    if (data.bar_published_theme) {
      this.themePublished(data.bar_published_theme);
    }
  },

  /**
   * Refreshes the theme carousel by adding or removing theme tiles according
   * to the state of the application data.
   * 
   * @param {Object} data
   *   The data that has recently been updated, including the theme list.
   */
  refreshThemes: function (data) {
    var $ = jQuery;
    var i = 0;
    var c = this.carousels.custom.data('jcarousel');
    var themes = data.themes;
    var themeIds = [];
    var mythemes = {};
    // Store the theme tile ids in an array
    for (i = 0; i < themes.length; i++) {
      // Don't consider base themes.
      if (!themes[i].is_base) {
        themeIds.push(themes[i].dom_id);
        mythemes[themes[i].dom_id] = themes[i];
      }
    }
    // Get all the carousel items in the DOM.
    var carouselItems = $('#themebuilder-themes-mythemes .carousel > li');
    var carouselItemIds = [];
    // Store the carousel item ids in an array
    carouselItems.each(function (index, value) {
      carouselItemIds[index] = $(value).attr('id');
    });
    // Find any carousel items that exist in the DOM, but not in the application data.
    var deletedThemeItemIndices = [];
    for (i = 0; i < carouselItemIds.length; i++) {
      // If the carousel item id isn't in the theme id list, mark it for deletion
      if ($.inArray(carouselItemIds[i], themeIds) < 0) {
        deletedThemeItemIndices.push(i);
      }
    }
    
    // Remove the deleted items from the jcarousel
    while (deletedThemeItemIndices.length > 0) {
      // The carousel is a 1 indexed list, not 0
      c.remove(deletedThemeItemIndices.shift() + 1);
    }
    // Find any themes that exist in the application data but not in the theme carousel
    var newThemeIndices = [];
    for (i = 0; i < themeIds.length; i++) {
      // If the theme id isn't in the carousel item list, mark it to be added.
      if ($.inArray(themeIds[i], carouselItemIds) < 0) {
        newThemeIndices.push(i);
      }
    }
    // Add the new items to the end of the carousel.
    while (newThemeIndices.length > 0) {
      var themeId = newThemeIndices.shift();
      var theme = mythemes[themeIds[themeId]];
      var newMarkup = this.getThemeTile(theme, false, false);
      // Add it to the carousel.
      c.add(newMarkup);
      // Create a flyout list for it.
      this.buildThemeActionList(theme);
    }

    // Move the "last" class to the last tile.
    $('#themebuilder-themes-mythemes .carousel > li.last').removeClass('last');
    $('#themebuilder-themes-mythemes .carousel > li:last-child').addClass('last');
  },
  /**
   * Force the theme screenshots to redownload.
   */
  refreshScreenshots: function (data) {
    var themes = data.themes;
    var $ = jQuery;
    var date = new Date();
    var i, img, theme;
    for (i = 0; i < themes.length; i++) {
      theme = themes[i];
      img = $('#themebuilder-themes-mythemes #' + theme.dom_id).find('img.image').get(0);
      if (img && img.src) {
        img.src = theme.screenshot_url + "?" + date.getTime();
      }
    }
  },
  /**
   * Called when the theme was successfully changed.
   */
  themeChangeSuccess: function () {
    this._themeChanged = true;
    this.reloadOnSuccess();
  },

  /**
   * Called when the theme change failed.
   *
   * This callback will attempt to fix any broken themes and try to
   * switch themes a second time.
   */
  themeChangeFail: function (data, type) {
    if (type === 'error') {
      // We tried to change themes but it failed.  Probably there is a
      // corrupted theme that could use a bit of attention.  Try to
      // fix the themes before continuing.
      ThemeBuilder.postBack('themebuilder-fix-themes', {}, ThemeBuilder.bind(this, this.recoverySuccess), ThemeBuilder.bind(this, this.recoveryFailed));
    }
  },

  /**
   * Called when the undo/redo stack has been cleared.
   */
  stackClearSuccess: function () {
    this._stacksCleared = true;
    this.reloadOnSuccess();
  },

  /**
   * Called if the undo/redo stack clear failed.
   *
   * @param {object} data
   *   The object passed back from the server containing any interesting
   *   information about the processing of the request.
   * @param {String} type
   *   A string that reveals the type of response.
   * @param {String} exception
   *   A string that indicates the cause of the problem.
   */
  stackClearFail: function (data, type, exception) {
    // We have been having occasional failures when clearing the
    // undo/redo stacks.  Start by getting more information about the
    // failures and don't treat this as a fatal error.  Once we better
    // understand the issue, we can determine whether this should be
    // fatal or not.
    var info = '';
    if (data) {
      info += ' status: ' + data.status + '; ';
    }
    if (type) {
      info += 'type: ' + type + '; ';
    }
    if (exception) {
      info += 'exception: ' + exception + '; ';
    }
    ThemeBuilder.Log.gardensError('AN-22430 - Failed to clear the undo/redo stack when changing themes.', info);
    // For now, rather than giving up on the failure, clear the client
    // side cache and continue.
    if (false) {
      this.giveUp();
    }
    else {
      ThemeBuilder.undoStack.clear();
      ThemeBuilder.redoStack.clear();
      this.stackClearSuccess();
    }
  },

  /**
   * Called when when the theme switch has been successful and when
   * the stack clear has been successful.  When both are done, this
   * method forces a page refresh so we can view the new theme.
   */
  reloadOnSuccess: function () {
    if (this._themeChanged && this._stacksCleared) {
      parent.location.reload();
    }
  },

  /**
   * Called when the theme recovery worked.
   */
  recoverySuccess: function () {
    // Managed to fix one or more themes.  Try to change themes again,
    // but don't create an infinite loop of requests.  If this fails,
    // give up.
    ThemeBuilder.postBack('themebuilder-start', {'theme_name': this._newThemeName}, ThemeBuilder.bind(this, this.themeChangeSuccess), ThemeBuilder.bind(this, this.recoveryFailed));
  },

  /**
   * Called when the theme recovery failed.
   */
  recoveryFailed: function (data) {
    ThemeBuilder.Log.gardensError('AN-22457 - Failed to switch themes, and running the theme elves did not help.');
    this.giveUp();
  },

  /**
   * We had no luck changing themes either because the the theme
   * switch didn't work or because the undo/redo stack clear failed.
   * Exit the themebuilder with a message to the user.
   */
  giveUp: function () {
    var bar = ThemeBuilder.Bar.getInstance();
    bar.recoveryFailed();
    bar.exit(false);
  }
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

ThemeBuilder.themes = ThemeBuilder.themes || {};

/**
 * The DuplicateInteraction class manages the entire interaction with the user and asyncronous calls to accomplish the duplication of a theme.
 * 
 * @class
 * @extends ThemeBuilder.InteractionController
 */
ThemeBuilder.themes.DuplicateInteraction = ThemeBuilder.initClass();
ThemeBuilder.themes.DuplicateInteraction.prototype = new ThemeBuilder.InteractionController();

/**
 * Constructor for the DuplicateInteraction.
 * 
 * @param {Theme} theme
 *   The theme to be duplicated.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype.initialize = function (theme, callbacks) {
  this.setInteractionTable({
    // Show the name dialog
    begin: 'showNameDialog',
    nameAccepted: 'verifyName',
    nameCanceled: 'cancel',

    // Verify the theme name
    noNameProvided: 'throwNoEntryError',
    nameAlreadyUsed: 'showOverwriteDialog',
    nameOk: 'ready',

    // Theme already exists
    overwriteTheme: 'ready',
    doNotOverwrite: 'showNameDialog',

    // Duplicate the theme
    ready: 'duplicateTheme',
    duplicateSuccess: 'showSuccess',
    duplicateFailed: 'showFailure'
  });
  this.setCallbacks(callbacks);
  this.theme = theme;

  // We need an indirection method to get to the ready state.
  this.ready = this.makeEventCallback('ready');
};

/**
 * Preserves the specified data, which originates from the theme name dialog.
 * 
 * @private
 * This is necessary because there are potentially two dialogs in this
 * interaction.  After confirming a theme overwrite no data is passed
 * back.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype._preserveData = function (data) {
  this.data = data;
};

/**
 * Retrieves the preserved data.
 * 
 * @private
 * @return {Object} data
 *   The save data.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype._getPreservedData = function () {
  return this.data;
};

/**
 * Applies a limit to the length of the input text
 * 
 * @private
 * @param {Event} event
 *   The event that this function handles
 * @param {HTML Object} field
 *   A DOM field.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype._limitInput = function (field) {
  var $ = jQuery;
  var max = 25;
  // If this method is called by an event, field will be an event
  field = (field.target) ? field.target : field;
  var $field = $(field);
  if ($field.length > 0) {
    // Trim the text down to max if it exceeds
    // The delay is necessary to allow time for the paste action to complete
    setTimeout(ThemeBuilder.bindIgnoreCallerArgs(this, this._trimField, $field, max), 200);
  }
};

/**
 * Trims a field's value down to the max
 * 
 * @private
 * @param {jQuery Object} $field
 *   The HTML field to be trimmed.
 * @param {int} max
 *   The maximum number of characters allowed in this field.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype._trimField = function ($field, max) {
  var value = $field.val();
  if (value.length > max) {
    $field.val(value.substr(0, max));
  }
  // Keydown is called to kick the NobleCounter plugin to refresh
  $field.keydown();
};

/**
 * Applies the NobleCount plugin to the supplied field
 * 
 * @private
 * @param {HTML Object} field
 *   A DOM field.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype._enableLiveInputLimit = function (field) {
  var $ = jQuery;
  var max = 25;
  var $field = $(field);
  if ($field.length > 0) {
    // Add the NobleCount input limiter
    $('<span>', {
      id: 'char-count'
    }).insertAfter($field);
    $field.NobleCount('#char-count', {
      max_chars: max,
      block_negative: true
    });
  }
};

/**
 * A helper function that creates the dialog that collects the new theme name
 * 
 * @private
 * @param {jQuery Object} html
 *   The html to be rendered in the dialog.
 * @param {Object} data
 *   An optional object that may have fields that customize the
 *   creation of the dialog.
 * @return {Object} dialog
 *   A reference to the dialog instance.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype._buildNameDialog = function (html, data) {
  var dialog = new ThemeBuilder.ui.Dialog(jQuery('#themebuilder-wrapper'),
    {
      html: html,
      buttons: [
        {
          label: Drupal.t('Copy theme'),
          action: this.makeEventCallback('nameAccepted')
        },
        {
          label: Drupal.t('Cancel'),
          action: this.makeEventCallback('nameCanceled', data)
        }
      ]
    }
  );
  // Limit the name field input
  this._enableLiveInputLimit('#duplicate-theme-name');
  this._limitInput('#duplicate-theme-name');
  
  return dialog;
};

/**
 * Shows the theme name dialog
 * 
 * @param {Object} data
 *   An optional object that may have fields that customize the
 *   creation of the dialog.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype.showNameDialog = function (data) {
  var $ = jQuery;

  // This markup will be displayed in the dialog.
  var inputId = 'duplicate-theme-name';
  var name = data && data.name ? data.name : '';
  var $html = $('<form>').append(
    $('<label>', {
      html: Drupal.t('Theme name:')
    }).attr('for', inputId),
    $('<input>', {
      name: "name",
      id: inputId,
      value: name
    }).bind('paste', ThemeBuilder.bind(this, this._limitInput, inputId))
  );
  this._buildNameDialog($html, data);
};

/**
 * Verifies the theme name.
 * 
 * @param {Object} data
 *   An object containing the original theme and the new theme.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype.verifyName = function (data) {
  this._preserveData(data);
  if (data.name.length === 0) {
    this.event(data, 'noNameProvided');
    return;
  }
  var sysName = ThemeBuilder.util.themeLabelToName(data.name);
  // Check for a blank entry
  // Check to see if the name is already in use.
  var theme = ThemeBuilder.Theme.getTheme(sysName);
  if (theme) {
    // The theme exists.
    this.event(data, 'nameAlreadyUsed');
    return;
  }
  this.event(data, 'nameOk');
};

/**
 * Creates and displays the Overwrite theme confirmation dialog
 * 
 * @param {Object} data
 *   An object containing the original theme and the new theme.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype.showOverwriteDialog = function (data) {
  var $ = jQuery;
  var dialog = new ThemeBuilder.ui.Dialog($('#themebuilder-wrapper'),
    {
      html: Drupal.t('The theme %theme already exists.  Would you like to overwrite the existing theme?', {'%theme': data.name}),
      buttons: [
        {
          label: Drupal.t('Yes'),
          action: this.makeEventCallback('overwriteTheme', data)
        },
        {
          label: Drupal.t('No'),
          action: this.makeEventCallback('doNotOverwrite', data)
        }
      ]
    }
  );
};

/**
 * Causes the theme duplication to occur.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype.duplicateTheme = function () {
  var data = this._getPreservedData();
  var sysName = ThemeBuilder.util.themeLabelToName(data.name);
  var actionCallbacks = {
    success: this.makeEventCallback('duplicateSuccess'),
    fail: this.makeEventCallback('duplicateFailed')
  };
  ThemeBuilder.Bar.getInstance().showWaitIndicator();
  this.theme.copyTheme(data.name, sysName, actionCallbacks);
};

/**
 * Called when the noNameProvided event is fired. This catches the case where a 
 * user tries to save a theme without providing a theme name.
 *
 * @param {Object} data
 *    An object containing the original theme and the new theme.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype.throwNoEntryError = function (data) {
  var $ = jQuery;
  // This markup will be displayed in the dialog.
  var inputId = 'duplicate-theme-name';
  var name = data && data.name ? data.name : '';
  var $html = $('<form>').append(
    $('<div>', {
      html: Drupal.t('Please enter a name.')
    }).addClass('ui-state-error-text block'),
    $('<label>', {
      html: Drupal.t('Theme name:')
    }).attr('for', inputId),
    $('<input>', {
      name: "name",
      id: inputId,
      value: name,
      change: ThemeBuilder.bind(this, this._limitInput, '#duplicate-theme-name')
    }).addClass('ui-state-error')
  );
  this._buildNameDialog($html, data);
};

/**
 * The callback for a successful theme duplication.
 *
 * @param {Object} data
 *    An object containing the original theme and the new theme.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype.showSuccess = function (data) {
  var bar = ThemeBuilder.Bar.getInstance();
  bar.hideWaitIndicator();
  bar.setStatus(Drupal.t('%theme has been duplicated.', {'%theme': data.originalTheme.getName()}));
  this.event(data, 'interactionDone');
};

/**
 * The callback for a failed theme duplication.
 *
 * @param {Object} data
 *    An object containing the original theme and the new theme name.
 */
ThemeBuilder.themes.DuplicateInteraction.prototype.showFailure = function (data) {
  var bar = ThemeBuilder.Bar.getInstance();
  bar.hideWaitIndicator();
  bar.setStatus(Drupal.t('Failed to duplicate theme %theme as %newTheme.', {'%theme': data.originalTheme.getName(), '%newTheme': data.newName}));
  this.event(data, 'interactionFailed');
};
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true ThemeBuilder: true*/

/**
 * @namespace
 */
ThemeBuilder.themes = ThemeBuilder.themes || {};

/**
 * The DeleteInteraction controler manages the entire interaction
 * pertaining to deleting themes.
 * @class
 * @extends ThemeBuilder.InteractionController
 */
ThemeBuilder.themes.DeleteInteraction = ThemeBuilder.initClass();
ThemeBuilder.themes.DeleteInteraction.prototype = new ThemeBuilder.InteractionController();

/**
 * Constructor for the DeleteInteraction.
 * 
 * @param {Theme} theme
 *   The theme to be deleted.
 */
ThemeBuilder.themes.DeleteInteraction.prototype.initialize = function (theme, callbacks) {
  this.setInteractionTable({
    // Show the name dialog
    begin: 'showDeleteDialog',
    deleteAccepted: 'ready',
    deleteCanceled: 'cancel',

    // Delete the theme
    ready: 'deleteTheme',
    deleteSuccess: 'showSuccess',
    deleteFailed: 'showFailure'
  });
  this.setCallbacks(callbacks);
  this.theme = theme;

  // We need an indirection method to get to the ready state.
  this.ready = this.makeEventCallback('ready');
};

/**
 * Shows the theme delete dialog
 * 
 * @param {Object} data
 *   An optional object that may have fields that customize the
 *   creation of the dialog.
 */
ThemeBuilder.themes.DeleteInteraction.prototype.showDeleteDialog = function (data) {
  
  var $ = jQuery;
  // This markup will be displayed in the dialog.
  var inputId = 'delete-theme-name';
  var name = data && data.name ? data.name : '';
  var $html = $('<div>').append(
    $('<img>', {
      src: Drupal.settings.themebuilderAlertImage
    }).addClass('alert-icon'),
    $('<span>', {
      html: Drupal.t('Deleting a theme cannot be undone. Are you sure you want to delete %theme?', {'%theme': this.theme.getName()})
    })
  );
  var dialog = new ThemeBuilder.ui.Dialog(jQuery('#themebuilder-wrapper'),
    {
      html: $html,
      buttons: [
        {
          label: Drupal.t('Delete theme'),
          action: this.makeEventCallback('deleteAccepted', data)
        },
        {
          label: Drupal.t('Cancel'),
          action: this.makeEventCallback('deleteCanceled', data)
        }
      ]
    }
  );
};

/**
 * Causes the theme deletion to occur.
 */
ThemeBuilder.themes.DeleteInteraction.prototype.deleteTheme = function () {
  var actionCallbacks = {
    success: this.makeEventCallback('deleteSuccess'),
    fail: this.makeEventCallback('deleteFailed')
  };
  ThemeBuilder.Bar.getInstance().showWaitIndicator();
  this.theme.deleteTheme(actionCallbacks);
};

/**
 * The callback for a successful theme duplication.
 *
 * @param {Object} data
 *    An object containing the original theme and the new theme.
 */
ThemeBuilder.themes.DeleteInteraction.prototype.showSuccess = function (data) {
  var bar = ThemeBuilder.Bar.getInstance();
  bar.hideWaitIndicator();
  bar.setStatus(Drupal.t('%theme has been deleted', {'%theme': this.theme.getName()}));
  this.event(data, 'interactionDone');
};

/**
 * The callback for a failed theme duplication.
 *
 * @param {Object} data
 *    An object containing the original theme and the new theme name.
 */
ThemeBuilder.themes.DeleteInteraction.prototype.showFailure = function (data) {
  var bar = ThemeBuilder.Bar.getInstance();
  bar.hideWaitIndicator();
  bar.setStatus(Drupal.t('Failed to delete theme %theme', {'%theme': this.theme.getName()}));
  this.event(data, 'interactionFailed');
};
;
