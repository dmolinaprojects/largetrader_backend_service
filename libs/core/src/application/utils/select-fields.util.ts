// import {
//   FieldNode,
//   FragmentDefinitionNode,
//   FragmentSpreadNode,
//   InlineFragmentNode,
//   Kind,
//   SelectionNode,
// } from 'graphql';
// import { ObjMap } from 'graphql/jsutils/ObjMap';

// export function getFieldNodesSelections(
//   fieldNodes: ReadonlyArray<FieldNode>,
// ): ReadonlyArray<SelectionNode> {
//   return fieldNodes.flatMap(
//     (fieldNode) =>
//       fieldNode.selectionSet ? fieldNode.selectionSet.selections : [],
//     Infinity,
//   );
// }

// export function getListFieldsFromSelections(
//   selections: ReadonlyArray<SelectionNode>,
// ): string[] {
//   return selections.flatMap(
//     (node: FieldNode | FragmentSpreadNode | InlineFragmentNode) => {
//       if (Object.prototype.hasOwnProperty.call(node, 'selectionSet')) return [];

//       if (node.kind === Kind.FIELD || node.kind === Kind.FRAGMENT_SPREAD)
//         return /^[\w][a-zA-Z\d][\w]*$/.test(node.name.value)
//           ? node.name.value
//           : [];

//       return getListFieldsFromSelections(node.selectionSet.selections);
//     },
//     Infinity,
//   );
// }

// export function getFieldsFromFragments(
//   listFields: string[],
//   fragments: ObjMap<FragmentDefinitionNode>,
// ): string[] {
//   return listFields.flatMap(
//     (field) =>
//       fragments[field]
//         ? getListFieldsFromSelections(fragments[field].selectionSet.selections)
//         : [field],
//     Infinity,
//   );
// }

// export function getFieldsSelect(listFields: string[]): Record<string, true> {
//   return listFields.reduce((prev, curr) => ({ ...prev, [curr]: true }), {});
// }
