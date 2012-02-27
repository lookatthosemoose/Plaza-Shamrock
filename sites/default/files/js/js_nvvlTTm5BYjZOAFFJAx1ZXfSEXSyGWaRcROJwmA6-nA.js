(function($) {

Drupal.wysiwyg.editor.init.ckeditor = function(settings) {
  // Plugins must only be loaded once. Only the settings from the first format
  // will be used but they're identical anyway.
  var registeredPlugins = {};
  for (var format in settings) {
    if (Drupal.settings.wysiwyg.plugins[format]) {
      // Register native external plugins.
      // Array syntax required; 'native' is a predefined token in JavaScript.
      for (var pluginName in Drupal.settings.wysiwyg.plugins[format]['native']) {
        if (!registeredPlugins[pluginName]) {
          var plugin = Drupal.settings.wysiwyg.plugins[format]['native'][pluginName];
          CKEDITOR.plugins.addExternal(pluginName, plugin.path, plugin.fileName);
          registeredPlugins[pluginName] = true;
        }
      }
      // Register Drupal plugins.
      for (var pluginName in Drupal.settings.wysiwyg.plugins[format].drupal) {
        if (!registeredPlugins[pluginName]) {
          Drupal.wysiwyg.editor.instance.ckeditor.addPlugin(pluginName, Drupal.settings.wysiwyg.plugins[format].drupal[pluginName], Drupal.settings.wysiwyg.plugins.drupal[pluginName]);
          registeredPlugins[pluginName] = true;
        }
      }
    }
  }
};


/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.ckeditor = function(context, params, settings) {
  // Apply editor instance settings.
  CKEDITOR.config.customConfig = '';

  settings.on = {
    instanceReady: function(ev) {
      var editor = ev.editor;
      // Get a list of block, list and table tags from CKEditor's XHTML DTD.
      // @see http://docs.cksource.com/CKEditor_3.x/Developers_Guide/Output_Formatting.
      var dtd = CKEDITOR.dtd;
      var tags = CKEDITOR.tools.extend({}, dtd.$block, dtd.$listItem, dtd.$tableContent);
      // Set source formatting rules for each listed tag except <pre>.
      // Linebreaks can be inserted before or after opening and closing tags.
      if (settings.apply_source_formatting) {
        // Mimic FCKeditor output, by breaking lines between tags.
        for (var tag in tags) {
          if (tag == 'pre') {
            continue;
          }
          this.dataProcessor.writer.setRules(tag, {
            indent: true,
            breakBeforeOpen: true,
            breakAfterOpen: false,
            breakBeforeClose: false,
            breakAfterClose: true
          });
        }
      }
      else {
        // CKEditor adds default formatting to <br>, so we want to remove that
        // here too.
        tags.br = 1;
        // No indents or linebreaks;
        for (var tag in tags) {
          if (tag == 'pre') {
            continue;
          }
          this.dataProcessor.writer.setRules(tag, {
            indent: false,
            breakBeforeOpen: false,
            breakAfterOpen: false,
            breakBeforeClose: false,
            breakAfterClose: false
          });
        }
      }
    },

    pluginsLoaded: function(ev) {
      // Override the conversion methods to let Drupal plugins modify the data.
      var editor = ev.editor;
      if (editor.dataProcessor && Drupal.settings.wysiwyg.plugins[params.format]) {
        editor.dataProcessor.toHtml = CKEDITOR.tools.override(editor.dataProcessor.toHtml, function(originalToHtml) {
          // Convert raw data for display in WYSIWYG mode.
          return function(data, fixForBody) {
            for (var plugin in Drupal.settings.wysiwyg.plugins[params.format].drupal) {
              if (typeof Drupal.wysiwyg.plugins[plugin].attach == 'function') {
                data = Drupal.wysiwyg.plugins[plugin].attach(data, Drupal.settings.wysiwyg.plugins.drupal[plugin], editor.name);
                data = Drupal.wysiwyg.instances[params.field].prepareContent(data);
              }
            }
            return originalToHtml.call(this, data, fixForBody);
          };
        });
        editor.dataProcessor.toDataFormat = CKEDITOR.tools.override(editor.dataProcessor.toDataFormat, function(originalToDataFormat) {
          // Convert WYSIWYG mode content to raw data.
          return function(data, fixForBody) {
            data = originalToDataFormat.call(this, data, fixForBody);
            for (var plugin in Drupal.settings.wysiwyg.plugins[params.format].drupal) {
              if (typeof Drupal.wysiwyg.plugins[plugin].detach == 'function') {
                data = Drupal.wysiwyg.plugins[plugin].detach(data, Drupal.settings.wysiwyg.plugins.drupal[plugin], editor.name);
              }
            }
            return data;
          };
        });
      }
    },

    selectionChange: function (event) {
      var pluginSettings = Drupal.settings.wysiwyg.plugins[params.format];
      if (pluginSettings && pluginSettings.drupal) {
        $.each(pluginSettings.drupal, function (name) {
          var plugin = Drupal.wysiwyg.plugins[name];
          if ($.isFunction(plugin.isNode)) {
            var node = event.data.selection.getSelectedElement();
            var state = plugin.isNode(node ? node.$ : null) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
            event.editor.getCommand(name).setState(state);
          }
        });
      }
    },

    focus: function(ev) {
      Drupal.wysiwyg.activeId = ev.editor.name;
    }
  };

  // Attach editor.
  CKEDITOR.replace(params.field, settings);
};

/**
 * Detach a single or all editors.
 *
 * @todo 3.x: editor.prototype.getInstances() should always return an array
 *   containing all instances or the passed in params.field instance, but
 *   always return an array to simplify all detach functions.
 */
Drupal.wysiwyg.editor.detach.ckeditor = function (context, params, trigger) {
  var method = (trigger && trigger == 'serialize') ? 'updateElement' : 'destroy';
  if (typeof params != 'undefined') {
    var instance = CKEDITOR.instances[params.field];
    if (instance) {
      instance[method]();
    }
  }
  else {
    for (var instanceName in CKEDITOR.instances) {
      if (CKEDITOR.instances.hasOwnProperty(instanceName)) {
        CKEDITOR.instances[instanceName][method]();
      }
    }
  }
};

Drupal.wysiwyg.editor.instance.ckeditor = {
  addPlugin: function(pluginName, settings, pluginSettings) {
    CKEDITOR.plugins.add(pluginName, {
      // Wrap Drupal plugin in a proxy pluygin.
      init: function(editor) {
        if (settings.css) {
          editor.on('mode', function(ev) {
            if (ev.editor.mode == 'wysiwyg') {
              // Inject CSS files directly into the editing area head tag.
              $('head', $('#cke_contents_' + ev.editor.name + ' iframe').eq(0).contents()).append('<link rel="stylesheet" href="' + settings.css + '" type="text/css" >');
            }
          });
        }
        if (typeof Drupal.wysiwyg.plugins[pluginName].invoke == 'function') {
          var pluginCommand = {
            exec: function (editor) {
              var data = { format: 'html', node: null, content: '' };
              var selection = editor.getSelection();
              if (selection) {
                data.node = selection.getSelectedElement();
                if (data.node) {
                  data.node = data.node.$;
                }
                if (selection.getType() == CKEDITOR.SELECTION_TEXT) {
                  if (CKEDITOR.env.ie) {
                    data.content = selection.getNative().createRange().text;
                  }
                  else {
                    data.content = selection.getNative().toString();
                  }
                }
                else if (data.node) {
                  // content is supposed to contain the "outerHTML".
                  data.content = data.node.parentNode.innerHTML;
                }
              }
              Drupal.wysiwyg.plugins[pluginName].invoke(data, pluginSettings, editor.name);
            }
          };
          editor.addCommand(pluginName, pluginCommand);
        }
        editor.ui.addButton(pluginName, {
          label: settings.iconTitle,
          command: pluginName,
          icon: settings.icon
        });

        // @todo Add button state handling.
      }
    });
  },
  prepareContent: function(content) {
    // @todo Don't know if we need this yet.
    return content;
  },
  insert: function(content) {
    content = this.prepareContent(content);
    CKEDITOR.instances[this.field].insertHtml(content);
  }
};

})(jQuery);
;
(function($) {

/**
 * Attach this editor to a target element.
 *
 * @param context
 *   A DOM element, supplied by Drupal.attachBehaviors().
 * @param params
 *   An object containing input format parameters. Default parameters are:
 *   - editor: The internal editor name.
 *   - theme: The name/key of the editor theme/profile to use.
 *   - field: The CSS id of the target element.
 * @param settings
 *   An object containing editor settings for all enabled editor themes.
 */
Drupal.wysiwyg.editor.attach.none = function(context, params, settings) {
  if (params.resizable) {
    var $wrapper = $('#' + params.field).parents('.form-textarea-wrapper:first');
    $wrapper.addClass('resizable');
    if (Drupal.behaviors.textarea.attach) {
      Drupal.behaviors.textarea.attach();
    }
  }
};

/**
 * Detach a single or all editors.
 *
 * @param context
 *   A DOM element, supplied by Drupal.attachBehaviors().
 * @param params
 *   (optional) An object containing input format parameters. If defined,
 *   only the editor instance in params.field should be detached. Otherwise,
 *   all editors should be detached and saved, so they can be submitted in
 *   AJAX/AHAH applications.
 * @param trigger
 *   (optional) A string describing why the editor is being detached. May be one
 *   of 'unload' (default), 'move', or 'serialize'. Editors need to be destroyed
 *   when their element is being removed from the DOM ('unload') or moved
 *   ('move'). If detach was called simply because of an AJAX request to
 *   serialize the form and send it to the server ('serialize'), we can leave
 *   the WYSIWYG in place, and just update the underlying element with the new
 *   text.
 */
Drupal.wysiwyg.editor.detach.none = function (context, params, trigger) {
  if (typeof params != 'undefined' && (trigger != 'serialize')) {
    var $wrapper = $('#' + params.field).parents('.form-textarea-wrapper:first');
    $wrapper.removeOnce('textarea').removeClass('.resizable-textarea')
      .find('.grippie').remove();
  }
};

/**
 * Instance methods for plain text areas.
 */
Drupal.wysiwyg.editor.instance.none = {
  insert: function(content) {
    var editor = document.getElementById(this.field);

    // IE support.
    if (document.selection) {
      editor.focus();
      var sel = document.selection.createRange();
      sel.text = content;
    }
    // Mozilla/Firefox/Netscape 7+ support.
    else if (editor.selectionStart || editor.selectionStart == '0') {
      var startPos = editor.selectionStart;
      var endPos = editor.selectionEnd;
      editor.value = editor.value.substring(0, startPos) + content + editor.value.substring(endPos, editor.value.length);
    }
    // Fallback, just add to the end of the content.
    else {
      editor.value += content;
    }
  }
};

})(jQuery);
;

/**
 * @file: Popup dialog interfaces for the media project.
 *
 * Drupal.media.popups.mediaBrowser
 *   Launches the media browser which allows users to pick a piece of media.
 *
 * Drupal.media.popups.mediaStyleSelector
 *  Launches the style selection form where the user can choose
 *  what format / style they want their media in.
 *
 */

(function ($) {
namespace('Drupal.media.popups');

/**
 * Media browser popup. Creates a media browser dialog.
 *
 * @param {function}
 *          onSelect Callback for when dialog is closed, received (Array
 *          media, Object extra);
 * @param {Object}
 *          globalOptions Global options that will get passed upon initialization of the browser.
 *          @see Drupal.media.popups.mediaBrowser.getDefaults();
 *
 * @param {Object}
 *          pluginOptions Options for specific plugins. These are passed
 *          to the plugin upon initialization.  If a function is passed here as
 *          a callback, it is obviously not passed, but is accessible to the plugin
 *          in Drupal.settings.variables.
 *
 *          Example
 *          pluginOptions = {library: {url_include_patterns:'/foo/bar'}};
 *
 * @param {Object}
 *          widgetOptions Options controlling the appearance and behavior of the
 *          modal dialog.
 *          @see Drupal.media.popups.mediaBrowser.getDefaults();
 */
Drupal.media.popups.mediaBrowser = function (onSelect, globalOptions, pluginOptions, widgetOptions) {
  var options = Drupal.media.popups.mediaBrowser.getDefaults();
  options.global = $.extend({}, options.global, globalOptions);
  options.plugins = pluginOptions;
  options.widget = $.extend({}, options.widget, widgetOptions);

  // Create it as a modal window.
  var browserSrc = options.widget.src;
  if ($.isArray(browserSrc) && browserSrc.length) {
    browserSrc = browserSrc[browserSrc.length - 1];
  }
  // Params to send along to the iframe.  WIP.
  var params = {};
  $.extend(params, options.global);
  params.plugins = options.plugins;

  browserSrc += '&' + $.param(params);
  var mediaIframe = Drupal.media.popups.getPopupIframe(browserSrc, 'mediaBrowser');
  // Attach the onLoad event
  mediaIframe.bind('load', options, options.widget.onLoad);
  /**
   * Setting up the modal dialog
   */

  var ok = 'OK';
  var cancel = 'Cancel';
  var notSelected = 'You have not selected anything!';

  if (Drupal && Drupal.t) {
    ok = Drupal.t(ok);
    cancel = Drupal.t(cancel);
    notSelected = Drupal.t(notSelected);
  }

  // @todo: let some options come through here. Currently can't be changed.
  var dialogOptions = options.dialog;

  dialogOptions.buttons[ok] = function () {
    var selected = this.contentWindow.Drupal.media.browser.selectedMedia;
    if (selected.length < 1) {
      alert(notSelected);
      return;
    }
    onSelect(selected);
    $(this).dialog("destroy");
    $(this).remove();
  };

  dialogOptions.buttons[cancel] = function () {
    $(this).dialog("destroy");
    $(this).remove();
  };

  Drupal.media.popups.setDialogPadding(mediaIframe.dialog(dialogOptions));
  // Remove the title bar.
  mediaIframe.parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
  Drupal.media.popups.overlayDisplace(mediaIframe.parents(".ui-dialog"));
  return mediaIframe;
};

Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad = function (e) {
  var options = e.data;
  if (this.contentWindow.Drupal.media.browser.selectedMedia.length > 0) {
    var ok = $(this).dialog('option', 'buttons')['OK'];
    ok.call(this);
    return;
  }
};

Drupal.media.popups.mediaBrowser.getDefaults = function () {
  return {
    global: {
      types: [], // Types to allow, defaults to all.
      activePlugins: [] // If provided, a list of plugins which should be enabled.
    },
    widget: { // Settings for the actual iFrame which is launched.
      src: Drupal.settings.media.browserUrl, // Src of the media browser (if you want to totally override it)
      onLoad: Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad // Onload function when iFrame loads.
    },
    dialog: Drupal.media.popups.getDialogOptions()
  };
};

Drupal.media.popups.mediaBrowser.finalizeSelection = function () {
  var selected = this.contentWindow.Drupal.media.browser.selectedMedia;
  if (selected.length < 1) {
    alert(notSelected);
    return;
  }
  onSelect(selected);
  $(this).dialog("destroy");
  $(this).remove();
}

/**
 * Style chooser Popup. Creates a dialog for a user to choose a media style.
 *
 * @param mediaFile
 *          The mediaFile you are requesting this formatting form for.
 *          @todo: should this be fid?  That's actually all we need now.
 *
 * @param Function
 *          onSubmit Function to be called when the user chooses a media
 *          style. Takes one parameter (Object formattedMedia).
 *
 * @param Object
 *          options Options for the mediaStyleChooser dialog.
 */
Drupal.media.popups.mediaStyleSelector = function (mediaFile, onSelect, options) {
  var defaults = Drupal.media.popups.mediaStyleSelector.getDefaults();
  // @todo: remove this awful hack :(
  defaults.src = defaults.src.replace('-media_id-', mediaFile.fid);
  options = $.extend({}, defaults, options);
  // Create it as a modal window.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaStyleSelector');
  // Attach the onLoad event
  mediaIframe.bind('load', options, options.onLoad);

  /**
   * Set up the button text
   */
  var ok = 'OK';
  var cancel = 'Cancel';
  var notSelected = 'Very sorry, there was an unknown error embedding media.';

  if (Drupal && Drupal.t) {
    ok = Drupal.t(ok);
    cancel = Drupal.t(cancel);
    notSelected = Drupal.t(notSelected);
  }

  // @todo: let some options come through here. Currently can't be changed.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  dialogOptions.buttons[ok] = function () {

    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();
    if (!formattedMedia) {
      alert(notSelected);
      return;
    }
    onSelect(formattedMedia);
    $(this).dialog("destroy");
    $(this).remove();
  };

  dialogOptions.buttons[cancel] = function () {
    $(this).dialog("destroy");
    $(this).remove();
  };

  Drupal.media.popups.setDialogPadding(mediaIframe.dialog(dialogOptions));
  // Remove the title bar.
  mediaIframe.parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
  Drupal.media.popups.overlayDisplace(mediaIframe.parents(".ui-dialog"));
  return mediaIframe;
};

Drupal.media.popups.mediaStyleSelector.mediaBrowserOnLoad = function (e) {
};

Drupal.media.popups.mediaStyleSelector.getDefaults = function () {
  return {
    src: Drupal.settings.media.styleSelectorUrl,
    onLoad: Drupal.media.popups.mediaStyleSelector.mediaBrowserOnLoad
  };
};


/**
 * Style chooser Popup. Creates a dialog for a user to choose a media style.
 *
 * @param mediaFile
 *          The mediaFile you are requesting this formatting form for.
 *          @todo: should this be fid?  That's actually all we need now.
 *
 * @param Function
 *          onSubmit Function to be called when the user chooses a media
 *          style. Takes one parameter (Object formattedMedia).
 *
 * @param Object
 *          options Options for the mediaStyleChooser dialog.
 */
Drupal.media.popups.mediaFieldEditor = function (fid, onSelect, options) {
  var defaults = Drupal.media.popups.mediaFieldEditor.getDefaults();
  // @todo: remove this awful hack :(
  defaults.src = defaults.src.replace('-media_id-', fid);
  options = $.extend({}, defaults, options);
  // Create it as a modal window.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaFieldEditor');
  // Attach the onLoad event
  // @TODO - This event is firing too early in IE on Windows 7,
  // - so the height being calculated is too short for the content.
  mediaIframe.bind('load', options, options.onLoad);

  /**
   * Set up the button text
   */
  var ok = 'OK';
  var cancel = 'Cancel';
  var notSelected = 'Very sorry, there was an unknown error embedding media.';

  if (Drupal && Drupal.t) {
    ok = Drupal.t(ok);
    cancel = Drupal.t(cancel);
    notSelected = Drupal.t(notSelected);
  }

  // @todo: let some options come through here. Currently can't be changed.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  dialogOptions.buttons[ok] = function () {
    alert('hell yeah');
    return "poo";

    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();
    if (!formattedMedia) {
      alert(notSelected);
      return;
    }
    onSelect(formattedMedia);
    $(this).dialog("destroy");
    $(this).remove();
  };

  dialogOptions.buttons[cancel] = function () {
    $(this).dialog("destroy");
    $(this).remove();
  };

  Drupal.media.popups.setDialogPadding(mediaIframe.dialog(dialogOptions));
  // Remove the title bar.
  mediaIframe.parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
  Drupal.media.popups.overlayDisplace(mediaIframe.parents(".ui-dialog"));
  return mediaIframe;
};

Drupal.media.popups.mediaFieldEditor.mediaBrowserOnLoad = function (e) {

};

Drupal.media.popups.mediaFieldEditor.getDefaults = function () {
  return {
    // @todo: do this for real
    src: '/media/-media_id-/edit?render=media-popup',
    onLoad: Drupal.media.popups.mediaFieldEditor.mediaBrowserOnLoad
  };
};


/**
 * Generic functions to both the media-browser and style selector
 */

/**
 * Returns the commonly used options for the dialog.
 */
Drupal.media.popups.getDialogOptions = function () {
  return {
    buttons: {},
    dialogClass: 'media-wrapper',
    modal: true,
    draggable: false,
    resizable: false,
    minWidth: 600,
    width: 800,
    height: 550,
    position: 'center',
    overlay: {
      backgroundColor: '#000000',
      opacity: 0.4
    }
  };
};

/**
 * Created padding on a dialog
 *
 * @param jQuery dialogElement
 *  The element which has .dialog() attached to it.
 */
Drupal.media.popups.setDialogPadding = function (dialogElement) {
  // @TODO: Perhaps remove this hardcoded reference to height.
  // - It's included to make IE on Windows 7 display the dialog without
  //   collapsing. 550 is the height that displays all of the tab panes
  //   within the Add Media overlay. This is either a bug in the jQuery
  //   UI library, a bug in IE on Windows 7 or a bug in the way the
  //   dialog is instantiated. Or a combo of the three.
  //   All browsers except IE on Win7 ignore these defaults and adjust
  //   the height of the iframe correctly to match the content in the panes
  dialogElement.height(dialogElement.dialog('option', 'height'));
  dialogElement.width(dialogElement.dialog('option', 'width'));
};

/**
 * Get an iframe to serve as the dialog's contents. Common to both plugins.
 */
Drupal.media.popups.getPopupIframe = function (src, id, options) {
  var defaults = {width: '800px', scrolling: 'no'};
  var options = $.extend({}, defaults, options);

  return $('<iframe class="media-modal-frame"/>')
  .attr('src', src)
  .attr('width', options.width)
  .attr('id', id)
  .attr('scrolling', options.scrolling);
};

Drupal.media.popups.overlayDisplace = function (dialog) {
  if (parent.window.Drupal.overlay) {
    var overlayDisplace = parent.window.Drupal.overlay.getDisplacement('top');
    if (dialog.offset().top < overlayDisplace) {
      dialog.css('top', overlayDisplace);
    }
  }
}

})(jQuery);
;

/**
 *  @file
 *  Attach Media WYSIWYG behaviors.
 */

(function ($) {

Drupal.media = Drupal.media || {};

// Define the behavior.
Drupal.wysiwyg.plugins.media = {

  /**
   * Initializes the tag map.
   */
  initializeTagMap: function () {
    if (typeof Drupal.settings.tagmap == 'undefined') {
      Drupal.settings.tagmap = { };
    }
  },
  /**
   * Execute the button.
   * @TODO: Debug calls from this are never called. What's its function?
   */
  invoke: function (data, settings, instanceId) {
    if (data.format == 'html') {
      Drupal.media.popups.mediaBrowser(function (mediaFiles) {
        Drupal.wysiwyg.plugins.media.mediaBrowserOnSelect(mediaFiles, instanceId);
      }, settings['global']);
    }
  },

  /**
   * Respond to the mediaBrowser's onSelect event.
   * @TODO: Debug calls from this are never called. What's its function?
   */
  mediaBrowserOnSelect: function (mediaFiles, instanceId) {
    var mediaFile = mediaFiles[0];
    var options = {};
    Drupal.media.popups.mediaStyleSelector(mediaFile, function (formattedMedia) {
      Drupal.wysiwyg.plugins.media.insertMediaFile(mediaFile, formattedMedia.type, formattedMedia.html, formattedMedia.options, Drupal.wysiwyg.instances[instanceId]);
    }, options);

    return;
  },

  insertMediaFile: function (mediaFile, viewMode, formattedMedia, options, wysiwygInstance) {

    this.initializeTagMap();
    // @TODO: the folks @ ckeditor have told us that there is no way
    // to reliably add wrapper divs via normal HTML.
    // There is some method of adding a "fake element"
    // But until then, we're just going to embed to img.
    // This is pretty hacked for now.
    //
    var imgElement = $(this.stripDivs(formattedMedia));
    this.addImageAttributes(imgElement, mediaFile.fid, viewMode, options);

    var toInsert = this.outerHTML(imgElement);
    // Create an inline tag
    var inlineTag = Drupal.wysiwyg.plugins.media.createTag(imgElement);
    // Add it to the tag map in case the user switches input formats
    Drupal.settings.tagmap[inlineTag] = toInsert;
    wysiwygInstance.insert(toInsert);
  },

  /**
   * Gets the HTML content of an element
   *
   * @param jQuery element
   */
  outerHTML: function (element) {
    return $('<div>').append( element.eq(0).clone() ).html();
  },

  addImageAttributes: function (imgElement, fid, view_mode, additional) {
    //    imgElement.attr('fid', fid);
    //    imgElement.attr('view_mode', view_mode);
    // Class so we can find this image later.
    imgElement.addClass('media-image');
    this.forceAttributesIntoClass(imgElement, fid, view_mode, additional);
    if (additional) {
      for (k in additional) {
        if (additional.hasOwnProperty(k)) {
          if (k === 'attr') {
            imgElement.attr(k, additional[k]);
          }
        }
      }
    }
  },

  /**
   * Due to problems handling wrapping divs in ckeditor, this is needed.
   *
   * Going forward, if we don't care about supporting other editors
   * we can use the fakeobjects plugin to ckeditor to provide cleaner
   * transparency between what Drupal will output <div class="field..."><img></div>
   * instead of just <img>, for now though, we're going to remove all the stuff surrounding the images.
   *
   * @param String formattedMedia
   *  Element containing the image
   *
   * @return HTML of <img> tag inside formattedMedia
   */
  stripDivs: function (formattedMedia) {
    // Check to see if the image tag has divs to strip
    var stripped = null;
    if ($(formattedMedia).is('img')) {
      stripped = this.outerHTML($(formattedMedia));
    } else {
      stripped = this.outerHTML($('img', $(formattedMedia)));
    }
    // This will fail if we pass the img tag without anything wrapping it, like we do when re-enabling WYSIWYG
    return stripped;
  },

  /**
   * Attach function, called when a rich text editor loads.
   * This finds all [[tags]] and replaces them with the html
   * that needs to show in the editor.
   *
   */
  attach: function (content, settings, instanceId) {
    var matches = content.match(/\[\[.*?\]\]/g);
    this.initializeTagMap();
    var tagmap = Drupal.settings.tagmap;
    if (matches) {
      var inlineTag = "";
      for (i = 0; i < matches.length; i++) {
        inlineTag = matches[i];
        if (tagmap[inlineTag]) {
          // This probably needs some work...
          // We need to somehow get the fid propogated here.
          // We really want to
          var tagContent = tagmap[inlineTag];
          var mediaMarkup = this.stripDivs(tagContent); // THis is <div>..<img>

          var _tag = inlineTag;
          _tag = _tag.replace('[[','');
          _tag = _tag.replace(']]','');
          try {
            mediaObj = JSON.parse(_tag);
          }
          catch(err) {
            mediaObj = null;
          }
          if(mediaObj) {
            var imgElement = $(mediaMarkup);
            this.addImageAttributes(imgElement, mediaObj.fid, mediaObj.view_mode);
            var toInsert = this.outerHTML(imgElement);
            content = content.replace(inlineTag, toInsert);
          }
        }
        else {
          debug.debug("Could not find content for " + inlineTag);
        }
      }
    }
    return content;
  },

  /**
   * Detach function, called when a rich text editor detaches
   */
  detach: function (content, settings, instanceId) {
    // Replace all Media placeholder images with the appropriate inline json
    // string. Using a regular expression instead of jQuery manipulation to
    // prevent <script> tags from being displaced.
    // @see http://drupal.org/node/1280758.
    if (matches = content.match(/<img[^>]+class=([\'"])media-image[^>]*>/gi)) {
      for (var i = 0; i < matches.length; i++) {
        var imageTag = matches[i];
        var inlineTag = Drupal.wysiwyg.plugins.media.createTag($(imageTag));
        Drupal.settings.tagmap[inlineTag] = imageTag;
        content = content.replace(imageTag, inlineTag);
      }
    }
    return content;
  },

  /**
   * @param jQuery imgNode
   *  Image node to create tag from
   */
  createTag: function (imgNode) {
    // Currently this is the <img> itself
    // Collect all attribs to be stashed into tagContent
    var mediaAttributes = {};
    var imgElement = imgNode[0];
    var sorter = [];

    // @todo: this does not work in IE, width and height are always 0.
    for (i=0; i< imgElement.attributes.length; i++) {
      var attr = imgElement.attributes[i];
      if (attr.specified == true) {
        if (attr.name !== 'class') {
          sorter.push(attr);
        }
        else {
          // Exctract expando properties from the class field.
          var attributes = this.getAttributesFromClass(attr.value);
          for (var name in attributes) {
            if (attributes.hasOwnProperty(name)) {
              var value = attributes[name];
              if (value.type && value.type === 'attr') {
                sorter.push(value);
              }
            }
          }
        }
      }
    }

    sorter.sort(this.sortAttributes);

    for (var prop in sorter) {
      mediaAttributes[sorter[prop].name] = sorter[prop].value;
    }

    // The following 5 ifs are dedicated to IE7
    // If the style is null, it is because IE7 can't read values from itself
    if (jQuery.browser.msie && jQuery.browser.version == '7.0') {
      if (mediaAttributes.style === "null") {
        var imgHeight = imgNode.css('height');
        var imgWidth = imgNode.css('width');
        mediaAttributes.style = {
          height: imgHeight,
          width: imgWidth
        }
        if (!mediaAttributes['width']) {
          mediaAttributes['width'] = imgWidth;
        }
        if (!mediaAttributes['height']) {
          mediaAttributes['height'] = imgHeight;
        }
      }
      // If the attribute width is zero, get the CSS width
      if (Number(mediaAttributes['width']) === 0) {
        mediaAttributes['width'] = imgNode.css('width');
      }
      // IE7 does support 'auto' as a value of the width attribute. It will not
      // display the image if this value is allowed to pass through
      if (mediaAttributes['width'] === 'auto') {
        delete mediaAttributes['width'];
      }
      // If the attribute height is zero, get the CSS height
      if (Number(mediaAttributes['height']) === 0) {
        mediaAttributes['height'] = imgNode.css('height');
      }
      // IE7 does support 'auto' as a value of the height attribute. It will not
      // display the image if this value is allowed to pass through
      if (mediaAttributes['height'] === 'auto') {
        delete mediaAttributes['height'];
      }
    }

    // Remove elements from attribs using the blacklist
    for (var blackList in Drupal.settings.media.blacklist) {
      delete mediaAttributes[Drupal.settings.media.blacklist[blackList]];
    }
    tagContent = {
      "type": 'media',
      // @todo: This will be selected from the format form
      "view_mode": attributes['view_mode'].value,
      "fid" : attributes['fid'].value,
      "attributes": mediaAttributes
    };
    return '[[' + JSON.stringify(tagContent) + ']]';
  },

  /**
   * Forces custom attributes into the class field of the specified image.
   *
   * Due to a bug in some versions of Firefox
   * (http://forums.mozillazine.org/viewtopic.php?f=9&t=1991855), the
   * custom attributes used to share information about the image are
   * being stripped as the image markup is set into the rich text
   * editor.  Here we encode these attributes into the class field so
   * the data survives.
   *
   * @param imgElement
   *   The image
   * @fid
   *   The file id.
   * @param view_mode
   *   The view mode.
   * @param additional
   *   Additional attributes to add to the image.
   */
  forceAttributesIntoClass: function (imgElement, fid, view_mode, additional) {
    var wysiwyg = imgElement.attr('wysiwyg');
    if (wysiwyg) {
      imgElement.addClass('attr__wysiwyg__' + wysiwyg);
    }
    var format = imgElement.attr('format');
    if (format) {
      imgElement.addClass('attr__format__' + format);
    }
    var typeOf = imgElement.attr('typeof');
    if (typeOf) {
      imgElement.addClass('attr__typeof__' + typeOf);
    }
    if (fid) {
      imgElement.addClass('img__fid__' + fid);
    }
    if (view_mode) {
      imgElement.addClass('img__view_mode__' + view_mode);
    }
    if (additional) {
      for (var name in additional) {
        if (additional.hasOwnProperty(name)) {
          if (name !== 'alt') {
            imgElement.addClass('attr__' + name + '__' + additional[name]);
          }
        }
      }
    }
  },

  /**
   * Retrieves encoded attributes from the specified class string.
   *
   * @param classString
   *   A string containing the value of the class attribute.
   * @return
   *   An array containing the attribute names as keys, and an object
   *   with the name, value, and attribute type (either 'attr' or
   *   'img', depending on whether it is an image attribute or should
   *   be it the attributes section)
   */
  getAttributesFromClass: function (classString) {
    var actualClasses = [];
    var otherAttributes = [];
    var classes = classString.split(' ');
    var regexp = new RegExp('^(attr|img)__([^\S]*)__([^\S]*)$');
    for (var index = 0; index < classes.length; index++) {
      var matches = classes[index].match(regexp);
      if (matches && matches.length === 4) {
        otherAttributes[matches[2]] = {name: matches[2], value: matches[3], type: matches[1]};
      }
      else {
        actualClasses.push(classes[index]);
      }
    }
    if (actualClasses.length > 0) {
      otherAttributes['class'] = {name: 'class', value: actualClasses.join(' '), type: 'attr'};
    }
    return otherAttributes;
  },

  /*
   *
   */
  sortAttributes: function (a, b) {
    var nameA = a.name.toLowerCase();
    var nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
};

})(jQuery);
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true */

/**
 * Fix the incorrect removal of '%' signs from width values of flash embeds.
 *
 * This plugin address an issue with CKEditor 3.5.1. This plugin can be disabled
 * and removed when the following issue is resolved:
 * @see http://dev.ckeditor.com/ticket/8586
 *
 * The related issue for iframes, http://dev.ckeditor.com/ticket/7114, was
 * resolved by the CKEditor dev team, so there is a good chance this one might
 * get addressed as well.
 */

(function ($) {
  Drupal.wysiwyg.plugins['gardens-flash'] = {
    /**
     * Prepare all plain-text contents of this plugin with HTML representations.
     *
     * @param content
     *   The plain-text contents of a textarea.
     * @param settings
     *   The plugin settings, as provided in the plugin's PHP include file.
     * @param instanceId
     *   The ID of the current editor instance.
     */
    attach: function (content, settings, instanceId) {
      return this.maintainPercentageUnit(content, settings, instanceId);
    },

    /**
     * Process all HTML placeholders of this plugin with plain-text contents.
     *
     * @param content
     *   The HTML content string of the editor.
     * @param settings
     *   The plugin settings, as provided in the plugin's PHP include file.
     * @param instanceId
     *   The ID of the current editor instance.
     */
    detach: function (content, settings, instanceId) {
      return this.maintainPercentageUnit(content, settings, instanceId);
    },
    /**
     * Fix the incorrect removal of '%' signs from width values of flash embeds.
     *
     * @param content
     *   The HTML content string of the editor.
     * @param settings
     *   The plugin settings, as provided in the plugin's PHP include file.
     * @param instanceId
     *   The ID of the current editor instance.
     */
    maintainPercentageUnit: function (content, settings, instanceId) {
      // jQueryify the content
      var $content = $('<div>', {
        html: content
      });
      $content.find('object, embed').each(function (index, element) {
        var $this = $(this);
        var stripPX = function (value) {
          var index = value.indexOf('px');
          if (index === -1) {
            return Number(value);
          }
          else {
            return Number(value.substring(0, index));
          }
        };
        var width = stripPX($this.attr('width')),
            height = stripPX($this.attr('height'));
        // If the width is 100, we might be dealing with an intended value of
        // 100% with the percent symbol stripped off.
        // @see http://dev.ckeditor.com/ticket/8586
        // If the height is greater than the width, we will assume that the
        // width of 100 is wrong, because this would result in a tall, skinny
        // video. This assumption has a small chance of being wrong. If so, this
        // plugin can be disabled for this wysiwyg editor on this text format.
        if (width === 100 && height > width) {
          $this.attr('width', '100%');
        }
      });

      // Return the original content as HTML.
      return $content.html();
    }
  };

}(jQuery));
;
(function ($) {

/**
 * Automatically display the guidelines of the selected text format.
 */
Drupal.behaviors.filterGuidelines = {
  attach: function (context) {
    $('.filter-guidelines', context).once('filter-guidelines')
      .find(':header').hide()
      .parents('.filter-wrapper').find('select.filter-list')
      .bind('change', function () {
        $(this).parents('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .siblings('.filter-guidelines-' + this.value).show();
      })
      .change();
  }
};

})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the uri fragment identifier. 
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($('.error' + anchor, $fieldset).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;

(function ($) {

Drupal.behaviors.menuFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.menu-link-form', context).drupalSetSummary(function (context) {
      if ($('.form-item-menu-enabled input', context).is(':checked')) {
        return Drupal.checkPlain($('.form-item-menu-link-title input', context).val());
      }
      else {
        return Drupal.t('Not in menu');
      }
    });
  }
};

/**
 * Automatically fill in a menu link title, if possible.
 */
Drupal.behaviors.menuLinkAutomaticTitle = {
  attach: function (context) {
    $('fieldset.menu-link-form', context).each(function () {
      // Try to find menu settings widget elements as well as a 'title' field in
      // the form, but play nicely with user permissions and form alterations.
      var $checkbox = $('.form-item-menu-enabled input', this);
      var $link_title = $('.form-item-menu-link-title input', context);
      var $title = $(this).closest('form').find('.form-item-title input');
      // Bail out if we do not have all required fields.
      if (!($checkbox.length && $link_title.length && $title.length)) {
        return;
      }
      // If there is a link title already, mark it as overridden. The user expects
      // that toggling the checkbox twice will take over the node's title.
      if ($checkbox.is(':checked') && $link_title.val().length) {
        $link_title.data('menuLinkAutomaticTitleOveridden', true);
      }
      // Whenever the value is changed manually, disable this behavior.
      $link_title.keyup(function () {
        $link_title.data('menuLinkAutomaticTitleOveridden', true);
      });
      // Global trigger on checkbox (do not fill-in a value when disabled).
      $checkbox.change(function () {
        if ($checkbox.is(':checked')) {
          if (!$link_title.data('menuLinkAutomaticTitleOveridden')) {
            $link_title.val($title.val());
          }
        }
        else {
          $link_title.val('');
          $link_title.removeData('menuLinkAutomaticTitleOveridden');
        }
        $checkbox.closest('fieldset.vertical-tabs-pane').trigger('summaryUpdated');
        $checkbox.trigger('formUpdated');
      });
      // Take over any title change.
      $title.keyup(function () {
        if (!$link_title.data('menuLinkAutomaticTitleOveridden') && $checkbox.is(':checked')) {
          $link_title.val($title.val());
          $link_title.val($title.val()).trigger('formUpdated');
        }
      });
    });
  }
};

})(jQuery);
;

(function ($) {

Drupal.behaviors.commentFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.comment-node-settings-form', context).drupalSetSummary(function (context) {
      return Drupal.checkPlain($('.form-item-comment input:checked', context).next('label').text());
    });

    // Provide the summary for the node type form.
    $('fieldset.comment-node-type-settings-form', context).drupalSetSummary(function(context) {
      var vals = [];

      // Default comment setting.
      vals.push($(".form-item-comment select option:selected", context).text());

      // Threading.
      var threading = $(".form-item-comment-default-mode input:checked", context).next('label').text();
      if (threading) {
        vals.push(threading);
      }

      // Comments per page.
      var number = $(".form-item-comment-default-per-page select option:selected", context).val();
      vals.push(Drupal.t('@number comments per page', {'@number': number}));

      return Drupal.checkPlain(vals.join(', '));
    });
  }
};

})(jQuery);
;

/**
 * Function.prototype.bind is part of the ECMAScript 5 standard and is available
 * natively in newer browsers. For older browsers, we provide a backport.
 * This implementation is based on
 * http://webreflection.blogspot.com/2010/02/functionprototypebind.html
 *
 * See http://drupal.org/node/1025626
 */
if (Function.prototype.bind == null) {
  Function.prototype.bind = (function (slice) {
    function bind (context) {
      var self = this;
      if (1 < arguments.length) {
        // Extra arguments to send by default.
        var $arguments = slice.call(arguments, 1);
        return function () {
          return self.apply(
            context,
            arguments.length ?
              // If we received more than one argument, send them.
              $arguments.concat(slice.call(arguments)) :
              // If there's only one argument, no slice is needed.
              $arguments
          );
        };
      }
      // The simplest and most common case is one argument, so we optimize
      // for that case.
      return function () {
        // Even more optimization for when the function is called
        // without arguments.
        return arguments.length ? self.apply(context, arguments) : self.call(context);
        };
      }

      // Return the named function.
      return bind;

  }(Array.prototype.slice));
}
;
(function ($) {

Drupal.pathautoLivePreview = Drupal.pathautoLivePreview || {};

/**
 * Attaches behavior to the alias "edit" link to make it uncheck the "automatic alias" checkbox.
 */
Drupal.behaviors.pathautoEditLink = {
  attach: function (context, settings) {
    $('a#path-alias-edit-link', context).once('path-alias-edit-link', function() {
      $(this).click(function () {
        $('input[name="path[pathauto]"]').removeAttr('checked').change();
        return false;
      });
    });
  }
};

/**
 * Attaches behavior to the live alias preview to update itself when changes have been made to the form.
 *
 * Also copies the live alias preview to the manual alias input field when the
 * "automatic alias" checkbox becomes unchecked.
 */
Drupal.behaviors.pathautoLivePreview = {
  attach: function (context, settings) {
    // Setup the automatic alias preview to stay updated.
    $('input[name="path[pathauto_live_preview][ajax_trigger]"]').each(function () {
      if (this.id && settings.ajax && settings.ajax[this.id]) {
        var $ajax_trigger = $(this);
        var $alias_preview = $('#' + settings.ajax[this.id].wrapper, context);
        Drupal.pathautoLivePreview.init($alias_preview, $ajax_trigger);
      }
    });
    // Setup the manual alias input field to be initialized with the automatic
    // alias preview when the "automatic alias" checkbox becomes unchecked.
    $('input[name="path[pathauto]"]', context).once('pathauto-live-preview', function() {
      $(this).change(function () {
        if (!$(this).attr('checked')) {
          Drupal.pathautoLivePreview.edit($('.pathauto-live-preview', this.form).eq(0), $('input[name="path[alias]"]', this.form).eq(0));
        }
      });
    });
  }
};

/**
 * Makes the alias preview element "live" by binding a form change event handler.
 *
 * The form change event handler marks the preview element as needing an update,
 * and begins polling for when the preview element becomes visible. An AJAX
 * request is triggered only when the preview element needs an update *and* is
 * visible, so that AJAX requests aren't wasted updating an invisible element
 * (e.g., when its vertical tab isn't open).
 *
 * @todo Not all form fields impact the Pathauto alias. Instead of binding to a
 *   form change, this could be optimized to bind only to the form fields that
 *   affect the alias. This would require the server-side code to determine
 *   what those fields are based on the token pattern, and identify those fields
 *   within Drupal.settings.
 */
Drupal.pathautoLivePreview.init = function($alias_preview, $ajax_trigger) {
  $alias_preview.once('pathauto-live-preview', function() {
    var $form = $($ajax_trigger.get(0).form);
    $form.bind('change.pathautoLivePreview', function(event) {
      // Changing the text formatter in a wysiwyg editor fires a change event.
      // We do not want to run the pathautoLivePreview.poll function for change
      // events triggered by wysiwyg elements or we will break the wysiwyg.
      if(!$(event.target).hasClass('wysiwyg')) {
        $form.unbind('change.pathautoLivePreview');
        if (!$alias_preview.hasClass('pathauto-live-preview-needs-update')) {
          $alias_preview.addClass('pathauto-live-preview-needs-update');
          Drupal.pathautoLivePreview.poll($alias_preview, $ajax_trigger);
        }
      }
    });
  });
}

/**
 * Polls for whether the stale alias preview is visible, and when it is, triggers an AJAX request to update it.
 */
Drupal.pathautoLivePreview.poll = function($alias_preview, $ajax_trigger) {
  if ($alias_preview.is(':visible') && $ajax_trigger.is(':enabled')) {
    $ajax_trigger.change();
  }
  else {
    setTimeout(Drupal.pathautoLivePreview.poll.bind(null, $alias_preview, $ajax_trigger), 1000);
  }
}

/**
 * Copies the current alias preview into the manual alias input field.
 */
Drupal.pathautoLivePreview.edit = function($alias_preview, $alias_edit) {
  if ($alias_preview.length && $alias_edit.length && !$alias_preview.hasClass('pathauto-live-preview-no-alias')) {
    $alias_edit.val($alias_preview.text());
  }
}

})(jQuery);
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true */

(function ($) {

  Drupal.seoUI = Drupal.seoUI || {};

  Drupal.behaviors.seoUI = {
    attach: function (context, settings) {
      // Set the summary of the node edit form vertical tab
      $('fieldset.seo-settings', context).drupalSetSummary(function (context) {
        var output = [];
        // Path and Pathauto
        var path = $('.form-item-path-alias input').val();
        var automatic = $('.form-item-path-pathauto input').attr('checked');

        if (automatic) {
          output.push(Drupal.t('Automatic alias'));
        }
        else if (path) {
          output.push(Drupal.t('URL alias: @alias', {'@alias': path}));
        }
        else {
          output.push(Drupal.t('No alias'));
        }

        // Redirect
        if ($('table.redirect-list', context).size()) {
          if ($('table.redirect-list tbody td.empty', context).size()) {
            output.push(Drupal.t('No redirects'));
          }
          else {
            var redirects = $('table.redirect-list tbody tr').size();
            output.push(Drupal.formatPlural(redirects, '1 redirect', '@count redirects'));
          }
        }

        // Meta tags
        var vals = [];
        var metatags_enabled = false;
        $("input[name*='metatags'][type='text'], select[name*=metatags]", context).each(function () {
          // Assume reasonably that if we are in here Meta tags module is enabled.
          metatags_enabled = true;
          var default_name = $(this).attr('name').replace(/\[value\]/, '[default]');
          var default_value = $("input[type='hidden'][name='" + default_name + "']", context);
          if (default_value.length && default_value.val() === $(this).val()) {
            // Meta tag has a default value and form value matches default value.
            return true;
          }
          else if (!default_value.length && !$(this).val().length) {
            // Meta tag has no default value and form value is empty.
            return true;
          }
          // Show that something changed in any one of the metatags fields
          if (vals.length === 0) {
            vals.push(Drupal.t('Metatag defaults changed'));
          }
        });

        if (metatags_enabled) {
          if (vals.length === 0) {
            output.push(Drupal.t('Using Metatag defaults'));
          }
          else {
            output.push(vals);
          }
        }

        // HTML page title was moved out of Meta tags in its own fieldset.
        // Let the user know that the default value was changed
        var metatags_title = [];
        $("fieldset#edit-metatags-title input[type='text']", context).each(function () {
          var default_name = $(this).attr('name').replace(/value/, 'default');
          var default_value = $("input[type='hidden'][name='" + default_name + "']", context);
          if (default_value.length && default_value.val() === $(this).val()) {
            // Meta tag has a default value and form value matches default value.
            return true;
          }
          else if (!default_value.length && !$(this).val().length) {
            // Meta tag has no default value and form value is empty.
            return true;
          }
          else {
            metatags_title.push(Drupal.t('HTML page title: @value', {'@value': $(this).val()}));
          }
        });

        if (metatags_title.length !== 0) {
          output.push(metatags_title);
        }

        // Join the various vertical tab messages with a break tag in between them.
        return output.join('<br />');
      });
    }
  };
}(jQuery));
;
(function ($) {

/**
 * Attaches the autocomplete behavior to all required fields.
 */
Drupal.behaviors.autocomplete = {
  attach: function (context, settings) {
    var acdb = [];
    $('input.autocomplete', context).once('autocomplete', function () {
      var uri = this.value;
      if (!acdb[uri]) {
        acdb[uri] = new Drupal.ACDB(uri);
      }
      var $input = $('#' + this.id.substr(0, this.id.length - 13))
        .attr('autocomplete', 'OFF')
        .attr('aria-autocomplete', 'list');
      $($input[0].form).submit(Drupal.autocompleteSubmit);
      $input.parent()
        .attr('role', 'application')
        .append($('<span class="element-invisible" aria-live="assertive"></span>')
          .attr('id', $input.attr('id') + '-autocomplete-aria-live')
        );
      new Drupal.jsAC($input, acdb[uri]);
    });
  }
};

/**
 * Prevents the form from submitting if the suggestions popup is open
 * and closes the suggestions popup when doing so.
 */
Drupal.autocompleteSubmit = function () {
  return $('#autocomplete').each(function () {
    this.owner.hidePopup();
  }).size() == 0;
};

/**
 * An AutoComplete object.
 */
Drupal.jsAC = function ($input, db) {
  var ac = this;
  this.input = $input[0];
  this.ariaLive = $('#' + $input.attr('id') + '-autocomplete-aria-live');
  this.db = db;

  $input
    .keydown(function (event) { return ac.onkeydown(this, event); })
    .keyup(function (event) { ac.onkeyup(this, event); })
    .blur(function () { ac.hidePopup(); ac.db.cancel(); });

};

/**
 * Handler for the "keydown" event.
 */
Drupal.jsAC.prototype.onkeydown = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 40: // down arrow.
      this.selectDown();
      return false;
    case 38: // up arrow.
      this.selectUp();
      return false;
    default: // All other keys.
      return true;
  }
};

/**
 * Handler for the "keyup" event.
 */
Drupal.jsAC.prototype.onkeyup = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 16: // Shift.
    case 17: // Ctrl.
    case 18: // Alt.
    case 20: // Caps lock.
    case 33: // Page up.
    case 34: // Page down.
    case 35: // End.
    case 36: // Home.
    case 37: // Left arrow.
    case 38: // Up arrow.
    case 39: // Right arrow.
    case 40: // Down arrow.
      return true;

    case 9:  // Tab.
    case 13: // Enter.
    case 27: // Esc.
      this.hidePopup(e.keyCode);
      return true;

    default: // All other keys.
      if (input.value.length > 0)
        this.populatePopup();
      else
        this.hidePopup(e.keyCode);
      return true;
  }
};

/**
 * Puts the currently highlighted suggestion into the autocomplete field.
 */
Drupal.jsAC.prototype.select = function (node) {
  this.input.value = $(node).data('autocompleteValue');
};

/**
 * Highlights the next suggestion.
 */
Drupal.jsAC.prototype.selectDown = function () {
  if (this.selected && this.selected.nextSibling) {
    this.highlight(this.selected.nextSibling);
  }
  else if (this.popup) {
    var lis = $('li', this.popup);
    if (lis.size() > 0) {
      this.highlight(lis.get(0));
    }
  }
};

/**
 * Highlights the previous suggestion.
 */
Drupal.jsAC.prototype.selectUp = function () {
  if (this.selected && this.selected.previousSibling) {
    this.highlight(this.selected.previousSibling);
  }
};

/**
 * Highlights a suggestion.
 */
Drupal.jsAC.prototype.highlight = function (node) {
  if (this.selected) {
    $(this.selected).removeClass('selected');
  }
  $(node).addClass('selected');
  this.selected = node;
  $(this.ariaLive).html($(this.selected).html());
};

/**
 * Unhighlights a suggestion.
 */
Drupal.jsAC.prototype.unhighlight = function (node) {
  $(node).removeClass('selected');
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Hides the autocomplete suggestions.
 */
Drupal.jsAC.prototype.hidePopup = function (keycode) {
  // Select item if the right key or mousebutton was pressed.
  if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
    this.input.value = $(this.selected).data('autocompleteValue');
  }
  // Hide popup.
  var popup = this.popup;
  if (popup) {
    this.popup = null;
    $(popup).fadeOut('fast', function () { $(popup).remove(); });
  }
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Positions the suggestions popup and starts a search.
 */
Drupal.jsAC.prototype.populatePopup = function () {
  var $input = $(this.input);
  var position = $input.position();
  // Show popup.
  if (this.popup) {
    $(this.popup).remove();
  }
  this.selected = false;
  this.popup = $('<div id="autocomplete"></div>')[0];
  this.popup.owner = this;
  $(this.popup).css({
    top: parseInt(position.top + this.input.offsetHeight, 10) + 'px',
    left: parseInt(position.left, 10) + 'px',
    width: $input.innerWidth() + 'px',
    display: 'none'
  });
  $input.before(this.popup);

  // Do search.
  this.db.owner = this;
  this.db.search(this.input.value);
};

/**
 * Fills the suggestion popup with any matches received.
 */
Drupal.jsAC.prototype.found = function (matches) {
  // If no value in the textfield, do not show the popup.
  if (!this.input.value.length) {
    return false;
  }

  // Prepare matches.
  var ul = $('<ul></ul>');
  var ac = this;
  for (key in matches) {
    $('<li></li>')
      .html($('<div></div>').html(matches[key]))
      .mousedown(function () { ac.select(this); })
      .mouseover(function () { ac.highlight(this); })
      .mouseout(function () { ac.unhighlight(this); })
      .data('autocompleteValue', key)
      .appendTo(ul);
  }

  // Show popup with matches, if any.
  if (this.popup) {
    if (ul.children().size()) {
      $(this.popup).empty().append(ul).show();
      $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
    }
    else {
      $(this.popup).css({ visibility: 'hidden' });
      this.hidePopup();
    }
  }
};

Drupal.jsAC.prototype.setStatus = function (status) {
  switch (status) {
    case 'begin':
      $(this.input).addClass('throbbing');
      $(this.ariaLive).html(Drupal.t('Searching for matches...'));
      break;
    case 'cancel':
    case 'error':
    case 'found':
      $(this.input).removeClass('throbbing');
      break;
  }
};

/**
 * An AutoComplete DataBase object.
 */
Drupal.ACDB = function (uri) {
  this.uri = uri;
  this.delay = 300;
  this.cache = {};
};

/**
 * Performs a cached and delayed search.
 */
Drupal.ACDB.prototype.search = function (searchString) {
  var db = this;
  this.searchString = searchString;

  // See if this string needs to be searched for anyway.
  searchString = searchString.replace(/^\s+|\s+$/, '');
  if (searchString.length <= 0 ||
    searchString.charAt(searchString.length - 1) == ',') {
    return;
  }

  // See if this key has been searched for before.
  if (this.cache[searchString]) {
    return this.owner.found(this.cache[searchString]);
  }

  // Initiate delayed search.
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(function () {
    db.owner.setStatus('begin');

    // Ajax GET request for autocompletion. We use Drupal.encodePath instead of
    // encodeURIComponent to allow autocomplete search terms to contain slashes.
    $.ajax({
      type: 'GET',
      url: db.uri + '/' + Drupal.encodePath(searchString),
      dataType: 'json',
      success: function (matches) {
        if (typeof matches.status == 'undefined' || matches.status != 0) {
          db.cache[searchString] = matches;
          // Verify if these are still the matches the user wants to see.
          if (db.searchString == searchString) {
            db.owner.found(matches);
          }
          db.owner.setStatus('found');
        }
      },
      error: function (xmlhttp) {
        alert(Drupal.ajaxError(xmlhttp, db.uri));
      }
    });
  }, this.delay);
};

/**
 * Cancels the current autocomplete request.
 */
Drupal.ACDB.prototype.cancel = function () {
  if (this.owner) this.owner.setStatus('cancel');
  if (this.timer) clearTimeout(this.timer);
  this.searchString = '';
};

})(jQuery);
;

(function ($) {

Drupal.behaviors.nodeFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.node-form-revision-information', context).drupalSetSummary(function (context) {
      var revisionCheckbox = $('.form-item-revision input', context);

      // Return 'New revision' if the 'Create new revision' checkbox is checked,
      // or if the checkbox doesn't exist, but the revision log does. For users
      // without the "Administer content" permission the checkbox won't appear,
      // but the revision log will if the content type is set to auto-revision.
      if (revisionCheckbox.is(':checked') || (!revisionCheckbox.length && $('.form-item-log textarea', context).length)) {
        return Drupal.t('New revision');
      }

      return Drupal.t('No revision');
    });

    $('fieldset.node-form-author', context).drupalSetSummary(function (context) {
      var name = $('.form-item-name input', context).val() || Drupal.settings.anonymous,
        date = $('.form-item-date input', context).val();
      return date ?
        Drupal.t('By @name on @date', { '@name': name, '@date': date }) :
        Drupal.t('By @name', { '@name': name });
    });

    $('fieldset.node-form-options', context).drupalSetSummary(function (context) {
      var vals = [];

      $('input:checked', context).parent().each(function () {
        vals.push(Drupal.checkPlain($.trim($(this).text())));
      });

      if (!$('.form-item-status input', context).is(':checked')) {
        vals.unshift(Drupal.t('Not published'));
      }
      return vals.join(', ');
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Remove publication status from the "Content promotion options" vertical tab.
 */
Drupal.behaviors.saveDraftFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.node-promotion-options', context).drupalSetSummary(function (context) {
      var vals = [];

      $('input:checked', context).parent().each(function () {
        vals.push(Drupal.checkPlain($.trim($(this).text())));
      });
      if (vals.length) {
        return vals.join(', ');
      }
      else {
        return Drupal.t('Not promoted');
      }
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.menuFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.block-form', context).drupalSetSummary(function (context) {
      if ($('#edit-media-gallery-expose-block-und', context).attr('checked')) {
        return Drupal.t('Enabled');
      }
      else {
        return Drupal.t('Not enabled');
      }
    });
  }
};

Drupal.behaviors.media_gallery_form = {};
Drupal.behaviors.media_gallery_form.attach = function (context, settings) {
  // Change the "Presentation settings" image to match the radio buttons / checkbox.
  var inputs = $('.presentation-settings input', context);
  if (inputs.length) {
    inputs.bind('change', Drupal.behaviors.media_gallery_form.format_select);
    Drupal.behaviors.media_gallery_form.format_select();
  }
};

Drupal.behaviors.media_gallery_form.format_select = function (event) {
  var radioValue = $('.presentation-settings input:radio:checked').val();
  var icon = $('.presentation-settings .setting-icon');
  var checkbox = $('.presentation-settings .field-name-media-gallery-lightbox-extras input');

  // Depending on the radio button chosen add a class
  if (radioValue == 'node') {
    icon.attr('class', 'setting-icon display-page');
    // Disable the checkbox
    checkbox.attr('disabled', true);
  } else {
    icon.attr('class', 'setting-icon display-lightbox');
    // Turn on the checkbox
    checkbox.attr('disabled', false);
    // Add a class if the checkbox is checked
    if (checkbox.is(':checked')) {
      icon.attr('class', 'setting-icon display-extras');
    }
  }
};

})(jQuery);
;
/* Based on overlay-parent.js,v 1.22 2010/01/14 04:06:54 webchick */

(function ($) {

// Only act if overlay is found.
if (!Drupal.overlay) {
  return;
}

/**
 * Event handler: opens or closes the overlay based on the current URL fragment.
 *
 * @param event
 *   Event being triggered, with the following restrictions:
 *   - event.type: hashchange
 *   - event.currentTarget: document
 *
 * Overrides the same method from overlay-parent.js
 */
Drupal.overlay.eventhandlerOperateByURLFragment = function (event) {
  // If we changed the hash to reflect an internal redirect in the overlay,
  // its location has already been changed, so don't do anything.
  if ($.data(window.location, window.location.href) === 'redirect') {
    $.data(window.location, window.location.href, null);
    return;
  }

  // Get the overlay URL from the current URL fragment.
  var state = $.bbq.getState('overlay');
  if (state) {
    // Append render variable, so the server side can choose the right
    // rendering and add child frame code to the page if needed.
    var url = $.param.querystring(Drupal.settings.basePath + state, { render: 'overlay' });

    this.open(url);
    this.resetActiveClass(this.getPath(Drupal.settings.basePath + state));

    // @gardens: look for gardener specific paths.
    var isGardener = (state.indexOf('gardener/') > -1);
    if (isGardener) {
      // Ok, now we can tell the parent window we're ready.
      // @todo revisit this to use the overlay API more properly.
      $(this.inactiveFrame).addClass('overlay-active');
    }
  }

  // If there is no overlay URL in the fragment and the overlay is (still)
  // open, close the overlay.
  else if (this.isOpen && !this.isClosing) {
    this.close();
    this.resetActiveClass(this.getPath(window.location));
  }
};

})(jQuery);
;
(function($) {

Drupal.behaviors.gardensHelp = {
  attach: function(context) {
          Drupal.gardensHelp.init(context);
  }
};

Drupal.gardensHelp = Drupal.gardensHelp || {};

Drupal.gardensHelp.init = function(context) {
  // Move help area to inside the toolbar, so the toolbar resizes with it.
  var helpHeader = $('#help-header').html();
  $('#help-header').remove();
  $('#toolbar').prepend('<div id="help-header" style="display: none;">' + helpHeader + '</div>');

  // Bind our click handler to the help item.
  $('#toolbar-user .help a', context).bind('click', Drupal.gardensHelp.open);

  // Bind search submission handler to search form.
  $('#gardens-help-search-form').bind('submit', Drupal.gardensHelp.searchSubmit);

  // Bind links in the help header so that they will open a single new window
  $('#help-header a').bind('click', Drupal.gardensHelp.helpClick);
};

Drupal.gardensHelp.open = function() {
  $("#help-header").slideToggle("slow", Drupal.gardensHelp.positionOverlay);
  $("#toolbar-user .help").toggleClass("help-active");
  // Blur the link so that the :active suedo-class doesn't cause it to have the grey background
  $("#toolbar-user .help a").blur();
  return false;
};

Drupal.gardensHelp.positionOverlay = function() {
  // As the toolbar is an overlay displaced region, overlay should be
  // notified of it's height change to adapt its position.
  $('body').css('paddingTop', Drupal.toolbar.height());
  $(window).triggerHandler('resize.overlay-event');

  // Porting the fix for IE and the slideToggle from the Gardener
  var wrapper = $(this).parent();
  if (wrapper.css('zoom') != 1) {
    wrapper.css('zoom', 1);
  } else {
    wrapper.css('zoom', '');
  }
}

Drupal.gardensHelp.searchSubmit = function(event) {
  // This method needs to work the same way as the link click handler so that it doesn't create an additional window
  event.preventDefault();
  if (Drupal.gardensHelp.helpWindow) {
          Drupal.gardensHelp.helpWindow.close();
  }
  // The Gardener will read the URL arguments and take care of the lack of a POST submition
  Drupal.gardensHelp.helpWindow = window.open(Drupal.settings.gardenerHelpSearchURL + '/search/apachesolr_search/' + $('#gardens-help-search-query').val(), 'gardens_help');

}

Drupal.gardensHelp.helpClick = function (event) {
  // Stop normal link behavior
  event.preventDefault();

  // If there has already been a window created by the help drop down, close it.  Creating a new window will put focus on that window.
  if (Drupal.gardensHelp.helpWindow) {
    Drupal.gardensHelp.helpWindow.close();
  }
  Drupal.gardensHelp.helpWindow = window.open($(event.target).attr('href'), 'gardens_help');
};

})(jQuery);
;
/*jslint bitwise: true, eqeqeq: true, immed: true, newcap: true, nomen: false,
 onevar: false, plusplus: false, regexp: true, undef: true, white: true, indent: 2
 browser: true */

/*global jQuery: true Drupal: true window: true ThemeBuilder: true */

(function ($) {

  /**
   * Override for the extlink module.
   *
   * ThemeBuilder requires the <a> and <span> tags for external links to have
   * different classes, so they can be targeted separately.
   */
  Drupal.extlink = Drupal.extlink || {};

  Drupal.behaviors.extlink = Drupal.behaviors.extlink || {};

  Drupal.behaviors.extlink.attach = function (context, settings) {
    // Add "-link" to the end of the class name that's applied to both <a> and
    // <span> tags. We will remove it later before applying it to <span> tags.
    if (Drupal.settings.extlink && Drupal.settings.extlink.extClass) {
      Drupal.settings.extlink.extClass = Drupal.settings.extlink.extClass + '-link';
    }
    if ($.isFunction(Drupal.extlink.attach)) {
      Drupal.extlink.attach(context, settings);
    }
  };

  /**
   * Overrides method from the extlink module.
   *
   * Change the class name for the <span> that comes after external links,
   * so that it's "ext", not "ext-link".
   */
  Drupal.extlink.applyClassAndSpan = function (links, class_name) {
    var $links_to_process;
    if (parseFloat($().jquery) < 1.2) {
      $links_to_process = $(links).not('[img]');
    }
    else {
      var links_with_images = $(links).find('img').parents('a');
      $links_to_process = $(links).not(links_with_images);
    }
    $links_to_process.addClass(class_name);
    var i;
    var length = $links_to_process.length;
    // If we've added "-link" to the end of the class name, remove it for
    // <span> tags. We want "-link" only at the end of the link class.
    var span_class = class_name.replace(/-link$/, '');
    for (i = 0; i < length; i++) {
      var $link = $($links_to_process[i]);
      if ($link.css('display') === 'inline') {
        $link.after('<span class=' + span_class + '></span>');
      }
    }
  };

  /**
   * Stop the rotation in the Rotating Banner when the ThemeBuilder is open
   */
  Drupal.behaviors.RotatingBannerInThemeBuilder = {
    attach: function (context) {
      if ($('body').hasClass('themebuilder')) {
        $('.rb-slides').each(function () {
          if ($(this).cycle) {
            $(this).cycle('stop');
          }
        });
      }
    }
  };

  /**
   * Activate Superfish Pulldown menus
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus = {
    attach: function (context, settings) {
      Drupal.behaviors.GardensFeaturesPulldownMenus.settings = {
        appearance: {
          gutter: 10,
          push: 2,
          overlapOffset: 1.4545
        }
      };
      if (settings) {
        $.extend(Drupal.behaviors.GardensFeaturesPulldownMenus.settings, settings);
      }
      if ($().superfish) {
        $('.content > .menu', '#page .stack-navigation').once('pulldown', function () {
          $(this).superfish({
            hoverClass: 'menu-dropdown-hover',
            delay: 150,
            dropShadows: false,
            speed: 300,
            autoArrows: true,
            onBeforeShow: Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldown
          });
        }).addClass('pulldown');
      }
    }
  };

  /**
   * This function is run to adjust the placement of a pulldown.
   *
   * @param {DomElement} this
   *   The pulldown (ul) that is currently being shown.
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldown = function () {
    $(this).css({display: 'block', visibility: 'hidden'});
    Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldownPlacement($(this));
    $(this).css({display: 'none', visibility: 'visible'});
  };

  /**
   * Progressively increases the width of the pulldown by 33% until
   * the height of each item is less than the line height
   *
   * @param {DomElement} pulldown
   *   The pulldown (ul) to be positioned
   * @param {DomElement} item
   *   The anchor tag of an item in the list
   * @param {int} lineHeight
   *   The line height of the item's anchor tag. This is passed in
   *   because it does not need to be calculated more than once
   * @param {int} safety
   *   A counter to prevent recursive errors. The width of the pulldown
   *   will be adjusted at most 5 times currently.
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldownWidth = function (pulldown, item, lineHeight, safety) {
    var width = pulldown.width();
    var height = item.height();
    var wrapped = ((height - lineHeight) > 2) ? true : false; // Provide a little give with a 2 pixel fudge factor for IE7
    if (wrapped && (safety < 5)) {
      pulldown.animate({
          width: width * 1.2
        },
        {
          duration: 0,
          queue: true,
          complete: function () {
            safety += 1;
            Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldownWidth(pulldown, item, lineHeight, safety);
          }
        }
      );
    }
  };

  /**
   * Moves a pulldown left or right, according to its alignment, after its
   * parent's width has been adjusted
   *
   * @param {DomElement} pulldown
   *   The pulldown (ul) to be positioned
   */
  Drupal.behaviors.GardensFeaturesPulldownMenus.adjustPulldownPlacement = function (element) {
    var pulldown = {};
    pulldown.el = element;
    var isRTL = ($('html').attr('dir') === 'rtl');

    // Wipe out any previous positioning
    pulldown.el.removeAttr('style');

    // Get the depth of the sub menu
    // 0 is first tier sub menu
    // 1 is second tier sub menu, etc
    var depth = pulldown.el.parentsUntil('.pulldown-processed').filter('.menu').length;
    pulldown.parent = {};
    pulldown.parent.el = element.prev('a');
    pulldown.parent.css = {
      lineHeight: Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX(pulldown.parent.el.css('line-height')),
      padding: {
        top: Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX(pulldown.parent.el.css('padding-top'))
      },
      margin: {
        top: Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX(pulldown.parent.el.css('margin-top'))
      }
    };
    // Only consider pulldowns, not the main menu items
    // Basic placement without edge detection
    var root = {};
    root.el = pulldown.el.parents('.pulldown-processed li .menu');
    if (root.el && (root.el.length > 0)) {
      pulldown.el.css({
        left: root.el.width()
      });
    }
    // Get the viewport and scroll information
    var viewport = {};
    viewport.width = $(window).width(); // Width of the visible viewport
    viewport.height = $(window).height(); // Height of the visible viewport
    viewport.scroll = {};
    viewport.scroll.top = $(window).scrollTop();
    pulldown.pos = pulldown.el.position();
    // pushDir corresponds to the RTL setting
    var pushDir = (isRTL) ? 'right' : 'left';
    // handDir corresponds to which edge of the screen the menus might collide with. It is the opposite
    // of pushDir.
    var hangDir = (pushDir === 'right') ? 'left' : 'right';
    // Move the pulldown back to its origin if we moved it because of edge correction previously
    var prevCorrection = Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX(pulldown.el.css(pushDir));
    if (prevCorrection < 0) {
      pulldown.el.css[pushDir] = pulldown.pos[pushDir] = 0;
    }
    // Now check for edge collision
    pulldown.offset = pulldown.el.offset();
    if (pulldown.offset) {
      pulldown.width = pulldown.el.outerWidth(false);
      pulldown.height = pulldown.el.outerHeight(false);
      pulldown.edge = {};
      pulldown.edge.left = pulldown.offset.left;
      pulldown.edge.right = pulldown.offset.left + pulldown.width;
      pulldown.edge.bottom = pulldown.offset.top + pulldown.height;
      pulldown.hang = {};
      pulldown.hang.left = pulldown.edge.left;
      pulldown.hang.right = viewport.width - pulldown.edge.right;
      pulldown.hang.bottom = (viewport.height + viewport.scroll.top) - pulldown.edge.bottom  - Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.gutter;
      pulldown.hang.bottomModified = 1;
      pulldown.correction = {};
      pulldown.correction.left = pulldown.pos.left + pulldown.hang.right - Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.gutter;
      pulldown.correction.right = (depth > 0) ?
        pulldown.hang.left + pulldown.width - Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.gutter :
        pulldown.hang.left - Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.gutter;

      // Move the pulldown back onto the screen
      if (pulldown.hang[hangDir] <= 0) {
        var leftVal = (pushDir === 'left') ? pulldown.correction.left : 'auto';
        var rightVal = (pushDir === 'right') ? pulldown.correction.right : 'auto';
        pulldown.el.css(
          {
            'left': leftVal,
            'right': rightVal
          }
        );
        // Push the pulldown down half a line height if it is a sub-sub menu so that sub menu items aren't completely occluded.
        if (depth > 0) {
          var top = (((pulldown.parent.css.lineHeight) / Drupal.behaviors.GardensFeaturesPulldownMenus.settings.appearance.overlapOffset) + (pulldown.parent.css.padding.top) + (pulldown.parent.css.margin.top));
          pulldown.el.css('top', top);
          pulldown.hang.bottomModified = pulldown.hang.bottom - top;
        }
      }
      // Move the pulldown up if it hangs off the bottom
      if (pulldown.hang.bottom <= 0 || pulldown.hang.bottomModified <= 0) {
        pulldown.el.css('top', (pulldown.pos.top + pulldown.hang.bottom));
      }
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
  Drupal.behaviors.GardensFeaturesPulldownMenus._stripPX = function (value) {
    if (value) {
      var index = value.indexOf('px');
      if (index === -1) {
        return NaN;
      }
      else {
        return Number(value.substring(0, index));
      }
    }
    else {
      return NaN;
    }
  };

  /**
   * Add a "Show/Hide disabled views" toggle link to the Views list on
   * admin/structure/views, similar to the "Show/Hide row weights" link on
   * tabledrag tables.
   */
  Drupal.behaviors.GardensFeaturesViewsListFilter = {
    attach: function (context, settings) {
      $('body.page-admin-structure-views table.#ctools-export-ui-list-items').once('gardens-features-views-list-filter', function () {
        var $table = $(this);

        // Remove any prior links created (for when table gets replaced by AJAX)
        $('.gardens-features-toggle-disabled-wrapper').remove();

        // Create the toggle link, initialized to reflect that all rows are
        // currently shown.
        var $link = $('<a href="#" class="gardens-features-toggle-disabled gardens-features-toggle-disabled-show"></a>')
          .text(Drupal.t('Hide disabled views'))
          .click(function () {
            if ($(this).hasClass('gardens-features-toggle-disabled-show')) {
              $(this).removeClass('gardens-features-toggle-disabled-show');
              $(this).addClass('gardens-features-toggle-disabled-hide');
              $('.ctools-export-ui-disabled', $table).hide();
              if ($('tbody tr', $table).length === $('.ctools-export-ui-disabled', $table).length) {
                $('tbody', $table).prepend('<tr class="gardens-features-toggle-disabled-empty odd"><td colspan="5">' + Drupal.t('No enabled views found.') + '</td></tr>');
              }
              $.cookie('Drupal.GardensFeaturesViewsListFilter.showDisabled', 0, {path: Drupal.settings.basePath, expires: 365});
              $(this).text(Drupal.t('Show disabled views'));
            }
            else {
              $(this).removeClass('gardens-features-toggle-disabled-hide');
              $(this).addClass('gardens-features-toggle-disabled-show');
              $('.ctools-export-ui-disabled', $table).show();
              $('.gardens-features-toggle-disabled-empty', $table).remove();
              $.cookie('Drupal.GardensFeaturesViewsListFilter.showDisabled', 1, {path: Drupal.settings.basePath, expires: 365});
              $(this).text(Drupal.t('Hide disabled views'));
            }
            return false;
          });

        // Add it before the table.
        $table.before($link.wrap('<div class="gardens-features-toggle-disabled-wrapper"></div>').parent());

        // Unless there's a cookie for disabled views to be shown, "click" the
        // link in order to hide them.
        if ($.cookie('Drupal.GardensFeaturesViewsListFilter.showDisabled') !== '1') {
          $link.click();
        }

        // If the filter form is also active, remove the widget to filter by
        // enabled/disabled status, to not conflict with the toggle link.
        $('#ctools-export-ui-list-form .form-item-disabled').hide();
      });
    }
  };

  /**
   * Open all links to Drupal Gardens "Learn More" pages in a new window.
   */
  Drupal.behaviors.GardensFeaturesLearnMoreLinks = {
    attach: function (context, settings) {
      $('a[href^="http://www.drupalgardens.com/learnmore/"]', context).attr('target', '_blank');
    }
  };


  /**
   * Scroll to top of AJAX view on pager click.
   */
  Drupal.behaviors.viewsAjaxScroll = {
    attach: function (context, settings) {
      if (typeof Drupal.settings.views !== 'undefined' &&
          typeof Drupal.settings.views.ajax_path !== 'undefined' &&
          typeof Drupal.behaviors.ViewsLoadMore === 'undefined') {
        // make sure we have AJAX, but not load_more
        $('.item-list .pager a').not('a.load-more').once('views-ajax-scroll').click(function ()
        {
          var outer = $(this).parents('.view');
          if ($(outer).parents('.pane').length) {
            // if there is surrounding pane, scroll to top of it
            outer = $(outer).parents('.pane');
          }
          else if ($(outer).parents('.block').length) {
            // if there is surrounding block, scroll top top of it
            outer = $(outer).parents('.block');
          }
          var viewtop = outer.offset().top - $('#toolbar').outerHeight();
          $('html, body').animate({scrollTop: viewtop}, 'slow', 'linear');
        });
      }
    }
  };

  /**
   * Add dialog behavior to /user links for anonymous users.
   */
  Drupal.behaviors.gardensUserDialog = {};
  Drupal.behaviors.gardensUserDialog.attach = function (context, settings) {
    if (settings.gardensFeatures && settings.gardensFeatures.userIsAnonymous && settings.gardensFeatures.dialogUserEnabled) {
      // Modify all /user links so that they appear in a popup dialog.
      var links = $('a[href^=/user]').once('user-dialog');
      var length = links.length;
      if (links.length === 0) {
        return;
      }
      var i, link, intab;
      for (i = 0; i < length; i++) {
        link = links[i];
        // Is the link in a tab (e.g. on the user login register or password pages)
        intab = $(link).parents().filter('ul.tabs');
        // Only act on the following types of links:
        // /user, /user/login, /user/register, /user/password
        // Ignore links that were already set up correctly on the server side.
        if (link.href.indexOf('nojs') === -1 && link.href.indexOf('ajax') === -1) {
          if (link.href.match(/\/user$/)) {
            if(intab.length == 0) {
              link.href = '/user/login/ajax';
            }
            else {
              link.href = '/user/login/nojs';
            }
            $(link).addClass('use-ajax use-dialog');
          }
          else if (link.href.match(/\/user\/(login|register|password)$/)) {
            if(intab.length == 0) {
                    link.href = link.href.replace(/\/user\/(login|register|password)/, '/user/$1/ajax');
            }
            else {
              link.href = link.href.replace(/\/user\/(login|register|password)/, '/user/$1/nojs');
            }
            $(link).addClass('use-ajax use-dialog');
          }
        }
      }
      // The AJAX and dialog behaviors have already run; rerun them to pick up
      // newly ajaxified links.
      Drupal.behaviors.AJAX.attach(context, settings);
      Drupal.behaviors.dialog.attach(context, settings);
    }
  };

  // Disable the lazyloader: http://drupal.org/node/665128#comment-5301192
  if (typeof(Drupal.ajax) !== 'undefined') {
    Drupal.ajax.prototype.commands.xlazyloader = function () {};
  }
}(jQuery));
;
