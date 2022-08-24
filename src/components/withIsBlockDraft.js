import { createHigherOrderComponent } from '@wordpress/compose';

export default createHigherOrderComponent( ( BlockListBlock ) => {
     return ( props ) => {
         const { attributes } = props;
         const { isBlockDraft } = attributes;

         return <BlockListBlock { ...props } className={ isBlockDraft ? 'draft-block' : '' } />;
     };
 }, 'withIsBlockDraft' );
