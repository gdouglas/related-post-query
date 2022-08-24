/**
 * Setup filters
 * 
 * @link https://mbpcode.ltd/add-controls-to-the-core-and-third-party-block-sidebar-with-filters-and-higher-order-components
 */
import { addFilter } from '@wordpress/hooks';

import withIsBlockDraft from './components/withIsBlockDraft';
import withInspectorControls from './components/withInspectorControls';


/**
 * Registers the plugin for sidebar
 * 
 * @see https://mbp.ltd/add-controls-to-the-post-sidebar-with-plugindocumentsettingpanel
 */
import { registerPlugin } from '@wordpress/plugins';
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save'; //removed client side save to render with php
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * @see ./save.js
	 */
	save
});

/**
 * Add the filters
 */
addFilter(
	'blocks.registerBlockType',
	'mbp-plugin/query-exclude-self',
	(settings) => {
		const { attributes } = settings;
		return {
			...settings,
			attributes: {
				...attributes,
				exclude: {
					default: true,
					type: 'boolean',
				},
			},
		};
	}
);
addFilter(
	'editor.BlockEdit',
	'mbp-plugin/block-draft-inspector',
	withInspectorControls,

);
