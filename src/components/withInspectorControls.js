import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment }    from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { QueryControls } from '@wordpress/components';
import { useState } from '@wordpress/element';


function updateQuery(exclude, props) {
    console.log("toggled exclude ",exclude);
    exclude = !exclude;
    console.log("set exclude ",exclude);
    const post_id = wp.data.select("core/editor").getCurrentPostId();
    let query = props.attributes.query;
    const excludeArray = query.exclude;
    if (exclude) {
        // add the current post id to the exclude array
        excludeArray.push(post_id);
        console.log('add it into the props array ',excludeArray);
    } else {
        excludeArray = excludeArray.filter((item) => item != post_id);
        console.log('remove it from the props array ',excludeArray);
    }
    props.setAttributes({excludeSelf: exclude})
    return;
}
function getExcludeState (props) {
    const post_id = wp.data.select("core/editor").getCurrentPostId();
    let inExclude = props.attributes.query.exclude.includes(post_id);
    return inExclude;
}
export default createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        if ( 'core/query' !== props.name ) {
            return <BlockEdit { ...props } />
          }
        const {
            attributes: {
                excludeSelf=getExcludeState(props),
            },
            setAttributes,
        } = props;
        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody
                        title={ __( 'Query options', 'mbp-plugin' ) }
                        icon="visibility"
                        initialOpen={ true }
                    >
                        <ToggleControl
                            label={ __( 'Exclude current post? ', 'mbp-plugin' ) }
                            checked={ excludeSelf }
                            // onChange={ ( excludeSelf ) => setAttributes( updateQuery(excludeSelf, props) ) }
                            // onChange={ ( excludeSelf ) => updateQuery(excludeSelf, props) }
                            onChange={ () => updateQuery(excludeSelf, props)}
                            help={ __( 'Toggle if the current post will be excluded from this query.',
                                'mbp-plugin' ) }
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
 }, 'withInspectorControls' );
