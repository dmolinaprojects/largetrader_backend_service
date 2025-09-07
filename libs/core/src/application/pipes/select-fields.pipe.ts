// import { Traceable } from '@amplication/opentelemetry-nestjs';
// import { Injectable, PipeTransform } from '@nestjs/common';
// import { GraphQLResolveInfo } from 'graphql';
// import {
//   getFieldNodesSelections,
//   getFieldsFromFragments,
//   getFieldsSelect,
//   getListFieldsFromSelections,
// } from '../utils';

// @Traceable()
// @Injectable()
// export class SelectFieldsPipe implements PipeTransform {
//   transform(value: GraphQLResolveInfo) {
//     const listSelections = getFieldNodesSelections(value.fieldNodes);
//     const listFields = getListFieldsFromSelections(listSelections);
//     const listFieldsExtractFragments = getFieldsFromFragments(
//       listFields,
//       value.fragments
//     );
//     const fieldsSelect = getFieldsSelect(listFieldsExtractFragments);

//     return Object.freeze({ ...fieldsSelect, id: true });
//   }
// }
