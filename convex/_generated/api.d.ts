/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as boards_mutations from "../boards/mutations.js";
import type * as boards_queries from "../boards/queries.js";
import type * as constants from "../constants.js";
import type * as http from "../http.js";
import type * as images_actions from "../images/actions.js";
import type * as images_mutations from "../images/mutations.js";
import type * as images_queries from "../images/queries.js";
import type * as users_actions from "../users/actions.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as utils from "../utils.js";
import type * as workspaces_mutations from "../workspaces/mutations.js";
import type * as workspaces_queries from "../workspaces/queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "boards/mutations": typeof boards_mutations;
  "boards/queries": typeof boards_queries;
  constants: typeof constants;
  http: typeof http;
  "images/actions": typeof images_actions;
  "images/mutations": typeof images_mutations;
  "images/queries": typeof images_queries;
  "users/actions": typeof users_actions;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  utils: typeof utils;
  "workspaces/mutations": typeof workspaces_mutations;
  "workspaces/queries": typeof workspaces_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
