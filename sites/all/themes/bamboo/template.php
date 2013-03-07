<?php

/**
 * @file
 * Template.php provides theme functions & overrides
 */

/**
 * Implements hook_preprocess_html().
 */
function bamboo_preprocess_html(&$vars) {
  drupal_add_css('//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700',array('type' => 'external'));
  drupal_add_css('//fonts.googleapis.com/css?family=Rosarivo:400,400italic&subset=latin,latin-ext',array('type' => 'external'));

  // Add a body class is the site name is hidden.
  if (theme_get_setting('toggle_name') == FALSE) {
    $vars['classes_array'][] = 'site-name-hidden';
  }

  // Add IE 8 fixes style sheet.
  drupal_add_css(path_to_theme() . '/css/ie8-fixes.css',
    array(
      'group' => CSS_THEME,
      'browsers' =>
      array(
        'IE' => 'lte IE 8',
        '!IE' => FALSE),
      'preprocess' => FALSE));

  // Extra body classes for theme variables.
  // The background.
  // $file = theme_get_setting('theme_bg') . '-style';
  $file = theme_get_setting('theme_bg');
  /* drupal_add_css(path_to_theme() . '/css/'.
  $file, array('group' => CSS_THEME, 'weight' =>
  115,'browsers' => array(), 'preprocess' => FALSE)); */
  $vars['classes_array'][] = drupal_html_class('bg-' . $file);

  // The Color Palette.
  $file = theme_get_setting('theme_color_palette');
  $vars['classes_array'][] = drupal_html_class('color-palette-' . $file);

  // The header font style.
  $file = theme_get_setting('header_font_style');
  $vars['classes_array'][] = drupal_html_class('header-font-' . $file);

  // The body font style.
  $file = theme_get_setting('body_font_style');
  $vars['classes_array'][] = drupal_html_class('body-font-' . $file);

  // Sidebar location.
  $file = theme_get_setting('theme_sidebar_location');
  $vars['classes_array'][] = drupal_html_class($file);

  // Use local.css if true.
  if (theme_get_setting('bamboo_localcss') == TRUE) {
     drupal_add_css(path_to_theme() . '/css/local.css',
      array(
        'group' => CSS_THEME,
        'media' => 'screen',
        'preprocess' => TRUE,
        'weight' => '9999',
      )
    );
  }

  drupal_add_js(path_to_theme() . '/js/scripts.js',
    array(
      'group' => JS_THEME,
      'preprocess' => TRUE,
      'weight' => '9999',
    )
  );

  // Use tertiary menus = true.
  if (theme_get_setting('bamboo_tertiarymenu') == TRUE) {
    $vars['classes_array'][] = drupal_html_class('tertiarymenu');
  }

  if (!$vars['is_front']) {
    // Add unique class for each page.
    $path = drupal_get_path_alias($_GET['q']);
    // Add unique class for each website section.
    list($section,) = explode('/', $path, 2);
    $arg = explode('/', $_GET['q']);
    if ($arg[0] == 'node' && isset($arg[1])) {
      if ($arg[1] == 'add') {
        $section = 'node-add';
      }
      elseif (isset($arg[2]) && is_numeric($arg[1]) && ($arg[2] == 'edit' || $arg[2] == 'delete')) {
        $section = 'node-' . $arg[2];
      }
    }
    $vars['classes_array'][] = drupal_html_class('section-' . $section);
  }
}

/**
 * Custom functions for the theme
 */

/**
 * Implements hook_html_head_alter().
 */
function bamboo_html_head_alter(&$head_elements) {
  // Overwrite default meta character tag with HTML5 version.
  $head_elements['system_meta_content_type']['#attributes'] = array(
    'charset' => 'utf-8',
  );
}

/**
 * Preprocesses variables for theme_username().
 *
 * Modules that make any changes to variables like 'name' or 'extra' must insure
 * that the final string is safe to include directly in the output by using
 * check_plain() or filter_xss().
 *
 * @see template_process_username()
 */
function bamboo_preprocess_username(&$vars) {

  // Update the username so it's the full name of the user.
  $account = $vars['account'];

  // Revise the name trimming done in template_preprocess_username.
  $name = $vars['name_raw'] = format_username($account);

  // Trim the altered name as core does, but with a higher character limit.
  if (drupal_strlen($name) > 35) {
    $name = drupal_substr($name, 0, 18) . '...';
  }

  // Assign the altered name to $vars['name'].
  $vars['name'] = check_plain($name);

}

/**
 * Insert themed breadcrumb page navigation at top of the node content.
 */
function bamboo_breadcrumb($vars) {

  // Show breadcrumbs if checked.
  if (theme_get_setting('breadcrumbs') == 1) {

    // Theme the breadcrumbs.
    $breadcrumb = $vars['breadcrumb'];
    if (!empty($breadcrumb)) {
      // Use CSS to hide titile .element-invisible.
      $output = '<h2 class="element-invisible">' . t('You are here') . '</h2>';
      // Comment below line to hide current page to breadcrumb.
      $breadcrumb[] = drupal_get_title();
      $output .= '<nav class="breadcrumb">' . implode(' » ', $breadcrumb) . '</nav>';
      return $output;
    }
  }
}

/**
 * Override or insert variables into the page template.
 */
function bamboo_preprocess_page(&$vars) {
  // Set variable for theme native main menu with sub links.
  if (!empty($vars['main_menu'])) {
  // Get the entire main menu tree.
  $main_menu_tree = menu_tree_all_data('main-menu');
  // Add the rendered output to the $primary_nav variable.
  $vars['primary_nav'] = menu_tree_output($main_menu_tree);
  }

  else {
    // Don't show the menu if unchecked in the theme settings.
    $vars['primary_nav'] = FALSE;
  }

  // If the default logo is used, then determine which color and set the path.
  $file = theme_get_setting('theme_color_palette');
  if (theme_get_setting('bamboo_themelogo') == TRUE) {
    $vars['logo'] = base_path() . path_to_theme() . '/images/' . $file . '-logo.png';
  }

}

/**
 * Duplicate of theme_menu_local_tasks() but adds clearfix to tabs.
 */
function bamboo_menu_local_tasks(&$vars) {
  $output = '';

  if (!empty($vars['primary'])) {
    $vars['primary']['#prefix'] = '<h2 class="element-invisible">' . t('Primary tabs') . '</h2>';
    $vars['primary']['#prefix'] .= '<ul class="tabs primary clearfix">';
    $vars['primary']['#suffix'] = '</ul>';
    $output .= drupal_render($vars['primary']);
  }
  if (!empty($vars['secondary'])) {
    $vars['secondary']['#prefix'] = '<h2 class="element-invisible">' . t('Secondary tabs') . '</h2>';
    $vars['secondary']['#prefix'] .= '<ul class="tabs secondary clearfix">';
    $vars['secondary']['#suffix'] = '</ul>';
    $output .= drupal_render($vars['secondary']);
  }
  return $output;
}


/**
 * Override or insert variables into the node template.
 */
function bamboo_preprocess_node(&$vars) {
  $node = $vars['node'];
  if ($vars['view_mode'] == 'full' && node_is_page($vars['node'])) {
    $vars['classes_array'][] = 'node-full';
  }

  if ($vars['view_mode'] == 'teaser' && node_is_page($vars['node'])) {
    $vars['classes_array'][] = 'node-teaser';
  }

  // Some nice expanded classes for Nodes.
  $vars['attributes_array']['role'][] = 'article';
  $vars['title_attributes_array']['class'][] = 'article-title';
  $vars['content_attributes_array']['class'][] = 'article-content';

  // Show only the username in submitted, the date is handled by node.tpl.php.
  $vars['submitted'] = t('Submitted by !username',
    array('!username' => $vars['name']));

  if ($blocks  = block_get_blocks_by_region('node_block')) {
    $vars['node_block'] = $blocks;
  }
  
  if ($blocks_node_block = block_get_blocks_by_region('node_block')) {
        $vars['node_block'] = $blocks_node_block;
        $vars['node_block']['#theme_wrappers'] = array('region');
        $vars['node_block']['#region'] = 'node_block';
    }
    else {
      $vars['node_block'] = '';
    }

}

/**
 * Implements hook_page_alter().
 */
function bamboo_page_alter($page) {
  /* add the viewport meta tag which will render as:
   * <meta name="viewport" content="width=device-width,
   * initial-scale=1, maximum-scale=1"/>
   * see: https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag
   * for docs
   */
  $viewport = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
      'name' => 'viewport',
      'content' => 'width=device-width, initial-scale=1, maximum-scale=1',
    ),
  );
  drupal_add_html_head($viewport, 'viewport');
}
