<?php

/**
 * @file
 * theme-settings.php provides the custom theme settings
 *
 * Provides the checkboxes for the CSS overrides functionality
 * as well as the serif/sans-serif style option.
 */

/**
 * Implements hook_form_FORM_ID_alter().
 */
function bamboo_form_system_theme_settings_alter(&$form, &$form_state) {

  $form['bamboo_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Bamboo Theme Settings'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['bamboo_settings']['breadcrumbs'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show breadcrumbs in a page'),
    '#default_value' => theme_get_setting('breadcrumbs', 'bamboo'),
    '#description' => t("Check this option to show breadcrumbs in page. Uncheck to hide."),
  );

  $form['bamboo_settings']['general_settings']['bamboo_themelogo'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use theme Logo?'),
    '#default_value' => theme_get_setting('bamboo_themelogo', 'bamboo'),
    '#description' => t("Check for yes, uncheck to upload your own logo!"),
  );

  $form['bamboo_settings']['general_settings']['theme_bg_config']['theme_bg'] = array(
    '#type' => 'select',
    '#title' => t('Choose a background'),
    '#default_value' => theme_get_setting('theme_bg'),
    '#options' => array(
      'gray_gradient' => t('Gray gradient'),
      'green_gradient' => t('Green gradient'),
      'light_fabric' => t('Light fabric'),
      'dark_linen' => t('Dark linen'),
      'light_cloth' => t('Light cloth'),
      'tiles' => t('Tiles'),
      'retro1' => t('Retro 1'),
      'retro2' => t('Retro 2'),
      'retro3' => t('Retro 3'),
      'retro4' => t('Retro 4'),
      'retro5' => t('Retro 5'),
      'abstract1' => t('Abstract pattern 1'),
      'abstract2' => t('Abstract pattern 2'),
      'abstract3' => t('Abstract pattern 3'),
      'abstract4' => t('Abstract pattern 4'),
      'abstract5' => t('Abstract pattern 5'),
    ),
  );

  $form['bamboo_settings']['general_settings']['theme_color_config']['theme_color_palette'] = array(
    '#type' => 'select',
    '#title' => t('Choose a color palette'),
    '#default_value' => theme_get_setting('theme_color_palette'),
    '#options' => array(
      'green_bamboo' => t('Green bamboo'),
      'warm_purple' => t('Warm purple'),
      'dark_rust' => t('Dark rust'),
    ),
  );

  $form['bamboo_settings']['general_settings']['header_font_style'] = array(
    '#type' => 'select',
    '#title' => t('Choose a header font style'),
    '#default_value' => theme_get_setting('header_font_style'),
    '#options' => array(
      'sans_serif' => t('Sans-Serif'),
      'serif' => t('Serif'),
    ),
  );

  $form['bamboo_settings']['general_settings']['body_font_style'] = array(
    '#type' => 'select',
    '#title' => t('Choose a body font style'),
    '#default_value' => theme_get_setting('body_font_style'),
    '#options' => array(
      'sans_serif' => t('Sans-Serif'),
      'serif' => t('Serif'),
    ),
  );

  $form['bamboo_settings']['general_settings']['theme_sidebar_location'] = array(
    '#type' => 'select',
    '#title' => t('Sidebar location'),
    '#default_value' => theme_get_setting('theme_sidebar_location'),
    '#description' => t("Choose where you would like your sidebar, left or right. Either way for mobile, it
      will flow underneath the content area."),
    '#options' => array(
      'sidebar_right' => t('Right'),
      'sidebar_left' => t('Left'),
    ),
  );

  $form['additional_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Additional Bamboo Settings'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['additional_settings']['other_settings']['bamboo_localcss'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use local.css?'),
    '#default_value' => theme_get_setting('bamboo_localcss', 'bamboo'),
    '#description' => t("Only check this box if you have renamed local.sample.css to local.css."),
  );

  $form['additional_settings']['other_settings']['bamboo_tertiarymenu'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use tertiary drop down menus?'),
    '#default_value' => theme_get_setting('bamboo_tertiarymenu', 'bamboo'),
    '#description' => t("Check this box if you are going to have tertiary (third level drop down menus)"),
  );

}
