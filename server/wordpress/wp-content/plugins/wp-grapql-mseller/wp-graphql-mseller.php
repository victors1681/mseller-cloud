<?php

/**
 * Plugin Name: WPGraphQL MSeller
 * Plugin URI: https://github.com/victors1681/customers
 * Description: Custom Fields for MSeller to WPGraphQL schema.
 * Version: 0.0.1
 * Author: Victor Santos
 * Author URI: https://mseller.app
 * Text Domain: wp-graphql-mseller 
 *
 * @package     WPGraphQL\MSeller
 * @author      victor santos
 * @license     GPL-3
 */


namespace MSeller;

require_once("vendor/autoload.php");


use MSeller\Admin;
use MSeller\FirebaseIntegration;
//Register namespace
spl_autoload_register(function ($class) {

  $namespace = 'MSeller\\';
  $path      = 'src';

  // Bail if the class is not in our namespace.
  if (0 !== strpos($class, $namespace)) {
    return;
  }

  // Remove the namespace.
  $class = str_replace($namespace, '', $class);

  // Build the filename.
  $file = realpath(__DIR__ . "/{$path}");
  $file = $file . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';

  // If the file exists for the class name, load it.
  if (file_exists($file)) {
    include($file);
  }
});

/**
 * Start JWT_Authentication.
 */
function init()
{
  Admin::init();
  new AuthExtensions();
  return new FirebaseIntegration();
}
add_action('plugins_loaded', '\MSeller\init', 1);