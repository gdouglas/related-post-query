<?php
/**
 * Plugin Name:       MBP Query
 * Description:       A query block for Mednet
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Graham Douglas
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mbp-query
 *
 * @package           mbp
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function mbp_mbp_query_block_init() {
	register_block_type( __DIR__ . '/build' );
}
/**
 * Register the post meta
 *
 * @link https://mbp.ltd/add-controls-to-the-post-sidebar-with-plugindocumentsettingpanel
 * @return void
 */
function mbp_mbp_plugin_register_post_meta() {
	register_meta(
		'post',
		'_mbp_mbp_plugin_require_login',
		array(
			'auth_callback' => '__return_true',
			'default'       => false,
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'boolean',
		)
	);
}


/**
 * Make the user be logged in
 *
 * @see https://mbp.ltd/add-controls-to-the-post-sidebar-with-plugindocumentsettingpanel
 */
function mbp_mbp_plugin_require_login() {
	global $post, $wp_query;

	// If this is not a single post, bail.
	if ( is_admin() || ! is_singular() || ! $post ) {
		return;
	}

	// If the user is logged in, bail.
	if ( is_user_logged_in() ) {
		return;
	}

	$login_required = get_post_meta( $post->ID, '_mbp_mbp_plugin_require_login', true );

	// If the login is not required, bail.
	if ( ! $login_required ) {
		return;
	}

	$wp_query->set_404();
	status_header( 401 );
}

/**
 * This will stop the draft blocks outputting on the frontend. https://wholesomecode.ltd/add-controls-to-the-core-and-third-party-block-sidebar-with-filters-and-higher-order-components
 *
 * @param string $pre_render Block before render.
 * @param string $block The block.
 * @return string
 */
function mbp_mbp_plugin_remove_blocks_in_draft( $pre_render, $block ) {

	// If we are in the admin interface, bail.
	if ( is_admin() ) {
		return $pre_render;
	}

	// If the block is draft, do not render.
	if (
		isset( $block['attrs'] ) &&
		isset( $block['attrs']['isBlockDraft'] ) &&
		$block['attrs']['isBlockDraft']
	) {
		return false;
	}

	// Otherwise, render the block.
	return $pre_render;
}


add_filter( 'pre_render_block', 'mbp_mbp_plugin_remove_blocks_in_draft', 0, 2 );

add_action( 'wp', 'mbp_mbp_plugin_require_login' );

add_action( 'init', 'mbp_mbp_plugin_register_post_meta' );
add_action( 'init', 'mbp_mbp_query_block_init' );
