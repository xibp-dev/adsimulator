
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "4.1.0";globalThis.nextVersion = "16.2.11";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__0rl5avo._.js
var require_root_of_the_server_0rl5avo = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__0rl5avo._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__0rl5avo._.js", 51615, (e, r, o) => {
      r.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 78500, (e, r, o) => {
      r.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 38022, (e, r, o) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(42738));
      n.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(n, { get(e2, r2) {
        if ("then" === r2) return (r3, o3) => e2.then(r3, o3);
        let o2 = (...o3) => e2.then((e3) => (0, e3[r2])(...o3));
        return o2.then = (o3, n2) => e2.then((e3) => e3[r2]).then(o3, n2), o2;
      } });
    }]);
  }
});

// .next/server/edge/chunks/_03s3dp8._.js
var require_s3dp8 = __commonJS({
  ".next/server/edge/chunks/_03s3dp8._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/_03s3dp8._.js", 74398, (e, t, r) => {
    }, 28042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, a = Object.getOwnPropertyNames, s = Object.prototype.hasOwnProperty, o = {}, l = { RequestCookies: () => g, ResponseCookies: () => m, parseCookie: () => h, parseSetCookie: () => d, stringifyCookie: () => u };
      for (var c in l) n(o, c, { get: l[c], enumerable: true });
      function u(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function h(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function d(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = h(e2), { domain: i2, expires: a2, httponly: s2, maxage: o2, path: l2, samesite: c2, secure: u2, partitioned: d2, priority: g2 } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var m2, y, b = { name: t2, value: decodeURIComponent(r2), domain: i2, ...a2 && { expires: new Date(a2) }, ...s2 && { httpOnly: true }, ..."string" == typeof o2 && { maxAge: Number(o2) }, path: l2, ...c2 && { sameSite: p.includes(m2 = (m2 = c2).toLowerCase()) ? m2 : void 0 }, ...u2 && { secure: true }, ...g2 && { priority: f.includes(y = (y = g2).toLowerCase()) ? y : void 0 }, ...d2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in b) b[t3] && (e3[t3] = b[t3]);
          return e3;
        }
      }
      t.exports = ((e2, t2, r2, o2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of a(t2)) s.call(e2, l2) || l2 === r2 || n(e2, l2, { get: () => t2[l2], enumerable: !(o2 = i(t2, l2)) || o2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), o);
      var p = ["strict", "lax", "none"], f = ["low", "medium", "high"], g = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const t2 = e2.get("cookie");
          if (t2) for (const [e3, r2] of h(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => u(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => u(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, m = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (const e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, a2, s2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, a2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (n3 = o2, o2 += 1, l2(), i3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (a2 = true, o2 = i3, s2.push(e4.substring(t3, n3)), t3 = o2) : o2 = n3 + 1;
              } else o2 += 1;
              (!a2 || o2 >= e4.length) && s2.push(e4.substring(t3, e4.length));
            }
            return s2;
          }(i2)) {
            const t3 = d(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = u(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(u).join("; ");
        }
      };
    }, 90044, (e) => {
      "use strict";
      let t = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class r {
        disable() {
          throw t;
        }
        getStore() {
        }
        run() {
          throw t;
        }
        exit() {
          throw t;
        }
        enterWith() {
          throw t;
        }
        static bind(e2) {
          return e2;
        }
      }
      let n = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      e.s(["bindSnapshot", 0, function(e2) {
        return n ? n.bind(e2) : r.bind(e2);
      }, "createAsyncLocalStorage", 0, function() {
        return n ? new n() : new r();
      }, "createSnapshot", 0, function() {
        return n ? n.snapshot() : function(e2, ...t2) {
          return e2(...t2);
        };
      }]);
    }, 59110, (e, t, r) => {
      (() => {
        "use strict";
        let r2, n, i, a, s;
        var o, l, c, u, h, d, p, f, g, m, y, b, w, v, _, x, E = { 491: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ContextAPI = void 0;
          let n2 = r3(223), i2 = r3(172), a2 = r3(930), s2 = "context", o2 = new n2.NoopContextManager();
          class l2 {
            static getInstance() {
              return this._instance || (this._instance = new l2()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, i2.registerGlobal)(s2, e3, a2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t3, r4, ...n3) {
              return this._getContextManager().with(e3, t3, r4, ...n3);
            }
            bind(e3, t3) {
              return this._getContextManager().bind(e3, t3);
            }
            _getContextManager() {
              return (0, i2.getGlobal)(s2) || o2;
            }
            disable() {
              this._getContextManager().disable(), (0, i2.unregisterGlobal)(s2, a2.DiagAPI.instance());
            }
          }
          t2.ContextAPI = l2;
        }, 930: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagAPI = void 0;
          let n2 = r3(56), i2 = r3(912), a2 = r3(957), s2 = r3(172);
          class o2 {
            constructor() {
              function e3(e4) {
                return function(...t4) {
                  let r4 = (0, s2.getGlobal)("diag");
                  if (r4) return r4[e4](...t4);
                };
              }
              const t3 = this;
              t3.setLogger = (e4, r4 = { logLevel: a2.DiagLogLevel.INFO }) => {
                var n3, o3, l2;
                if (e4 === t3) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t3.error(null != (n3 = e5.stack) ? n3 : e5.message), false;
                }
                "number" == typeof r4 && (r4 = { logLevel: r4 });
                let c2 = (0, s2.getGlobal)("diag"), u2 = (0, i2.createLogLevelDiagLogger)(null != (o3 = r4.logLevel) ? o3 : a2.DiagLogLevel.INFO, e4);
                if (c2 && !r4.suppressOverrideMessage) {
                  let e5 = null != (l2 = Error().stack) ? l2 : "<failed to generate stacktrace>";
                  c2.warn(`Current logger will be overwritten from ${e5}`), u2.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, s2.registerGlobal)("diag", u2, t3, true);
              }, t3.disable = () => {
                (0, s2.unregisterGlobal)("diag", t3);
              }, t3.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t3.verbose = e3("verbose"), t3.debug = e3("debug"), t3.info = e3("info"), t3.warn = e3("warn"), t3.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new o2()), this._instance;
            }
          }
          t2.DiagAPI = o2;
        }, 653: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.MetricsAPI = void 0;
          let n2 = r3(660), i2 = r3(172), a2 = r3(930), s2 = "metrics";
          class o2 {
            static getInstance() {
              return this._instance || (this._instance = new o2()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, i2.registerGlobal)(s2, e3, a2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, i2.getGlobal)(s2) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t3, r4) {
              return this.getMeterProvider().getMeter(e3, t3, r4);
            }
            disable() {
              (0, i2.unregisterGlobal)(s2, a2.DiagAPI.instance());
            }
          }
          t2.MetricsAPI = o2;
        }, 181: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.PropagationAPI = void 0;
          let n2 = r3(172), i2 = r3(874), a2 = r3(194), s2 = r3(277), o2 = r3(369), l2 = r3(930), c2 = "propagation", u2 = new i2.NoopTextMapPropagator();
          class h2 {
            constructor() {
              this.createBaggage = o2.createBaggage, this.getBaggage = s2.getBaggage, this.getActiveBaggage = s2.getActiveBaggage, this.setBaggage = s2.setBaggage, this.deleteBaggage = s2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(c2, e3, l2.DiagAPI.instance());
            }
            inject(e3, t3, r4 = a2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t3, r4);
            }
            extract(e3, t3, r4 = a2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t3, r4);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(c2, l2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(c2) || u2;
            }
          }
          t2.PropagationAPI = h2;
        }, 997: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceAPI = void 0;
          let n2 = r3(172), i2 = r3(846), a2 = r3(139), s2 = r3(607), o2 = r3(930), l2 = "trace";
          class c2 {
            constructor() {
              this._proxyTracerProvider = new i2.ProxyTracerProvider(), this.wrapSpanContext = a2.wrapSpanContext, this.isSpanContextValid = a2.isSpanContextValid, this.deleteSpan = s2.deleteSpan, this.getSpan = s2.getSpan, this.getActiveSpan = s2.getActiveSpan, this.getSpanContext = s2.getSpanContext, this.setSpan = s2.setSpan, this.setSpanContext = s2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new c2()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t3 = (0, n2.registerGlobal)(l2, this._proxyTracerProvider, o2.DiagAPI.instance());
              return t3 && this._proxyTracerProvider.setDelegate(e3), t3;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(l2) || this._proxyTracerProvider;
            }
            getTracer(e3, t3) {
              return this.getTracerProvider().getTracer(e3, t3);
            }
            disable() {
              (0, n2.unregisterGlobal)(l2, o2.DiagAPI.instance()), this._proxyTracerProvider = new i2.ProxyTracerProvider();
            }
          }
          t2.TraceAPI = c2;
        }, 277: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.deleteBaggage = t2.setBaggage = t2.getActiveBaggage = t2.getBaggage = void 0;
          let n2 = r3(491), i2 = (0, r3(780).createContextKey)("OpenTelemetry Baggage Key");
          function a2(e3) {
            return e3.getValue(i2) || void 0;
          }
          t2.getBaggage = a2, t2.getActiveBaggage = function() {
            return a2(n2.ContextAPI.getInstance().active());
          }, t2.setBaggage = function(e3, t3) {
            return e3.setValue(i2, t3);
          }, t2.deleteBaggage = function(e3) {
            return e3.deleteValue(i2);
          };
        }, 993: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.BaggageImpl = void 0;
          class r3 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t3 = this._entries.get(e3);
              if (t3) return Object.assign({}, t3);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t3]) => [e3, t3]);
            }
            setEntry(e3, t3) {
              let n2 = new r3(this._entries);
              return n2._entries.set(e3, t3), n2;
            }
            removeEntry(e3) {
              let t3 = new r3(this._entries);
              return t3._entries.delete(e3), t3;
            }
            removeEntries(...e3) {
              let t3 = new r3(this._entries);
              for (let r4 of e3) t3._entries.delete(r4);
              return t3;
            }
            clear() {
              return new r3();
            }
          }
          t2.BaggageImpl = r3;
        }, 830: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataSymbol = void 0, t2.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataFromString = t2.createBaggage = void 0;
          let n2 = r3(930), i2 = r3(993), a2 = r3(830), s2 = n2.DiagAPI.instance();
          t2.createBaggage = function(e3 = {}) {
            return new i2.BaggageImpl(new Map(Object.entries(e3)));
          }, t2.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (s2.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: a2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.context = void 0, t2.context = r3(491).ContextAPI.getInstance();
        }, 223: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopContextManager = void 0;
          let n2 = r3(780);
          t2.NoopContextManager = class {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t3, r4, ...n3) {
              return t3.call(r4, ...n3);
            }
            bind(e3, t3) {
              return t3;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          };
        }, 780: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ROOT_CONTEXT = t2.createContextKey = void 0, t2.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r3 {
            constructor(e3) {
              const t3 = this;
              t3._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t3.getValue = (e4) => t3._currentContext.get(e4), t3.setValue = (e4, n2) => {
                let i2 = new r3(t3._currentContext);
                return i2._currentContext.set(e4, n2), i2;
              }, t3.deleteValue = (e4) => {
                let n2 = new r3(t3._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t2.ROOT_CONTEXT = new r3();
        }, 506: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.diag = void 0, t2.diag = r3(930).DiagAPI.instance();
        }, 56: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagComponentLogger = void 0;
          let n2 = r3(172);
          function i2(e3, t3, r4) {
            let i3 = (0, n2.getGlobal)("diag");
            if (i3) return r4.unshift(t3), i3[e3](...r4);
          }
          t2.DiagComponentLogger = class {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          };
        }, 972: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagConsoleLogger = void 0;
          let r3 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          t2.DiagConsoleLogger = class {
            constructor() {
              for (let e3 = 0; e3 < r3.length; e3++) this[r3[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t3) {
                  if (console) {
                    let r4 = console[e4];
                    if ("function" != typeof r4 && (r4 = console.log), "function" == typeof r4) return r4.apply(console, t3);
                  }
                };
              }(r3[e3].c);
            }
          };
        }, 912: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createLogLevelDiagLogger = void 0;
          let n2 = r3(957);
          t2.createLogLevelDiagLogger = function(e3, t3) {
            function r4(r5, n3) {
              let i2 = t3[r5];
              return "function" == typeof i2 && e3 >= n3 ? i2.bind(t3) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t3 = t3 || {}, { error: r4("error", n2.DiagLogLevel.ERROR), warn: r4("warn", n2.DiagLogLevel.WARN), info: r4("info", n2.DiagLogLevel.INFO), debug: r4("debug", n2.DiagLogLevel.DEBUG), verbose: r4("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagLogLevel = void 0, (r3 = t2.DiagLogLevel || (t2.DiagLogLevel = {}))[r3.NONE = 0] = "NONE", r3[r3.ERROR = 30] = "ERROR", r3[r3.WARN = 50] = "WARN", r3[r3.INFO = 60] = "INFO", r3[r3.DEBUG = 70] = "DEBUG", r3[r3.VERBOSE = 80] = "VERBOSE", r3[r3.ALL = 9999] = "ALL";
        }, 172: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.unregisterGlobal = t2.getGlobal = t2.registerGlobal = void 0;
          let n2 = r3(200), i2 = r3(521), a2 = r3(130), s2 = i2.VERSION.split(".")[0], o2 = Symbol.for(`opentelemetry.js.api.${s2}`), l2 = n2._globalThis;
          t2.registerGlobal = function(e3, t3, r4, n3 = false) {
            var a3;
            let s3 = l2[o2] = null != (a3 = l2[o2]) ? a3 : { version: i2.VERSION };
            if (!n3 && s3[e3]) {
              let t4 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r4.error(t4.stack || t4.message), false;
            }
            if (s3.version !== i2.VERSION) {
              let t4 = Error(`@opentelemetry/api: Registration of version v${s3.version} for ${e3} does not match previously registered API v${i2.VERSION}`);
              return r4.error(t4.stack || t4.message), false;
            }
            return s3[e3] = t3, r4.debug(`@opentelemetry/api: Registered a global for ${e3} v${i2.VERSION}.`), true;
          }, t2.getGlobal = function(e3) {
            var t3, r4;
            let n3 = null == (t3 = l2[o2]) ? void 0 : t3.version;
            if (n3 && (0, a2.isCompatible)(n3)) return null == (r4 = l2[o2]) ? void 0 : r4[e3];
          }, t2.unregisterGlobal = function(e3, t3) {
            t3.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${i2.VERSION}.`);
            let r4 = l2[o2];
            r4 && delete r4[e3];
          };
        }, 130: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.isCompatible = t2._makeCompatibilityCheck = void 0;
          let n2 = r3(521), i2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function a2(e3) {
            let t3 = /* @__PURE__ */ new Set([e3]), r4 = /* @__PURE__ */ new Set(), n3 = e3.match(i2);
            if (!n3) return () => false;
            let a3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != a3.prerelease) return function(t4) {
              return t4 === e3;
            };
            function s2(e4) {
              return r4.add(e4), false;
            }
            return function(e4) {
              if (t3.has(e4)) return true;
              if (r4.has(e4)) return false;
              let n4 = e4.match(i2);
              if (!n4) return s2(e4);
              let o2 = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              if (null != o2.prerelease || a3.major !== o2.major) return s2(e4);
              if (0 === a3.major) return a3.minor === o2.minor && a3.patch <= o2.patch ? (t3.add(e4), true) : s2(e4);
              return a3.minor <= o2.minor ? (t3.add(e4), true) : s2(e4);
            };
          }
          t2._makeCompatibilityCheck = a2, t2.isCompatible = a2(n2.VERSION);
        }, 886: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.metrics = void 0, t2.metrics = r3(653).MetricsAPI.getInstance();
        }, 901: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ValueType = void 0, (r3 = t2.ValueType || (t2.ValueType = {}))[r3.INT = 0] = "INT", r3[r3.DOUBLE = 1] = "DOUBLE";
        }, 102: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createNoopMeter = t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t2.NOOP_OBSERVABLE_GAUGE_METRIC = t2.NOOP_OBSERVABLE_COUNTER_METRIC = t2.NOOP_UP_DOWN_COUNTER_METRIC = t2.NOOP_HISTOGRAM_METRIC = t2.NOOP_COUNTER_METRIC = t2.NOOP_METER = t2.NoopObservableUpDownCounterMetric = t2.NoopObservableGaugeMetric = t2.NoopObservableCounterMetric = t2.NoopObservableMetric = t2.NoopHistogramMetric = t2.NoopUpDownCounterMetric = t2.NoopCounterMetric = t2.NoopMetric = t2.NoopMeter = void 0;
          class r3 {
            createHistogram(e3, r4) {
              return t2.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r4) {
              return t2.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r4) {
              return t2.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r4) {
              return t2.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t3) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t2.NoopMeter = r3;
          class n2 {
          }
          t2.NoopMetric = n2;
          class i2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopCounterMetric = i2;
          class a2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopUpDownCounterMetric = a2;
          class s2 extends n2 {
            record(e3, t3) {
            }
          }
          t2.NoopHistogramMetric = s2;
          class o2 {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t2.NoopObservableMetric = o2;
          class l2 extends o2 {
          }
          t2.NoopObservableCounterMetric = l2;
          class c2 extends o2 {
          }
          t2.NoopObservableGaugeMetric = c2;
          class u2 extends o2 {
          }
          t2.NoopObservableUpDownCounterMetric = u2, t2.NOOP_METER = new r3(), t2.NOOP_COUNTER_METRIC = new i2(), t2.NOOP_HISTOGRAM_METRIC = new s2(), t2.NOOP_UP_DOWN_COUNTER_METRIC = new a2(), t2.NOOP_OBSERVABLE_COUNTER_METRIC = new l2(), t2.NOOP_OBSERVABLE_GAUGE_METRIC = new c2(), t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new u2(), t2.createNoopMeter = function() {
            return t2.NOOP_METER;
          };
        }, 660: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NOOP_METER_PROVIDER = t2.NoopMeterProvider = void 0;
          let n2 = r3(102);
          class i2 {
            getMeter(e3, t3, r4) {
              return n2.NOOP_METER;
            }
          }
          t2.NoopMeterProvider = i2, t2.NOOP_METER_PROVIDER = new i2();
        }, 200: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(46), t2);
        }, 651: (t2, r3) => {
          Object.defineProperty(r3, "__esModule", { value: true }), r3._globalThis = void 0, r3._globalThis = "object" == typeof globalThis ? globalThis : e.g;
        }, 46: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(651), t2);
        }, 939: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.propagation = void 0, t2.propagation = r3(181).PropagationAPI.getInstance();
        }, 874: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTextMapPropagator = void 0, t2.NoopTextMapPropagator = class {
            inject(e3, t3) {
            }
            extract(e3, t3) {
              return e3;
            }
            fields() {
              return [];
            }
          };
        }, 194: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.defaultTextMapSetter = t2.defaultTextMapGetter = void 0, t2.defaultTextMapGetter = { get(e3, t3) {
            if (null != e3) return e3[t3];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t2.defaultTextMapSetter = { set(e3, t3, r3) {
            null != e3 && (e3[t3] = r3);
          } };
        }, 845: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.trace = void 0, t2.trace = r3(997).TraceAPI.getInstance();
        }, 403: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NonRecordingSpan = void 0;
          let n2 = r3(476);
          t2.NonRecordingSpan = class {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t3) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t3) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t3) {
            }
          };
        }, 614: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracer = void 0;
          let n2 = r3(491), i2 = r3(607), a2 = r3(403), s2 = r3(139), o2 = n2.ContextAPI.getInstance();
          t2.NoopTracer = class {
            startSpan(e3, t3, r4 = o2.active()) {
              var n3;
              if (null == t3 ? void 0 : t3.root) return new a2.NonRecordingSpan();
              let l2 = r4 && (0, i2.getSpanContext)(r4);
              return "object" == typeof (n3 = l2) && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, s2.isSpanContextValid)(l2) ? new a2.NonRecordingSpan(l2) : new a2.NonRecordingSpan();
            }
            startActiveSpan(e3, t3, r4, n3) {
              let a3, s3, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t3 : 3 == arguments.length ? (a3 = t3, l2 = r4) : (a3 = t3, s3 = r4, l2 = n3);
              let c2 = null != s3 ? s3 : o2.active(), u2 = this.startSpan(e3, a3, c2), h2 = (0, i2.setSpan)(c2, u2);
              return o2.with(h2, l2, void 0, u2);
            }
          };
        }, 124: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracerProvider = void 0;
          let n2 = r3(614);
          t2.NoopTracerProvider = class {
            getTracer(e3, t3, r4) {
              return new n2.NoopTracer();
            }
          };
        }, 125: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracer = void 0;
          let n2 = new (r3(614)).NoopTracer();
          t2.ProxyTracer = class {
            constructor(e3, t3, r4, n3) {
              this._provider = e3, this.name = t3, this.version = r4, this.options = n3;
            }
            startSpan(e3, t3, r4) {
              return this._getTracer().startSpan(e3, t3, r4);
            }
            startActiveSpan(e3, t3, r4, n3) {
              let i2 = this._getTracer();
              return Reflect.apply(i2.startActiveSpan, i2, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          };
        }, 846: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracerProvider = void 0;
          let n2 = r3(125), i2 = new (r3(124)).NoopTracerProvider();
          t2.ProxyTracerProvider = class {
            getTracer(e3, t3, r4) {
              var i3;
              return null != (i3 = this.getDelegateTracer(e3, t3, r4)) ? i3 : new n2.ProxyTracer(this, e3, t3, r4);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : i2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t3, r4) {
              var n3;
              return null == (n3 = this._delegate) ? void 0 : n3.getTracer(e3, t3, r4);
            }
          };
        }, 996: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SamplingDecision = void 0, (r3 = t2.SamplingDecision || (t2.SamplingDecision = {}))[r3.NOT_RECORD = 0] = "NOT_RECORD", r3[r3.RECORD = 1] = "RECORD", r3[r3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 607: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.getSpanContext = t2.setSpanContext = t2.deleteSpan = t2.setSpan = t2.getActiveSpan = t2.getSpan = void 0;
          let n2 = r3(780), i2 = r3(403), a2 = r3(491), s2 = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function o2(e3) {
            return e3.getValue(s2) || void 0;
          }
          function l2(e3, t3) {
            return e3.setValue(s2, t3);
          }
          t2.getSpan = o2, t2.getActiveSpan = function() {
            return o2(a2.ContextAPI.getInstance().active());
          }, t2.setSpan = l2, t2.deleteSpan = function(e3) {
            return e3.deleteValue(s2);
          }, t2.setSpanContext = function(e3, t3) {
            return l2(e3, new i2.NonRecordingSpan(t3));
          }, t2.getSpanContext = function(e3) {
            var t3;
            return null == (t3 = o2(e3)) ? void 0 : t3.spanContext();
          };
        }, 325: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceStateImpl = void 0;
          let n2 = r3(564);
          class i2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t3) {
              let r4 = this._clone();
              return r4._internalState.has(e3) && r4._internalState.delete(e3), r4._internalState.set(e3, t3), r4;
            }
            unset(e3) {
              let t3 = this._clone();
              return t3._internalState.delete(e3), t3;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t3) => (e3.push(t3 + "=" + this.get(t3)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t3) => {
                let r4 = t3.trim(), i3 = r4.indexOf("=");
                if (-1 !== i3) {
                  let a2 = r4.slice(0, i3), s2 = r4.slice(i3 + 1, t3.length);
                  (0, n2.validateKey)(a2) && (0, n2.validateValue)(s2) && e4.set(a2, s2);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new i2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t2.TraceStateImpl = i2;
        }, 564: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.validateValue = t2.validateKey = void 0;
          let r3 = "[_0-9a-z-*/]", n2 = `[a-z]${r3}{0,255}`, i2 = `[a-z0-9]${r3}{0,240}@[a-z]${r3}{0,13}`, a2 = RegExp(`^(?:${n2}|${i2})$`), s2 = /^[ -~]{0,255}[!-~]$/, o2 = /,|=/;
          t2.validateKey = function(e3) {
            return a2.test(e3);
          }, t2.validateValue = function(e3) {
            return s2.test(e3) && !o2.test(e3);
          };
        }, 98: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createTraceState = void 0;
          let n2 = r3(325);
          t2.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.INVALID_SPAN_CONTEXT = t2.INVALID_TRACEID = t2.INVALID_SPANID = void 0;
          let n2 = r3(475);
          t2.INVALID_SPANID = "0000000000000000", t2.INVALID_TRACEID = "00000000000000000000000000000000", t2.INVALID_SPAN_CONTEXT = { traceId: t2.INVALID_TRACEID, spanId: t2.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanKind = void 0, (r3 = t2.SpanKind || (t2.SpanKind = {}))[r3.INTERNAL = 0] = "INTERNAL", r3[r3.SERVER = 1] = "SERVER", r3[r3.CLIENT = 2] = "CLIENT", r3[r3.PRODUCER = 3] = "PRODUCER", r3[r3.CONSUMER = 4] = "CONSUMER";
        }, 139: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.wrapSpanContext = t2.isSpanContextValid = t2.isValidSpanId = t2.isValidTraceId = void 0;
          let n2 = r3(476), i2 = r3(403), a2 = /^([0-9a-f]{32})$/i, s2 = /^[0-9a-f]{16}$/i;
          function o2(e3) {
            return a2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function l2(e3) {
            return s2.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t2.isValidTraceId = o2, t2.isValidSpanId = l2, t2.isSpanContextValid = function(e3) {
            return o2(e3.traceId) && l2(e3.spanId);
          }, t2.wrapSpanContext = function(e3) {
            return new i2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanStatusCode = void 0, (r3 = t2.SpanStatusCode || (t2.SpanStatusCode = {}))[r3.UNSET = 0] = "UNSET", r3[r3.OK = 1] = "OK", r3[r3.ERROR = 2] = "ERROR";
        }, 475: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceFlags = void 0, (r3 = t2.TraceFlags || (t2.TraceFlags = {}))[r3.NONE = 0] = "NONE", r3[r3.SAMPLED = 1] = "SAMPLED";
        }, 521: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.VERSION = void 0, t2.VERSION = "1.6.0";
        } }, k = {};
        function S(e2) {
          var t2 = k[e2];
          if (void 0 !== t2) return t2.exports;
          var r3 = k[e2] = { exports: {} }, n2 = true;
          try {
            E[e2].call(r3.exports, r3, r3.exports, S), n2 = false;
          } finally {
            n2 && delete k[e2];
          }
          return r3.exports;
        }
        S.ab = "/ROOT/node_modules/next/dist/compiled/@opentelemetry/api/";
        var T = {};
        Object.defineProperty(T, "__esModule", { value: true }), T.trace = T.propagation = T.metrics = T.diag = T.context = T.INVALID_SPAN_CONTEXT = T.INVALID_TRACEID = T.INVALID_SPANID = T.isValidSpanId = T.isValidTraceId = T.isSpanContextValid = T.createTraceState = T.TraceFlags = T.SpanStatusCode = T.SpanKind = T.SamplingDecision = T.ProxyTracerProvider = T.ProxyTracer = T.defaultTextMapSetter = T.defaultTextMapGetter = T.ValueType = T.createNoopMeter = T.DiagLogLevel = T.DiagConsoleLogger = T.ROOT_CONTEXT = T.createContextKey = T.baggageEntryMetadataFromString = void 0, o = S(369), Object.defineProperty(T, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return o.baggageEntryMetadataFromString;
        } }), l = S(780), Object.defineProperty(T, "createContextKey", { enumerable: true, get: function() {
          return l.createContextKey;
        } }), Object.defineProperty(T, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return l.ROOT_CONTEXT;
        } }), c = S(972), Object.defineProperty(T, "DiagConsoleLogger", { enumerable: true, get: function() {
          return c.DiagConsoleLogger;
        } }), u = S(957), Object.defineProperty(T, "DiagLogLevel", { enumerable: true, get: function() {
          return u.DiagLogLevel;
        } }), h = S(102), Object.defineProperty(T, "createNoopMeter", { enumerable: true, get: function() {
          return h.createNoopMeter;
        } }), d = S(901), Object.defineProperty(T, "ValueType", { enumerable: true, get: function() {
          return d.ValueType;
        } }), p = S(194), Object.defineProperty(T, "defaultTextMapGetter", { enumerable: true, get: function() {
          return p.defaultTextMapGetter;
        } }), Object.defineProperty(T, "defaultTextMapSetter", { enumerable: true, get: function() {
          return p.defaultTextMapSetter;
        } }), f = S(125), Object.defineProperty(T, "ProxyTracer", { enumerable: true, get: function() {
          return f.ProxyTracer;
        } }), g = S(846), Object.defineProperty(T, "ProxyTracerProvider", { enumerable: true, get: function() {
          return g.ProxyTracerProvider;
        } }), m = S(996), Object.defineProperty(T, "SamplingDecision", { enumerable: true, get: function() {
          return m.SamplingDecision;
        } }), y = S(357), Object.defineProperty(T, "SpanKind", { enumerable: true, get: function() {
          return y.SpanKind;
        } }), b = S(847), Object.defineProperty(T, "SpanStatusCode", { enumerable: true, get: function() {
          return b.SpanStatusCode;
        } }), w = S(475), Object.defineProperty(T, "TraceFlags", { enumerable: true, get: function() {
          return w.TraceFlags;
        } }), v = S(98), Object.defineProperty(T, "createTraceState", { enumerable: true, get: function() {
          return v.createTraceState;
        } }), _ = S(139), Object.defineProperty(T, "isSpanContextValid", { enumerable: true, get: function() {
          return _.isSpanContextValid;
        } }), Object.defineProperty(T, "isValidTraceId", { enumerable: true, get: function() {
          return _.isValidTraceId;
        } }), Object.defineProperty(T, "isValidSpanId", { enumerable: true, get: function() {
          return _.isValidSpanId;
        } }), x = S(476), Object.defineProperty(T, "INVALID_SPANID", { enumerable: true, get: function() {
          return x.INVALID_SPANID;
        } }), Object.defineProperty(T, "INVALID_TRACEID", { enumerable: true, get: function() {
          return x.INVALID_TRACEID;
        } }), Object.defineProperty(T, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return x.INVALID_SPAN_CONTEXT;
        } }), r2 = S(67), Object.defineProperty(T, "context", { enumerable: true, get: function() {
          return r2.context;
        } }), n = S(506), Object.defineProperty(T, "diag", { enumerable: true, get: function() {
          return n.diag;
        } }), i = S(886), Object.defineProperty(T, "metrics", { enumerable: true, get: function() {
          return i.metrics;
        } }), a = S(939), Object.defineProperty(T, "propagation", { enumerable: true, get: function() {
          return a.propagation;
        } }), s = S(845), Object.defineProperty(T, "trace", { enumerable: true, get: function() {
          return s.trace;
        } }), T.default = { context: r2.context, diag: n.diag, metrics: i.metrics, propagation: a.propagation, trace: s.trace }, t.exports = T;
      })();
    }, 71498, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2, r2, n, i, a = {};
        a.parse = function(t2, r3) {
          if ("string" != typeof t2) throw TypeError("argument str must be a string");
          for (var i2 = {}, a2 = t2.split(n), s = (r3 || {}).decode || e2, o = 0; o < a2.length; o++) {
            var l = a2[o], c = l.indexOf("=");
            if (!(c < 0)) {
              var u = l.substr(0, c).trim(), h = l.substr(++c, l.length).trim();
              '"' == h[0] && (h = h.slice(1, -1)), void 0 == i2[u] && (i2[u] = function(e3, t3) {
                try {
                  return t3(e3);
                } catch (t4) {
                  return e3;
                }
              }(h, s));
            }
          }
          return i2;
        }, a.serialize = function(e3, t2, n2) {
          var a2 = n2 || {}, s = a2.encode || r2;
          if ("function" != typeof s) throw TypeError("option encode is invalid");
          if (!i.test(e3)) throw TypeError("argument name is invalid");
          var o = s(t2);
          if (o && !i.test(o)) throw TypeError("argument val is invalid");
          var l = e3 + "=" + o;
          if (null != a2.maxAge) {
            var c = a2.maxAge - 0;
            if (isNaN(c) || !isFinite(c)) throw TypeError("option maxAge is invalid");
            l += "; Max-Age=" + Math.floor(c);
          }
          if (a2.domain) {
            if (!i.test(a2.domain)) throw TypeError("option domain is invalid");
            l += "; Domain=" + a2.domain;
          }
          if (a2.path) {
            if (!i.test(a2.path)) throw TypeError("option path is invalid");
            l += "; Path=" + a2.path;
          }
          if (a2.expires) {
            if ("function" != typeof a2.expires.toUTCString) throw TypeError("option expires is invalid");
            l += "; Expires=" + a2.expires.toUTCString();
          }
          if (a2.httpOnly && (l += "; HttpOnly"), a2.secure && (l += "; Secure"), a2.sameSite) switch ("string" == typeof a2.sameSite ? a2.sameSite.toLowerCase() : a2.sameSite) {
            case true:
            case "strict":
              l += "; SameSite=Strict";
              break;
            case "lax":
              l += "; SameSite=Lax";
              break;
            case "none":
              l += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return l;
        }, e2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, t.exports = a;
      })();
    }, 99734, (e, t, r) => {
      (() => {
        "use strict";
        let e2, r2, n, i, a;
        var s = { 993: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function i2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function a2(e4, t3, n3, a3, s3) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var o3 = new i2(n3, a3 || e4, s3), l2 = r3 ? r3 + t3 : t3;
            return e4._events[l2] ? e4._events[l2].fn ? e4._events[l2] = [e4._events[l2], o3] : e4._events[l2].push(o3) : (e4._events[l2] = o3, e4._eventsCount++), e4;
          }
          function s2(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function o2() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), o2.prototype.eventNames = function() {
            var e4, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && i3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e4)) : i3;
          }, o2.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, a3 = n3.length, s3 = Array(a3); i3 < a3; i3++) s3[i3] = n3[i3].fn;
            return s3;
          }, o2.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, o2.prototype.emit = function(e4, t3, n3, i3, a3, s3) {
            var o3 = r3 ? r3 + e4 : e4;
            if (!this._events[o3]) return false;
            var l2, c2, u = this._events[o3], h = arguments.length;
            if (u.fn) {
              switch (u.once && this.removeListener(e4, u.fn, void 0, true), h) {
                case 1:
                  return u.fn.call(u.context), true;
                case 2:
                  return u.fn.call(u.context, t3), true;
                case 3:
                  return u.fn.call(u.context, t3, n3), true;
                case 4:
                  return u.fn.call(u.context, t3, n3, i3), true;
                case 5:
                  return u.fn.call(u.context, t3, n3, i3, a3), true;
                case 6:
                  return u.fn.call(u.context, t3, n3, i3, a3, s3), true;
              }
              for (c2 = 1, l2 = Array(h - 1); c2 < h; c2++) l2[c2 - 1] = arguments[c2];
              u.fn.apply(u.context, l2);
            } else {
              var d, p = u.length;
              for (c2 = 0; c2 < p; c2++) switch (u[c2].once && this.removeListener(e4, u[c2].fn, void 0, true), h) {
                case 1:
                  u[c2].fn.call(u[c2].context);
                  break;
                case 2:
                  u[c2].fn.call(u[c2].context, t3);
                  break;
                case 3:
                  u[c2].fn.call(u[c2].context, t3, n3);
                  break;
                case 4:
                  u[c2].fn.call(u[c2].context, t3, n3, i3);
                  break;
                default:
                  if (!l2) for (d = 1, l2 = Array(h - 1); d < h; d++) l2[d - 1] = arguments[d];
                  u[c2].fn.apply(u[c2].context, l2);
              }
            }
            return true;
          }, o2.prototype.on = function(e4, t3, r4) {
            return a2(this, e4, t3, r4, false);
          }, o2.prototype.once = function(e4, t3, r4) {
            return a2(this, e4, t3, r4, true);
          }, o2.prototype.removeListener = function(e4, t3, n3, i3) {
            var a3 = r3 ? r3 + e4 : e4;
            if (!this._events[a3]) return this;
            if (!t3) return s2(this, a3), this;
            var o3 = this._events[a3];
            if (o3.fn) o3.fn !== t3 || i3 && !o3.once || n3 && o3.context !== n3 || s2(this, a3);
            else {
              for (var l2 = 0, c2 = [], u = o3.length; l2 < u; l2++) (o3[l2].fn !== t3 || i3 && !o3[l2].once || n3 && o3[l2].context !== n3) && c2.push(o3[l2]);
              c2.length ? this._events[a3] = 1 === c2.length ? c2[0] : c2 : s2(this, a3);
            }
            return this;
          }, o2.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && s2(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, o2.prototype.off = o2.prototype.removeListener, o2.prototype.addListener = o2.prototype.on, o2.prefixed = r3, o2.EventEmitter = o2, e3.exports = o2;
        }, 213: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 574: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, i2 = e4.length;
            for (; i2 > 0; ) {
              let a2 = i2 / 2 | 0, s2 = n2 + a2;
              0 >= r3(e4[s2], t3) ? (n2 = ++s2, i2 -= a2 + 1) : i2 = a2;
            }
            return n2;
          };
        }, 821: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(574);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let i2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(i2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 816: (e3, t2, r3) => {
          let n2 = r3(213);
          class i2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let a2 = (e4, t3, r4) => new Promise((a3, s2) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void a3(e4);
            let o2 = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  a3(r4());
                } catch (e5) {
                  s2(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, o3 = r4 instanceof Error ? r4 : new i2(n3);
              "function" == typeof e4.cancel && e4.cancel(), s2(o3);
            }, t3);
            n2(e4.then(a3, s2), () => {
              clearTimeout(o2);
            });
          });
          e3.exports = a2, e3.exports.default = a2, e3.exports.TimeoutError = i2;
        } }, o = {};
        function l(e3) {
          var t2 = o[e3];
          if (void 0 !== t2) return t2.exports;
          var r3 = o[e3] = { exports: {} }, n2 = true;
          try {
            s[e3](r3, r3.exports, l), n2 = false;
          } finally {
            n2 && delete o[e3];
          }
          return r3.exports;
        }
        l.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var c = {};
        Object.defineProperty(c, "__esModule", { value: true }), e2 = l(993), r2 = l(816), n = l(821), i = () => {
        }, a = new r2.TimeoutError(), c.default = class extends e2 {
          constructor(e3) {
            var t2, r3, a2, s2;
            if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = i, this._resolveIdle = i, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: n.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (r3 = null == (t2 = e3.intervalCap) ? void 0 : t2.toString()) ? r3 : ""}\` (${typeof e3.intervalCap})`);
            if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (s2 = null == (a2 = e3.interval) ? void 0 : a2.toString()) ? s2 : ""}\` (${typeof e3.interval})`);
            this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
          }
          get _doesIntervalAllowAnother() {
            return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
          }
          get _doesConcurrentAllowAnother() {
            return this._pendingCount < this._concurrency;
          }
          _next() {
            this._pendingCount--, this._tryToStartAnother(), this.emit("next");
          }
          _resolvePromises() {
            this._resolveEmpty(), this._resolveEmpty = i, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = i, this.emit("idle"));
          }
          _onResumeInterval() {
            this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
          }
          _isIntervalPaused() {
            let e3 = Date.now();
            if (void 0 === this._intervalId) {
              let t2 = this._intervalEnd - e3;
              if (!(t2 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, t2)), true;
              this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            }
            return false;
          }
          _tryToStartAnother() {
            if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
            if (!this._isPaused) {
              let e3 = !this._isIntervalPaused();
              if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                let t2 = this._queue.dequeue();
                return !!t2 && (this.emit("active"), t2(), e3 && this._initializeIntervalIfNeeded(), true);
              }
            }
            return false;
          }
          _initializeIntervalIfNeeded() {
            this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
              this._onInterval();
            }, this._interval), this._intervalEnd = Date.now() + this._interval);
          }
          _onInterval() {
            0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
          }
          _processQueue() {
            for (; this._tryToStartAnother(); ) ;
          }
          get concurrency() {
            return this._concurrency;
          }
          set concurrency(e3) {
            if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
            this._concurrency = e3, this._processQueue();
          }
          async add(e3, t2 = {}) {
            return new Promise((n2, i2) => {
              let s2 = async () => {
                this._pendingCount++, this._intervalCount++;
                try {
                  let s3 = void 0 === this._timeout && void 0 === t2.timeout ? e3() : r2.default(Promise.resolve(e3()), void 0 === t2.timeout ? this._timeout : t2.timeout, () => {
                    (void 0 === t2.throwOnTimeout ? this._throwOnTimeout : t2.throwOnTimeout) && i2(a);
                  });
                  n2(await s3);
                } catch (e4) {
                  i2(e4);
                }
                this._next();
              };
              this._queue.enqueue(s2, t2), this._tryToStartAnother(), this.emit("add");
            });
          }
          async addAll(e3, t2) {
            return Promise.all(e3.map(async (e4) => this.add(e4, t2)));
          }
          start() {
            return this._isPaused && (this._isPaused = false, this._processQueue()), this;
          }
          pause() {
            this._isPaused = true;
          }
          clear() {
            this._queue = new this._queueClass();
          }
          async onEmpty() {
            if (0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveEmpty;
              this._resolveEmpty = () => {
                t2(), e3();
              };
            });
          }
          async onIdle() {
            if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveIdle;
              this._resolveIdle = () => {
                t2(), e3();
              };
            });
          }
          get size() {
            return this._queue.size;
          }
          sizeBy(e3) {
            return this._queue.filter(e3).length;
          }
          get pending() {
            return this._pendingCount;
          }
          get isPaused() {
            return this._isPaused;
          }
          get timeout() {
            return this._timeout;
          }
          set timeout(e3) {
            this._timeout = e3;
          }
        }, t.exports = c;
      })();
    }, 25085, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { getTestReqInfo: function() {
        return l;
      }, withRequest: function() {
        return o;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let a = new (e.r(78500)).AsyncLocalStorage();
      function s(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function o(e2, t2, r2) {
        let n2 = s(e2, t2);
        return n2 ? a.run(n2, r2) : r2();
      }
      function l(e2, t2) {
        let r2 = a.getStore();
        return r2 || (e2 && t2 ? s(e2, t2) : void 0);
      }
    }, 28325, (e, t, r) => {
      "use strict";
      var n = e.i(51615);
      Object.defineProperty(r, "__esModule", { value: true });
      var i = { handleFetch: function() {
        return c;
      }, interceptFetch: function() {
        return u;
      }, reader: function() {
        return o;
      } };
      for (var a in i) Object.defineProperty(r, a, { enumerable: true, get: i[a] });
      let s = e.r(25085), o = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function l(e2, t2) {
        let { url: r2, method: i2, headers: a2, body: s2, cache: o2, credentials: l2, integrity: c2, mode: u2, redirect: h, referrer: d, referrerPolicy: p } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(a2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: s2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: c2, mode: u2, redirect: h, referrer: d, referrerPolicy: p } };
      }
      async function c(e2, t2) {
        let r2 = (0, s.getTestReqInfo)(t2, o);
        if (!r2) return e2(t2);
        let { testData: i2, proxyPort: a2 } = r2, c2 = await l(i2, t2), u2 = await e2(`http://localhost:${a2}`, { method: "POST", body: JSON.stringify(c2), next: { internal: true } });
        if (!u2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${u2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let h = await u2.json(), { api: d } = h;
        switch (d) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(e3) {
              let { status: t3, headers: r3, body: i3 } = e3.response;
              return new Response(i3 ? n.Buffer.from(i3, "base64") : null, { status: t3, headers: new Headers(r3) });
            }(h);
          default:
            return d;
        }
      }
      function u(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : c(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 94165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { interceptTestApis: function() {
        return o;
      }, wrapRequestHandler: function() {
        return l;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let a = e.r(25085), s = e.r(28325);
      function o() {
        return (0, s.interceptFetch)(e.g.fetch);
      }
      function l(e2) {
        return (t2, r2) => (0, a.withRequest)(t2, s.reader, () => e2(t2, r2));
      }
    }, 54846, (e, t, r) => {
      !function() {
        "use strict";
        var e2 = { 114: function(e3) {
          function t2(e4) {
            if ("string" != typeof e4) throw TypeError("Path must be a string. Received " + JSON.stringify(e4));
          }
          function r3(e4, t3) {
            for (var r4, n3 = "", i = 0, a = -1, s = 0, o = 0; o <= e4.length; ++o) {
              if (o < e4.length) r4 = e4.charCodeAt(o);
              else if (47 === r4) break;
              else r4 = 47;
              if (47 === r4) {
                if (a === o - 1 || 1 === s) ;
                else if (a !== o - 1 && 2 === s) {
                  if (n3.length < 2 || 2 !== i || 46 !== n3.charCodeAt(n3.length - 1) || 46 !== n3.charCodeAt(n3.length - 2)) {
                    if (n3.length > 2) {
                      var l = n3.lastIndexOf("/");
                      if (l !== n3.length - 1) {
                        -1 === l ? (n3 = "", i = 0) : i = (n3 = n3.slice(0, l)).length - 1 - n3.lastIndexOf("/"), a = o, s = 0;
                        continue;
                      }
                    } else if (2 === n3.length || 1 === n3.length) {
                      n3 = "", i = 0, a = o, s = 0;
                      continue;
                    }
                  }
                  t3 && (n3.length > 0 ? n3 += "/.." : n3 = "..", i = 2);
                } else n3.length > 0 ? n3 += "/" + e4.slice(a + 1, o) : n3 = e4.slice(a + 1, o), i = o - a - 1;
                a = o, s = 0;
              } else 46 === r4 && -1 !== s ? ++s : s = -1;
            }
            return n3;
          }
          var n2 = { resolve: function() {
            for (var e4, n3, i = "", a = false, s = arguments.length - 1; s >= -1 && !a; s--) s >= 0 ? n3 = arguments[s] : (void 0 === e4 && (e4 = ""), n3 = e4), t2(n3), 0 !== n3.length && (i = n3 + "/" + i, a = 47 === n3.charCodeAt(0));
            if (i = r3(i, !a), a) if (i.length > 0) return "/" + i;
            else return "/";
            return i.length > 0 ? i : ".";
          }, normalize: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            var n3 = 47 === e4.charCodeAt(0), i = 47 === e4.charCodeAt(e4.length - 1);
            return (0 !== (e4 = r3(e4, !n3)).length || n3 || (e4 = "."), e4.length > 0 && i && (e4 += "/"), n3) ? "/" + e4 : e4;
          }, isAbsolute: function(e4) {
            return t2(e4), e4.length > 0 && 47 === e4.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var e4, r4 = 0; r4 < arguments.length; ++r4) {
              var i = arguments[r4];
              t2(i), i.length > 0 && (void 0 === e4 ? e4 = i : e4 += "/" + i);
            }
            return void 0 === e4 ? "." : n2.normalize(e4);
          }, relative: function(e4, r4) {
            if (t2(e4), t2(r4), e4 === r4 || (e4 = n2.resolve(e4)) === (r4 = n2.resolve(r4))) return "";
            for (var i = 1; i < e4.length && 47 === e4.charCodeAt(i); ++i) ;
            for (var a = e4.length, s = a - i, o = 1; o < r4.length && 47 === r4.charCodeAt(o); ++o) ;
            for (var l = r4.length - o, c = s < l ? s : l, u = -1, h = 0; h <= c; ++h) {
              if (h === c) {
                if (l > c) {
                  if (47 === r4.charCodeAt(o + h)) return r4.slice(o + h + 1);
                  else if (0 === h) return r4.slice(o + h);
                } else s > c && (47 === e4.charCodeAt(i + h) ? u = h : 0 === h && (u = 0));
                break;
              }
              var d = e4.charCodeAt(i + h);
              if (d !== r4.charCodeAt(o + h)) break;
              47 === d && (u = h);
            }
            var p = "";
            for (h = i + u + 1; h <= a; ++h) (h === a || 47 === e4.charCodeAt(h)) && (0 === p.length ? p += ".." : p += "/..");
            return p.length > 0 ? p + r4.slice(o + u) : (o += u, 47 === r4.charCodeAt(o) && ++o, r4.slice(o));
          }, _makeLong: function(e4) {
            return e4;
          }, dirname: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            for (var r4 = e4.charCodeAt(0), n3 = 47 === r4, i = -1, a = true, s = e4.length - 1; s >= 1; --s) if (47 === (r4 = e4.charCodeAt(s))) {
              if (!a) {
                i = s;
                break;
              }
            } else a = false;
            return -1 === i ? n3 ? "/" : "." : n3 && 1 === i ? "//" : e4.slice(0, i);
          }, basename: function(e4, r4) {
            if (void 0 !== r4 && "string" != typeof r4) throw TypeError('"ext" argument must be a string');
            t2(e4);
            var n3, i = 0, a = -1, s = true;
            if (void 0 !== r4 && r4.length > 0 && r4.length <= e4.length) {
              if (r4.length === e4.length && r4 === e4) return "";
              var o = r4.length - 1, l = -1;
              for (n3 = e4.length - 1; n3 >= 0; --n3) {
                var c = e4.charCodeAt(n3);
                if (47 === c) {
                  if (!s) {
                    i = n3 + 1;
                    break;
                  }
                } else -1 === l && (s = false, l = n3 + 1), o >= 0 && (c === r4.charCodeAt(o) ? -1 == --o && (a = n3) : (o = -1, a = l));
              }
              return i === a ? a = l : -1 === a && (a = e4.length), e4.slice(i, a);
            }
            for (n3 = e4.length - 1; n3 >= 0; --n3) if (47 === e4.charCodeAt(n3)) {
              if (!s) {
                i = n3 + 1;
                break;
              }
            } else -1 === a && (s = false, a = n3 + 1);
            return -1 === a ? "" : e4.slice(i, a);
          }, extname: function(e4) {
            t2(e4);
            for (var r4 = -1, n3 = 0, i = -1, a = true, s = 0, o = e4.length - 1; o >= 0; --o) {
              var l = e4.charCodeAt(o);
              if (47 === l) {
                if (!a) {
                  n3 = o + 1;
                  break;
                }
                continue;
              }
              -1 === i && (a = false, i = o + 1), 46 === l ? -1 === r4 ? r4 = o : 1 !== s && (s = 1) : -1 !== r4 && (s = -1);
            }
            return -1 === r4 || -1 === i || 0 === s || 1 === s && r4 === i - 1 && r4 === n3 + 1 ? "" : e4.slice(r4, i);
          }, format: function(e4) {
            var t3, r4;
            if (null === e4 || "object" != typeof e4) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e4);
            return t3 = e4.dir || e4.root, r4 = e4.base || (e4.name || "") + (e4.ext || ""), t3 ? t3 === e4.root ? t3 + r4 : t3 + "/" + r4 : r4;
          }, parse: function(e4) {
            t2(e4);
            var r4, n3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === e4.length) return n3;
            var i = e4.charCodeAt(0), a = 47 === i;
            a ? (n3.root = "/", r4 = 1) : r4 = 0;
            for (var s = -1, o = 0, l = -1, c = true, u = e4.length - 1, h = 0; u >= r4; --u) {
              if (47 === (i = e4.charCodeAt(u))) {
                if (!c) {
                  o = u + 1;
                  break;
                }
                continue;
              }
              -1 === l && (c = false, l = u + 1), 46 === i ? -1 === s ? s = u : 1 !== h && (h = 1) : -1 !== s && (h = -1);
            }
            return -1 === s || -1 === l || 0 === h || 1 === h && s === l - 1 && s === o + 1 ? -1 !== l && (0 === o && a ? n3.base = n3.name = e4.slice(1, l) : n3.base = n3.name = e4.slice(o, l)) : (0 === o && a ? (n3.name = e4.slice(1, s), n3.base = e4.slice(1, l)) : (n3.name = e4.slice(o, s), n3.base = e4.slice(o, l)), n3.ext = e4.slice(s, l)), o > 0 ? n3.dir = e4.slice(0, o - 1) : a && (n3.dir = "/"), n3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          n2.posix = n2, e3.exports = n2;
        } }, r2 = {};
        function n(t2) {
          var i = r2[t2];
          if (void 0 !== i) return i.exports;
          var a = r2[t2] = { exports: {} }, s = true;
          try {
            e2[t2](a, a.exports, n), s = false;
          } finally {
            s && delete r2[t2];
          }
          return a.exports;
        }
        n.ab = "/ROOT/node_modules/next/dist/compiled/path-browserify/", t.exports = n(114);
      }();
    }, 68886, (e, t, r) => {
      t.exports = e.r(54846);
    }, 67914, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/path-to-regexp/");
        var e2 = {};
        (() => {
          function t2(e3, t3) {
            void 0 === t3 && (t3 = {});
            for (var r3 = function(e4) {
              for (var t4 = [], r4 = 0; r4 < e4.length; ) {
                var n3 = e4[r4];
                if ("*" === n3 || "+" === n3 || "?" === n3) {
                  t4.push({ type: "MODIFIER", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("\\" === n3) {
                  t4.push({ type: "ESCAPED_CHAR", index: r4++, value: e4[r4++] });
                  continue;
                }
                if ("{" === n3) {
                  t4.push({ type: "OPEN", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("}" === n3) {
                  t4.push({ type: "CLOSE", index: r4, value: e4[r4++] });
                  continue;
                }
                if (":" === n3) {
                  for (var i2 = "", a3 = r4 + 1; a3 < e4.length; ) {
                    var s3 = e4.charCodeAt(a3);
                    if (s3 >= 48 && s3 <= 57 || s3 >= 65 && s3 <= 90 || s3 >= 97 && s3 <= 122 || 95 === s3) {
                      i2 += e4[a3++];
                      continue;
                    }
                    break;
                  }
                  if (!i2) throw TypeError("Missing parameter name at ".concat(r4));
                  t4.push({ type: "NAME", index: r4, value: i2 }), r4 = a3;
                  continue;
                }
                if ("(" === n3) {
                  var o3 = 1, l2 = "", a3 = r4 + 1;
                  if ("?" === e4[a3]) throw TypeError('Pattern cannot start with "?" at '.concat(a3));
                  for (; a3 < e4.length; ) {
                    if ("\\" === e4[a3]) {
                      l2 += e4[a3++] + e4[a3++];
                      continue;
                    }
                    if (")" === e4[a3]) {
                      if (0 == --o3) {
                        a3++;
                        break;
                      }
                    } else if ("(" === e4[a3] && (o3++, "?" !== e4[a3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(a3));
                    l2 += e4[a3++];
                  }
                  if (o3) throw TypeError("Unbalanced pattern at ".concat(r4));
                  if (!l2) throw TypeError("Missing pattern at ".concat(r4));
                  t4.push({ type: "PATTERN", index: r4, value: l2 }), r4 = a3;
                  continue;
                }
                t4.push({ type: "CHAR", index: r4, value: e4[r4++] });
              }
              return t4.push({ type: "END", index: r4, value: "" }), t4;
            }(e3), n2 = t3.prefixes, a2 = void 0 === n2 ? "./" : n2, s2 = t3.delimiter, o2 = void 0 === s2 ? "/#?" : s2, l = [], c = 0, u = 0, h = "", d = function(e4) {
              if (u < r3.length && r3[u].type === e4) return r3[u++].value;
            }, p = function(e4) {
              var t4 = d(e4);
              if (void 0 !== t4) return t4;
              var n3 = r3[u], i2 = n3.type, a3 = n3.index;
              throw TypeError("Unexpected ".concat(i2, " at ").concat(a3, ", expected ").concat(e4));
            }, f = function() {
              for (var e4, t4 = ""; e4 = d("CHAR") || d("ESCAPED_CHAR"); ) t4 += e4;
              return t4;
            }, g = function(e4) {
              for (var t4 = 0; t4 < o2.length; t4++) {
                var r4 = o2[t4];
                if (e4.indexOf(r4) > -1) return true;
              }
              return false;
            }, m = function(e4) {
              var t4 = l[l.length - 1], r4 = e4 || (t4 && "string" == typeof t4 ? t4 : "");
              if (t4 && !r4) throw TypeError('Must have text between two parameters, missing text after "'.concat(t4.name, '"'));
              return !r4 || g(r4) ? "[^".concat(i(o2), "]+?") : "(?:(?!".concat(i(r4), ")[^").concat(i(o2), "])+?");
            }; u < r3.length; ) {
              var y = d("CHAR"), b = d("NAME"), w = d("PATTERN");
              if (b || w) {
                var v = y || "";
                -1 === a2.indexOf(v) && (h += v, v = ""), h && (l.push(h), h = ""), l.push({ name: b || c++, prefix: v, suffix: "", pattern: w || m(v), modifier: d("MODIFIER") || "" });
                continue;
              }
              var _ = y || d("ESCAPED_CHAR");
              if (_) {
                h += _;
                continue;
              }
              if (h && (l.push(h), h = ""), d("OPEN")) {
                var v = f(), x = d("NAME") || "", E = d("PATTERN") || "", k = f();
                p("CLOSE"), l.push({ name: x || (E ? c++ : ""), pattern: x && !E ? m(v) : E, prefix: v, suffix: k, modifier: d("MODIFIER") || "" });
                continue;
              }
              p("END");
            }
            return l;
          }
          function r2(e3, t3) {
            void 0 === t3 && (t3 = {});
            var r3 = a(t3), n2 = t3.encode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2, s2 = t3.validate, o2 = void 0 === s2 || s2, l = e3.map(function(e4) {
              if ("object" == typeof e4) return new RegExp("^(?:".concat(e4.pattern, ")$"), r3);
            });
            return function(t4) {
              for (var r4 = "", n3 = 0; n3 < e3.length; n3++) {
                var a2 = e3[n3];
                if ("string" == typeof a2) {
                  r4 += a2;
                  continue;
                }
                var s3 = t4 ? t4[a2.name] : void 0, c = "?" === a2.modifier || "*" === a2.modifier, u = "*" === a2.modifier || "+" === a2.modifier;
                if (Array.isArray(s3)) {
                  if (!u) throw TypeError('Expected "'.concat(a2.name, '" to not repeat, but got an array'));
                  if (0 === s3.length) {
                    if (c) continue;
                    throw TypeError('Expected "'.concat(a2.name, '" to not be empty'));
                  }
                  for (var h = 0; h < s3.length; h++) {
                    var d = i2(s3[h], a2);
                    if (o2 && !l[n3].test(d)) throw TypeError('Expected all "'.concat(a2.name, '" to match "').concat(a2.pattern, '", but got "').concat(d, '"'));
                    r4 += a2.prefix + d + a2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof s3 || "number" == typeof s3) {
                  var d = i2(String(s3), a2);
                  if (o2 && !l[n3].test(d)) throw TypeError('Expected "'.concat(a2.name, '" to match "').concat(a2.pattern, '", but got "').concat(d, '"'));
                  r4 += a2.prefix + d + a2.suffix;
                  continue;
                }
                if (!c) {
                  var p = u ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(a2.name, '" to be ').concat(p));
                }
              }
              return r4;
            };
          }
          function n(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            var n2 = r3.decode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2;
            return function(r4) {
              var n3 = e3.exec(r4);
              if (!n3) return false;
              for (var a2 = n3[0], s2 = n3.index, o2 = /* @__PURE__ */ Object.create(null), l = 1; l < n3.length; l++) !function(e4) {
                if (void 0 !== n3[e4]) {
                  var r5 = t3[e4 - 1];
                  "*" === r5.modifier || "+" === r5.modifier ? o2[r5.name] = n3[e4].split(r5.prefix + r5.suffix).map(function(e5) {
                    return i2(e5, r5);
                  }) : o2[r5.name] = i2(n3[e4], r5);
                }
              }(l);
              return { path: a2, index: s2, params: o2 };
            };
          }
          function i(e3) {
            return e3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function a(e3) {
            return e3 && e3.sensitive ? "" : "i";
          }
          function s(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            for (var n2 = r3.strict, s2 = void 0 !== n2 && n2, o2 = r3.start, l = r3.end, c = r3.encode, u = void 0 === c ? function(e4) {
              return e4;
            } : c, h = r3.delimiter, d = r3.endsWith, p = "[".concat(i(void 0 === d ? "" : d), "]|$"), f = "[".concat(i(void 0 === h ? "/#?" : h), "]"), g = void 0 === o2 || o2 ? "^" : "", m = 0; m < e3.length; m++) {
              var y = e3[m];
              if ("string" == typeof y) g += i(u(y));
              else {
                var b = i(u(y.prefix)), w = i(u(y.suffix));
                if (y.pattern) if (t3 && t3.push(y), b || w) if ("+" === y.modifier || "*" === y.modifier) {
                  var v = "*" === y.modifier ? "?" : "";
                  g += "(?:".concat(b, "((?:").concat(y.pattern, ")(?:").concat(w).concat(b, "(?:").concat(y.pattern, "))*)").concat(w, ")").concat(v);
                } else g += "(?:".concat(b, "(").concat(y.pattern, ")").concat(w, ")").concat(y.modifier);
                else {
                  if ("+" === y.modifier || "*" === y.modifier) throw TypeError('Can not repeat "'.concat(y.name, '" without a prefix and suffix'));
                  g += "(".concat(y.pattern, ")").concat(y.modifier);
                }
                else g += "(?:".concat(b).concat(w, ")").concat(y.modifier);
              }
            }
            if (void 0 === l || l) s2 || (g += "".concat(f, "?")), g += r3.endsWith ? "(?=".concat(p, ")") : "$";
            else {
              var _ = e3[e3.length - 1], x = "string" == typeof _ ? f.indexOf(_[_.length - 1]) > -1 : void 0 === _;
              s2 || (g += "(?:".concat(f, "(?=").concat(p, "))?")), x || (g += "(?=".concat(f, "|").concat(p, ")"));
            }
            return new RegExp(g, a(r3));
          }
          function o(e3, r3, n2) {
            if (e3 instanceof RegExp) {
              var i2;
              if (!r3) return e3;
              for (var l = /\((?:\?<(.*?)>)?(?!\?)/g, c = 0, u = l.exec(e3.source); u; ) r3.push({ name: u[1] || c++, prefix: "", suffix: "", modifier: "", pattern: "" }), u = l.exec(e3.source);
              return e3;
            }
            return Array.isArray(e3) ? (i2 = e3.map(function(e4) {
              return o(e4, r3, n2).source;
            }), new RegExp("(?:".concat(i2.join("|"), ")"), a(n2))) : s(t2(e3, n2), r3, n2);
          }
          Object.defineProperty(e2, "__esModule", { value: true }), e2.pathToRegexp = e2.tokensToRegexp = e2.regexpToFunction = e2.match = e2.tokensToFunction = e2.compile = e2.parse = void 0, e2.parse = t2, e2.compile = function(e3, n2) {
            return r2(t2(e3, n2), n2);
          }, e2.tokensToFunction = r2, e2.match = function(e3, t3) {
            var r3 = [];
            return n(o(e3, r3, t3), r3, t3);
          }, e2.regexpToFunction = n, e2.tokensToRegexp = s, e2.pathToRegexp = o;
        })(), t.exports = e2;
      })();
    }, 64445, (e, t, r) => {
      var n = { 226: function(t2, r2) {
        !function(n2) {
          "use strict";
          var i2 = "function", a2 = "undefined", s = "object", o = "string", l = "major", c = "model", u = "name", h = "type", d = "vendor", p = "version", f = "architecture", g = "console", m = "mobile", y = "tablet", b = "smarttv", w = "wearable", v = "embedded", _ = "Amazon", x = "Apple", E = "ASUS", k = "BlackBerry", S = "Browser", T = "Chrome", A = "Firefox", R = "Google", C = "Huawei", O = "Microsoft", P = "Motorola", I = "Opera", j = "Samsung", $ = "Sharp", N = "Sony", U = "Xiaomi", D = "Zebra", L = "Facebook", M = "Chromium OS", H = "Mac OS", B = function(e2, t3) {
            var r3 = {};
            for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r3[n3] = t3[n3].concat(e2[n3]) : r3[n3] = e2[n3];
            return r3;
          }, W = function(e2) {
            for (var t3 = {}, r3 = 0; r3 < e2.length; r3++) t3[e2[r3].toUpperCase()] = e2[r3];
            return t3;
          }, q = function(e2, t3) {
            return typeof e2 === o && -1 !== K(t3).indexOf(K(e2));
          }, K = function(e2) {
            return e2.toLowerCase();
          }, J = function(e2, t3) {
            if (typeof e2 === o) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === a2 ? e2 : e2.substring(0, 350);
          }, F = function(e2, t3) {
            for (var r3, n3, a3, o2, l2, c2, u2 = 0; u2 < t3.length && !l2; ) {
              var h2 = t3[u2], d2 = t3[u2 + 1];
              for (r3 = n3 = 0; r3 < h2.length && !l2 && h2[r3]; ) if (l2 = h2[r3++].exec(e2)) for (a3 = 0; a3 < d2.length; a3++) c2 = l2[++n3], typeof (o2 = d2[a3]) === s && o2.length > 0 ? 2 === o2.length ? typeof o2[1] == i2 ? this[o2[0]] = o2[1].call(this, c2) : this[o2[0]] = o2[1] : 3 === o2.length ? typeof o2[1] !== i2 || o2[1].exec && o2[1].test ? this[o2[0]] = c2 ? c2.replace(o2[1], o2[2]) : void 0 : this[o2[0]] = c2 ? o2[1].call(this, c2, o2[2]) : void 0 : 4 === o2.length && (this[o2[0]] = c2 ? o2[3].call(this, c2.replace(o2[1], o2[2])) : void 0) : this[o2] = c2 || void 0;
              u2 += 2;
            }
          }, z = function(e2, t3) {
            for (var r3 in t3) if (typeof t3[r3] === s && t3[r3].length > 0) {
              for (var n3 = 0; n3 < t3[r3].length; n3++) if (q(t3[r3][n3], e2)) return "?" === r3 ? void 0 : r3;
            } else if (q(t3[r3], e2)) return "?" === r3 ? void 0 : r3;
            return e2;
          }, V = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, G = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [p, [u, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [p, [u, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [u, p], [/opios[\/ ]+([\w\.]+)/i], [p, [u, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [p, [u, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [u, p], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [p, [u, "UC" + S]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [p, [u, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [p, [u, "WeChat"]], [/konqueror\/([\w\.]+)/i], [p, [u, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [p, [u, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [p, [u, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[u, /(.+)/, "$1 Secure " + S], p], [/\bfocus\/([\w\.]+)/i], [p, [u, A + " Focus"]], [/\bopt\/([\w\.]+)/i], [p, [u, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [p, [u, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [p, [u, "Dolphin"]], [/coast\/([\w\.]+)/i], [p, [u, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [p, [u, "MIUI " + S]], [/fxios\/([-\w\.]+)/i], [p, [u, A]], [/\bqihu|(qi?ho?o?|360)browser/i], [[u, "360 " + S]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[u, /(.+)/, "$1 " + S], p], [/(comodo_dragon)\/([\w\.]+)/i], [[u, /_/g, " "], p], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [u, p], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [u], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[u, L], p], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [u, p], [/\bgsa\/([\w\.]+) .*safari\//i], [p, [u, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [p, [u, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [p, [u, T + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[u, T + " WebView"], p], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [p, [u, "Android " + S]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [u, p], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [p, [u, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [p, u], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [u, [p, z, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [u, p], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[u, "Netscape"], p], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [p, [u, A + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [u, p], [/(cobalt)\/([\w\.]+)/i], [u, [p, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[f, "amd64"]], [/(ia32(?=;))/i], [[f, K]], [/((?:i[346]|x)86)[;\)]/i], [[f, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[f, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[f, "armhf"]], [/windows (ce|mobile); ppc;/i], [[f, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[f, /ower/, "", K]], [/(sun4\w)[;\)]/i], [[f, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[f, K]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [c, [d, j], [h, y]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [c, [d, j], [h, m]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [c, [d, x], [h, m]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [c, [d, x], [h, y]], [/(macintosh);/i], [c, [d, x]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [c, [d, $], [h, m]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [c, [d, C], [h, y]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [c, [d, C], [h, m]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[c, /_/g, " "], [d, U], [h, m]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[c, /_/g, " "], [d, U], [h, y]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [c, [d, "OPPO"], [h, m]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [c, [d, "Vivo"], [h, m]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [c, [d, "Realme"], [h, m]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [c, [d, P], [h, m]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [c, [d, P], [h, y]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [c, [d, "LG"], [h, y]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [c, [d, "LG"], [h, m]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [c, [d, "Lenovo"], [h, y]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[c, /_/g, " "], [d, "Nokia"], [h, m]], [/(pixel c)\b/i], [c, [d, R], [h, y]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [c, [d, R], [h, m]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [c, [d, N], [h, m]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[c, "Xperia Tablet"], [d, N], [h, y]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [c, [d, "OnePlus"], [h, m]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [c, [d, _], [h, y]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[c, /(.+)/g, "Fire Phone $1"], [d, _], [h, m]], [/(playbook);[-\w\),; ]+(rim)/i], [c, d, [h, y]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [c, [d, k], [h, m]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [c, [d, E], [h, y]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [c, [d, E], [h, m]], [/(nexus 9)/i], [c, [d, "HTC"], [h, y]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [d, [c, /_/g, " "], [h, m]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [c, [d, "Acer"], [h, y]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [c, [d, "Meizu"], [h, m]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [d, c, [h, m]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [d, c, [h, y]], [/(surface duo)/i], [c, [d, O], [h, y]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [c, [d, "Fairphone"], [h, m]], [/(u304aa)/i], [c, [d, "AT&T"], [h, m]], [/\bsie-(\w*)/i], [c, [d, "Siemens"], [h, m]], [/\b(rct\w+) b/i], [c, [d, "RCA"], [h, y]], [/\b(venue[\d ]{2,7}) b/i], [c, [d, "Dell"], [h, y]], [/\b(q(?:mv|ta)\w+) b/i], [c, [d, "Verizon"], [h, y]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [c, [d, "Barnes & Noble"], [h, y]], [/\b(tm\d{3}\w+) b/i], [c, [d, "NuVision"], [h, y]], [/\b(k88) b/i], [c, [d, "ZTE"], [h, y]], [/\b(nx\d{3}j) b/i], [c, [d, "ZTE"], [h, m]], [/\b(gen\d{3}) b.+49h/i], [c, [d, "Swiss"], [h, m]], [/\b(zur\d{3}) b/i], [c, [d, "Swiss"], [h, y]], [/\b((zeki)?tb.*\b) b/i], [c, [d, "Zeki"], [h, y]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[d, "Dragon Touch"], c, [h, y]], [/\b(ns-?\w{0,9}) b/i], [c, [d, "Insignia"], [h, y]], [/\b((nxa|next)-?\w{0,9}) b/i], [c, [d, "NextBook"], [h, y]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[d, "Voice"], c, [h, m]], [/\b(lvtel\-)?(v1[12]) b/i], [[d, "LvTel"], c, [h, m]], [/\b(ph-1) /i], [c, [d, "Essential"], [h, m]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [c, [d, "Envizen"], [h, y]], [/\b(trio[-\w\. ]+) b/i], [c, [d, "MachSpeed"], [h, y]], [/\btu_(1491) b/i], [c, [d, "Rotor"], [h, y]], [/(shield[\w ]+) b/i], [c, [d, "Nvidia"], [h, y]], [/(sprint) (\w+)/i], [d, c, [h, m]], [/(kin\.[onetw]{3})/i], [[c, /\./g, " "], [d, O], [h, m]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [c, [d, D], [h, y]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [c, [d, D], [h, m]], [/smart-tv.+(samsung)/i], [d, [h, b]], [/hbbtv.+maple;(\d+)/i], [[c, /^/, "SmartTV"], [d, j], [h, b]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[d, "LG"], [h, b]], [/(apple) ?tv/i], [d, [c, x + " TV"], [h, b]], [/crkey/i], [[c, T + "cast"], [d, R], [h, b]], [/droid.+aft(\w)( bui|\))/i], [c, [d, _], [h, b]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [c, [d, $], [h, b]], [/(bravia[\w ]+)( bui|\))/i], [c, [d, N], [h, b]], [/(mitv-\w{5}) bui/i], [c, [d, U], [h, b]], [/Hbbtv.*(technisat) (.*);/i], [d, c, [h, b]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[d, J], [c, J], [h, b]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[h, b]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [d, c, [h, g]], [/droid.+; (shield) bui/i], [c, [d, "Nvidia"], [h, g]], [/(playstation [345portablevi]+)/i], [c, [d, N], [h, g]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [c, [d, O], [h, g]], [/((pebble))app/i], [d, c, [h, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [c, [d, x], [h, w]], [/droid.+; (glass) \d/i], [c, [d, R], [h, w]], [/droid.+; (wt63?0{2,3})\)/i], [c, [d, D], [h, w]], [/(quest( 2| pro)?)/i], [c, [d, L], [h, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [d, [h, v]], [/(aeobc)\b/i], [c, [d, _], [h, v]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [c, [h, m]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [c, [h, y]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[h, y]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[h, m]], [/(android[-\w\. ]{0,9});.+buil/i], [c, [d, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [p, [u, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [p, [u, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [u, p], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [p, u]], os: [[/microsoft (windows) (vista|xp)/i], [u, p], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [u, [p, z, V]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[u, "Windows"], [p, z, V]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[p, /_/g, "."], [u, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[u, H], [p, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [p, u], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [u, p], [/\(bb(10);/i], [p, [u, k]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [p, [u, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [p, [u, A + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [p, [u, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [p, [u, "watchOS"]], [/crkey\/([\d\.]+)/i], [p, [u, T + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[u, M], p], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [u, p], [/(sunos) ?([\w\.\d]*)/i], [[u, "Solaris"], p], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [u, p]] }, X = function(e2, t3) {
            if (typeof e2 === s && (t3 = e2, e2 = void 0), !(this instanceof X)) return new X(e2, t3).getResult();
            var r3 = typeof n2 !== a2 && n2.navigator ? n2.navigator : void 0, g2 = e2 || (r3 && r3.userAgent ? r3.userAgent : ""), b2 = r3 && r3.userAgentData ? r3.userAgentData : void 0, w2 = t3 ? B(G, t3) : G, v2 = r3 && r3.userAgent == g2;
            return this.getBrowser = function() {
              var e3, t4 = {};
              return t4[u] = void 0, t4[p] = void 0, F.call(t4, g2, w2.browser), t4[l] = typeof (e3 = t4[p]) === o ? e3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, v2 && r3 && r3.brave && typeof r3.brave.isBrave == i2 && (t4[u] = "Brave"), t4;
            }, this.getCPU = function() {
              var e3 = {};
              return e3[f] = void 0, F.call(e3, g2, w2.cpu), e3;
            }, this.getDevice = function() {
              var e3 = {};
              return e3[d] = void 0, e3[c] = void 0, e3[h] = void 0, F.call(e3, g2, w2.device), v2 && !e3[h] && b2 && b2.mobile && (e3[h] = m), v2 && "Macintosh" == e3[c] && r3 && typeof r3.standalone !== a2 && r3.maxTouchPoints && r3.maxTouchPoints > 2 && (e3[c] = "iPad", e3[h] = y), e3;
            }, this.getEngine = function() {
              var e3 = {};
              return e3[u] = void 0, e3[p] = void 0, F.call(e3, g2, w2.engine), e3;
            }, this.getOS = function() {
              var e3 = {};
              return e3[u] = void 0, e3[p] = void 0, F.call(e3, g2, w2.os), v2 && !e3[u] && b2 && "Unknown" != b2.platform && (e3[u] = b2.platform.replace(/chrome os/i, M).replace(/macos/i, H)), e3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return g2;
            }, this.setUA = function(e3) {
              return g2 = typeof e3 === o && e3.length > 350 ? J(e3, 350) : e3, this;
            }, this.setUA(g2), this;
          };
          if (X.VERSION = "1.0.35", X.BROWSER = W([u, p, l]), X.CPU = W([f]), X.DEVICE = W([c, d, h, g, m, b, y, w, v]), X.ENGINE = X.OS = W([u, p]), typeof r2 !== a2) t2.exports && (r2 = t2.exports = X), r2.UAParser = X;
          else if (typeof define === i2 && define.amd) e.r, void 0 !== X && e.v(X);
          else typeof n2 !== a2 && (n2.UAParser = X);
          var Y = typeof n2 !== a2 && (n2.jQuery || n2.Zepto);
          if (Y && !Y.ua) {
            var Z = new X();
            Y.ua = Z.getResult(), Y.ua.get = function() {
              return Z.getUA();
            }, Y.ua.set = function(e2) {
              Z.setUA(e2);
              var t3 = Z.getResult();
              for (var r3 in t3) Y.ua[r3] = t3[r3];
            };
          }
        }(this);
      } }, i = {};
      function a(e2) {
        var t2 = i[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = i[e2] = { exports: {} }, s = true;
        try {
          n[e2].call(r2.exports, r2, r2.exports, a), s = false;
        } finally {
          s && delete i[e2];
        }
        return r2.exports;
      }
      a.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = a(226);
    }, 8946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function i(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var a = Array.isArray;
      function s() {
      }
      var o = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), d = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), m = Symbol.for("react.activity"), y = Symbol.for("react.view_transition"), b = Symbol.iterator, w = Object.prototype.hasOwnProperty, v = Object.assign;
      function _(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: o, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function x(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === o;
      }
      var E = /\/+/g;
      function k(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function S(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], c2 = 0;
        return !function e3(t3, r3, n3, c3, u2) {
          var h2, d2, p2, f2 = typeof t3;
          ("undefined" === f2 || "boolean" === f2) && (t3 = null);
          var m2 = false;
          if (null === t3) m2 = true;
          else switch (f2) {
            case "bigint":
            case "string":
            case "number":
              m2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case o:
                case l:
                  m2 = true;
                  break;
                case g:
                  return e3((m2 = t3._init)(t3._payload), r3, n3, c3, u2);
              }
          }
          if (m2) return u2 = u2(t3), m2 = "" === c3 ? "." + k(t3, 0) : c3, a(u2) ? (n3 = "", null != m2 && (n3 = m2.replace(E, "$&/") + "/"), e3(u2, r3, n3, "", function(e4) {
            return e4;
          })) : null != u2 && (x(u2) && (h2 = u2, d2 = n3 + (null == u2.key || t3 && t3.key === u2.key ? "" : ("" + u2.key).replace(E, "$&/") + "/") + m2, u2 = _(h2.type, d2, h2.props)), r3.push(u2)), 1;
          m2 = 0;
          var y2 = "" === c3 ? "." : c3 + ":";
          if (a(t3)) for (var w2 = 0; w2 < t3.length; w2++) f2 = y2 + k(c3 = t3[w2], w2), m2 += e3(c3, r3, n3, f2, u2);
          else if ("function" == typeof (w2 = null === (p2 = t3) || "object" != typeof p2 ? null : "function" == typeof (p2 = b && p2[b] || p2["@@iterator"]) ? p2 : null)) for (t3 = w2.call(t3), w2 = 0; !(c3 = t3.next()).done; ) f2 = y2 + k(c3 = c3.value, w2++), m2 += e3(c3, r3, n3, f2, u2);
          else if ("object" === f2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(s, s) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, c3, u2);
            throw Error(i(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return m2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, c2++);
        }), n2;
      }
      function T(e2) {
        if (-1 === e2._status) {
          var t2 = (0, e2._result)();
          t2.then(function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = r2, void 0 === t2.status && (t2.status = "fulfilled", t2.value = r2));
          }, function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = r2, void 0 === t2.status && (t2.status = "rejected", t2.reason = r2));
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function A() {
        return /* @__PURE__ */ new WeakMap();
      }
      function R() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Activity = m, r.Children = { map: S, forEach: function(e2, t2, r2) {
        S(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return S(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return S(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!x(e2)) throw Error(i(143));
        return e2;
      } }, r.Fragment = c, r.Profiler = h, r.StrictMode = u, r.Suspense = p, r.ViewTransition = y, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(A);
          void 0 === (t2 = r2.get(e2)) && (t2 = R(), r2.set(e2, t2)), r2 = 0;
          for (var i2 = arguments.length; r2 < i2; r2++) {
            var a2 = arguments[r2];
            if ("function" == typeof a2 || "object" == typeof a2 && null !== a2) {
              var s2 = t2.o;
              null === s2 && (t2.o = s2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = s2.get(a2)) && (t2 = R(), s2.set(a2, t2));
            } else null === (s2 = t2.p) && (t2.p = s2 = /* @__PURE__ */ new Map()), void 0 === (t2 = s2.get(a2)) && (t2 = R(), s2.set(a2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var o2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = o2;
          } catch (e3) {
            throw (o2 = t2).s = 2, o2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(i(267, e2));
        var n2 = v({}, e2.props), a2 = e2.key;
        if (null != t2) for (s2 in void 0 !== t2.key && (a2 = "" + t2.key), t2) w.call(t2, s2) && "key" !== s2 && "__self" !== s2 && "__source" !== s2 && ("ref" !== s2 || void 0 !== t2.ref) && (n2[s2] = t2[s2]);
        var s2 = arguments.length - 2;
        if (1 === s2) n2.children = r2;
        else if (1 < s2) {
          for (var o2 = Array(s2), l2 = 0; l2 < s2; l2++) o2[l2] = arguments[l2 + 2];
          n2.children = o2;
        }
        return _(e2.type, a2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, i2 = {}, a2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (a2 = "" + t2.key), t2) w.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (i2[n2] = t2[n2]);
        var s2 = arguments.length - 2;
        if (1 === s2) i2.children = r2;
        else if (1 < s2) {
          for (var o2 = Array(s2), l2 = 0; l2 < s2; l2++) o2[l2] = arguments[l2 + 2];
          i2.children = o2;
        }
        if (e2 && e2.defaultProps) for (n2 in s2 = e2.defaultProps) void 0 === i2[n2] && (i2[n2] = s2[n2]);
        return _(e2, a2, i2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: d, render: e2 };
      }, r.isValidElement = x, r.lazy = function(e2) {
        return { $$typeof: g, _payload: { _status: -1, _result: e2 }, _init: T };
      }, r.memo = function(e2, t2) {
        return { $$typeof: f, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.3.0-canary-3f0b9e61-20260317";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(8946);
    }, 7754, 46478, 9939, 25753, 38174, 53835, 18368, 63072, 51564, 16852, 75982, (e) => {
      "use strict";
      var t, r, n = e.i(90044);
      let i = (0, n.createAsyncLocalStorage)();
      e.s(["workAsyncStorageInstance", 0, i], 46478), e.s([], 7754);
      let a = (0, n.createAsyncLocalStorage)();
      e.s(["workUnitAsyncStorageInstance", 0, a], 9939), e.s(["InvariantError", 0, class extends Error {
        constructor(e2, t2) {
          super(`Invariant: ${e2.endsWith(".") ? e2 : e2 + "."} This is a bug in Next.js.`, t2), this.name = "InvariantError";
        }
      }], 25753);
      var s = ((t = {})[t.Before = 1] = "Before", t[t.EarlyStatic = 2] = "EarlyStatic", t[t.Static = 3] = "Static", t[t.EarlyRuntime = 4] = "EarlyRuntime", t[t.Runtime = 5] = "Runtime", t[t.Dynamic = 6] = "Dynamic", t[t.Abandoned = 7] = "Abandoned", t);
      e.s(["RenderStage", 0, s], 38174), e.s(["getPrerenderResumeDataCache", 0, function(e2) {
        switch (e2.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
          case "prerender-client":
          case "validation-client":
            return e2.prerenderResumeDataCache;
          case "request":
            if (e2.prerenderResumeDataCache) return e2.prerenderResumeDataCache;
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return e2;
        }
      }, "getRenderResumeDataCache", 0, function(e2) {
        switch (e2.type) {
          case "request":
          case "prerender":
          case "prerender-runtime":
          case "prerender-client":
          case "validation-client":
            if (e2.renderResumeDataCache) return e2.renderResumeDataCache;
          case "prerender-ppr":
            return e2.prerenderResumeDataCache ?? null;
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-legacy":
          case "generate-static-params":
            return null;
          default:
            return e2;
        }
      }, "isInEarlyRenderStage", 0, function(e2) {
        let t2 = e2.stagedRendering;
        return !!t2 && (t2.currentStage === s.EarlyStatic || t2.currentStage === s.EarlyRuntime);
      }, "throwForMissingRequestStore", 0, function(e2) {
        throw Object.defineProperty(Error(`\`${e2}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E251", enumerable: false, configurable: true });
      }], 53835);
      var o = e.i(40049);
      let l = "DYNAMIC_SERVER_USAGE";
      class c extends Error {
        constructor(e2) {
          super(`Dynamic server usage: ${e2}`), this.description = e2, this.digest = l;
        }
      }
      e.s(["DynamicServerError", 0, c, "isDynamicServerError", 0, function(e2) {
        return "object" == typeof e2 && null !== e2 && "digest" in e2 && "string" == typeof e2.digest && e2.digest === l;
      }], 18368);
      let u = "function" == typeof o.default.unstable_postpone;
      function h(e2, t2) {
        return `Route ${e2} needs to bail out of prerendering at this point because it used ${t2}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      function d(e2) {
        return e2.includes("needs to bail out of prerendering at this point because it used") && e2.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }
      if (false === d(h("%%%", "^^^"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      let p = "NEXT_PRERENDER_INTERRUPTED";
      function f(e2) {
        let t2 = Object.defineProperty(Error(e2), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        return t2.digest = p, t2;
      }
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]"), e.s(["abortAndThrowOnSynchronousRequestDataAccess", 0, function(e2, t2, r2, n2) {
        if (false === n2.controller.signal.aborted) {
          let i2, a2;
          i2 = f(`Route ${e2} needs to bail out of prerendering at this point because it used ${t2}.`), n2.controller.abort(i2), (a2 = n2.dynamicTracking) && a2.dynamicAccesses.push({ stack: a2.isDebugDynamicAccesses ? Error().stack : void 0, expression: t2 });
          let s2 = n2.dynamicTracking;
          s2 && null === s2.syncDynamicErrorWithStack && (s2.syncDynamicErrorWithStack = r2);
        }
        throw f(`Route ${e2} needs to bail out of prerendering at this point because it used ${t2}.`);
      }, "isDynamicPostpone", 0, function(e2) {
        return "object" == typeof e2 && null !== e2 && "string" == typeof e2.message && d(e2.message);
      }, "isPrerenderInterruptedError", 0, function(e2) {
        return "object" == typeof e2 && null !== e2 && e2.digest === p && "name" in e2 && "message" in e2 && e2 instanceof Error;
      }, "postponeWithTracking", 0, function(e2, t2, r2) {
        (function() {
          if (!u) throw Object.defineProperty(Error("Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E224", enumerable: false, configurable: true });
        })(), r2 && r2.dynamicAccesses.push({ stack: r2.isDebugDynamicAccesses ? Error().stack : void 0, expression: t2 }), o.default.unstable_postpone(h(e2, t2));
      }, "throwToInterruptStaticGeneration", 0, function(e2, t2, r2) {
        let n2 = Object.defineProperty(new c(`Route ${t2.route} couldn't be rendered statically because it used \`${e2}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", { value: "E558", enumerable: false, configurable: true });
        throw r2.revalidate = 0, t2.dynamicUsageDescription = e2, t2.dynamicUsageStack = n2.stack, n2;
      }, "trackDynamicDataInDynamicRender", 0, function(e2) {
        switch (e2.type) {
          case "cache":
          case "unstable-cache":
          case "private-cache":
            return;
        }
      }], 63072);
      let g = "HANGING_PROMISE_REJECTION";
      class m extends Error {
        constructor(e2, t2) {
          super(`During prerendering, ${t2} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${t2} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${e2}".`), this.route = e2, this.expression = t2, this.digest = g;
        }
      }
      let y = /* @__PURE__ */ new WeakMap();
      function b() {
      }
      e.s(["delayUntilRuntimeStage", 0, function(e2, t2) {
        let { stagedRendering: r2 } = e2;
        return r2 ? r2.waitForStage(r2.currentStage === s.EarlyStatic || r2.currentStage === s.EarlyRuntime ? s.EarlyRuntime : s.Runtime).then(() => t2) : t2;
      }, "isHangingPromiseRejectionError", 0, function(e2) {
        return "object" == typeof e2 && null !== e2 && "digest" in e2 && e2.digest === g;
      }, "makeDevtoolsIOAwarePromise", 0, function(e2, t2, r2) {
        return t2.stagedRendering ? t2.stagedRendering.delayUntilStage(r2, void 0, e2) : new Promise((t3) => {
          setTimeout(() => {
            t3(e2);
          }, 0);
        });
      }, "makeHangingPromise", 0, function(e2, t2, r2) {
        if (e2.aborted) return Promise.reject(new m(t2, r2));
        {
          let n2 = new Promise((n3, i2) => {
            let a2 = i2.bind(null, new m(t2, r2)), s2 = y.get(e2);
            if (s2) s2.push(a2);
            else {
              let t3 = [a2];
              y.set(e2, t3), e2.addEventListener("abort", () => {
                for (let e3 = 0; e3 < t3.length; e3++) t3[e3]();
              }, { once: true });
            }
          });
          return n2.catch(b), n2;
        }
      }], 51564);
      var w = ((r = {})[r.SeeOther = 303] = "SeeOther", r[r.TemporaryRedirect = 307] = "TemporaryRedirect", r[r.PermanentRedirect = 308] = "PermanentRedirect", r);
      e.s(["RedirectStatusCode", 0, w], 16852);
      let v = "NEXT_REDIRECT";
      e.s(["REDIRECT_ERROR_CODE", 0, v, "isRedirectError", 0, function(e2) {
        if ("object" != typeof e2 || null === e2 || !("digest" in e2) || "string" != typeof e2.digest) return false;
        let t2 = e2.digest.split(";"), [r2, n2] = t2, i2 = t2.slice(2, -2).join(";"), a2 = Number(t2.at(-2));
        return r2 === v && ("replace" === n2 || "push" === n2) && "string" == typeof i2 && !isNaN(a2) && a2 in w;
      }], 75982);
    }, 91375, (e) => {
      "use strict";
      let t = (0, e.i(90044).createAsyncLocalStorage)();
      e.s([], 92999), e.i(92999), e.s(["actionAsyncStorage", 0, t], 91375);
    }, 82748, (e) => {
      "use strict";
      var t = e.i(51564);
      let r = Symbol.for("react.postpone"), n = new Set(Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 }));
      var i = e.i(75982), a = e.i(63072), s = e.i(18368);
      e.s(["unstable_rethrow", 0, function e2(o) {
        if ((0, i.isRedirectError)(o) || function(e3) {
          if ("object" != typeof e3 || null === e3 || !("digest" in e3) || "string" != typeof e3.digest) return false;
          let [t2, r2] = e3.digest.split(";");
          return "NEXT_HTTP_ERROR_FALLBACK" === t2 && n.has(Number(r2));
        }(o) || "object" == typeof o && null !== o && "digest" in o && "BAILOUT_TO_CLIENT_SIDE_RENDERING" === o.digest || (0, s.isDynamicServerError)(o) || (0, a.isDynamicPostpone)(o) || "object" == typeof o && null !== o && o.$$typeof === r || (0, t.isHangingPromiseRejectionError)(o) || (0, a.isPrerenderInterruptedError)(o)) throw o;
        o instanceof Error && "cause" in o && e2(o.cause);
      }], 82748);
    }, 90894, (e, t, r) => {
      e.n(__import_unsupported("crypto"));
    }, 42738, (e) => {
      "use strict";
      let t, r, n, i, a, s, o, l, c, u, h;
      async function d() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      e.i(74398);
      let p = null;
      async function f() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        p || (p = d());
        let e10 = await p;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function g(...e10) {
        let t10 = await d();
        try {
          var r10;
          await (null == t10 || null == (r10 = t10.onRequestError) ? void 0 : r10.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let m = null;
      function y() {
        return m || (m = f()), m;
      }
      function b(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t10 = new Proxy(function() {
          }, { get(t11, r10) {
            if ("then" === r10) return {};
            throw Object.defineProperty(Error(b(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(b(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r10, n10, i10) {
            if ("function" == typeof i10[0]) return i10[0](t10);
            throw Object.defineProperty(Error(b(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      y();
      class w extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class v extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  ");
        }
      }
      class _ extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  ");
        }
      }
      let x = "x-prerender-revalidate", E = ".meta", k = "x-next-cache-tags", S = "x-next-revalidated-tags", T = "_N_T_", A = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function R(e10) {
        var t10, r10, n10, i10, a10, s10 = [], o10 = 0;
        function l10() {
          for (; o10 < e10.length && /\s/.test(e10.charAt(o10)); ) o10 += 1;
          return o10 < e10.length;
        }
        for (; o10 < e10.length; ) {
          for (t10 = o10, a10 = false; l10(); ) if ("," === (r10 = e10.charAt(o10))) {
            for (n10 = o10, o10 += 1, l10(), i10 = o10; o10 < e10.length && "=" !== (r10 = e10.charAt(o10)) && ";" !== r10 && "," !== r10; ) o10 += 1;
            o10 < e10.length && "=" === e10.charAt(o10) ? (a10 = true, o10 = i10, s10.push(e10.substring(t10, n10)), t10 = o10) : o10 = n10 + 1;
          } else o10 += 1;
          (!a10 || o10 >= e10.length) && s10.push(e10.substring(t10, e10.length));
        }
        return s10;
      }
      function C(e10) {
        let t10 = {}, r10 = [];
        if (e10) for (let [n10, i10] of e10.entries()) "set-cookie" === n10.toLowerCase() ? (r10.push(...R(i10)), t10[n10] = 1 === r10.length ? r10[0] : r10) : t10[n10] = i10;
        return t10;
      }
      function O(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...A, GROUP: { builtinReact: [A.reactServerComponents, A.actionBrowser], serverOnly: [A.reactServerComponents, A.actionBrowser, A.instrument, A.middleware], neutralTarget: [A.apiNode, A.apiEdge], clientOnly: [A.serverSideRendering, A.appPagesBrowser], bundled: [A.reactServerComponents, A.actionBrowser, A.serverSideRendering, A.appPagesBrowser, A.shared, A.instrument, A.middleware], appPages: [A.reactServerComponents, A.serverSideRendering, A.appPagesBrowser, A.actionBrowser] } });
      let P = Symbol("response"), I = Symbol("passThrough"), j = Symbol("waitUntil");
      class $ {
        constructor(e10, t10) {
          this[I] = false, this[j] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[P] || (this[P] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[I] = true;
        }
        waitUntil(e10) {
          if ("external" === this[j].kind) return (0, this[j].function)(e10);
          this[j].promises.push(e10);
        }
      }
      class N extends $ {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function U(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function D(e10) {
        let t10 = e10.indexOf("#"), r10 = e10.indexOf("?"), n10 = r10 > -1 && (t10 < 0 || r10 < t10);
        return n10 || t10 > -1 ? { pathname: e10.substring(0, n10 ? r10 : t10), query: n10 ? e10.substring(r10, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function L(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: i10 } = D(e10);
        return `${t10}${r10}${n10}${i10}`;
      }
      function M(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: i10 } = D(e10);
        return `${r10}${t10}${n10}${i10}`;
      }
      function H(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r10 } = D(e10);
        return r10 === t10 || r10.startsWith(t10 + "/");
      }
      let B = /* @__PURE__ */ new WeakMap();
      function W(e10, t10) {
        let r10;
        if (!t10) return { pathname: e10 };
        let n10 = B.get(t10);
        n10 || (n10 = t10.map((e11) => e11.toLowerCase()), B.set(t10, n10));
        let i10 = e10.split("/", 2);
        if (!i10[1]) return { pathname: e10 };
        let a10 = i10[1].toLowerCase(), s10 = n10.indexOf(a10);
        return s10 < 0 ? { pathname: e10 } : (r10 = t10[s10], { pathname: e10 = e10.slice(r10.length + 1) || "/", detectedLocale: r10 });
      }
      let q = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function K(e10, t10) {
        let r10 = new URL(String(e10), t10 && String(t10));
        return q.test(r10.hostname) && (r10.hostname = "localhost"), r10;
      }
      let J = Symbol("NextURLInternal");
      class F {
        constructor(e10, t10, r10) {
          let n10, i10;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (n10 = t10, i10 = r10 || {}) : i10 = r10 || t10 || {}, this[J] = { url: K(e10, n10 ?? i10.base), options: i10, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r10, n10, i10;
          let a10 = function(e11, t11) {
            let { basePath: r11, i18n: n11, trailingSlash: i11 } = t11.nextConfig ?? {}, a11 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : i11 };
            r11 && H(a11.pathname, r11) && (a11.pathname = function(e12, t12) {
              if (!H(e12, t12)) return e12;
              let r12 = e12.slice(t12.length);
              return r12.startsWith("/") ? r12 : `/${r12}`;
            }(a11.pathname, r11), a11.basePath = r11);
            let s11 = a11.pathname;
            if (a11.pathname.startsWith("/_next/data/") && a11.pathname.endsWith(".json")) {
              let e12 = a11.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              a11.buildId = e12[0], s11 = "index" !== e12[1] ? `/${e12.slice(1).join("/")}` : "/", true === t11.parseData && (a11.pathname = s11);
            }
            if (n11) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(a11.pathname) : W(a11.pathname, n11.locales);
              a11.locale = e12.detectedLocale, a11.pathname = e12.pathname ?? a11.pathname, !e12.detectedLocale && a11.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(s11) : W(s11, n11.locales)).detectedLocale && (a11.locale = e12.detectedLocale);
            }
            return a11;
          }(this[J].url.pathname, { nextConfig: this[J].options.nextConfig, parseData: true, i18nProvider: this[J].options.i18nProvider }), s10 = function(e11, t11) {
            let r11;
            if (t11?.host && !Array.isArray(t11.host)) r11 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r11 = e11.hostname;
            }
            return r11.toLowerCase();
          }(this[J].url, this[J].options.headers);
          this[J].domainLocale = this[J].options.i18nProvider ? this[J].options.i18nProvider.detectDomainLocale(s10) : function(e11, t11, r11) {
            if (e11) {
              for (let n11 of (r11 && (r11 = r11.toLowerCase()), e11)) if (t11 === n11.domain?.split(":", 1)[0].toLowerCase() || r11 === n11.defaultLocale.toLowerCase() || n11.locales?.some((e12) => e12.toLowerCase() === r11)) return n11;
            }
          }(null == (t10 = this[J].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, s10);
          let o10 = (null == (r10 = this[J].domainLocale) ? void 0 : r10.defaultLocale) || (null == (i10 = this[J].options.nextConfig) || null == (n10 = i10.i18n) ? void 0 : n10.defaultLocale);
          this[J].url.pathname = a10.pathname, this[J].defaultLocale = o10, this[J].basePath = a10.basePath ?? "", this[J].buildId = a10.buildId, this[J].locale = a10.locale ?? o10, this[J].trailingSlash = a10.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r10, n10) {
            if (!t11 || t11 === r10) return e11;
            let i10 = e11.toLowerCase();
            return !n10 && (H(i10, "/api") || H(i10, `/${t11.toLowerCase()}`)) ? e11 : L(e11, `/${t11}`);
          }((e10 = { basePath: this[J].basePath, buildId: this[J].buildId, defaultLocale: this[J].options.forceLocale ? void 0 : this[J].defaultLocale, locale: this[J].locale, pathname: this[J].url.pathname, trailingSlash: this[J].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = U(t10)), e10.buildId && (t10 = M(L(t10, `/_next/data/${e10.buildId}`), "/" === e10.pathname ? "index.json" : ".json")), t10 = L(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : M(t10, "/") : U(t10);
        }
        formatSearch() {
          return this[J].url.search;
        }
        get buildId() {
          return this[J].buildId;
        }
        set buildId(e10) {
          this[J].buildId = e10;
        }
        get locale() {
          return this[J].locale ?? "";
        }
        set locale(e10) {
          var t10, r10;
          if (!this[J].locale || !(null == (r10 = this[J].options.nextConfig) || null == (t10 = r10.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[J].locale = e10;
        }
        get defaultLocale() {
          return this[J].defaultLocale;
        }
        get domainLocale() {
          return this[J].domainLocale;
        }
        get searchParams() {
          return this[J].url.searchParams;
        }
        get host() {
          return this[J].url.host;
        }
        set host(e10) {
          this[J].url.host = e10;
        }
        get hostname() {
          return this[J].url.hostname;
        }
        set hostname(e10) {
          this[J].url.hostname = e10;
        }
        get port() {
          return this[J].url.port;
        }
        set port(e10) {
          this[J].url.port = e10;
        }
        get protocol() {
          return this[J].url.protocol;
        }
        set protocol(e10) {
          this[J].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[J].url = K(e10), this.analyze();
        }
        get origin() {
          return this[J].url.origin;
        }
        get pathname() {
          return this[J].url.pathname;
        }
        set pathname(e10) {
          this[J].url.pathname = e10;
        }
        get hash() {
          return this[J].url.hash;
        }
        set hash(e10) {
          this[J].url.hash = e10;
        }
        get search() {
          return this[J].url.search;
        }
        set search(e10) {
          this[J].url.search = e10;
        }
        get password() {
          return this[J].url.password;
        }
        set password(e10) {
          this[J].url.password = e10;
        }
        get username() {
          return this[J].url.username;
        }
        set username(e10) {
          this[J].url.username = e10;
        }
        get basePath() {
          return this[J].basePath;
        }
        set basePath(e10) {
          this[J].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new F(String(this), this[J].options);
        }
      }
      var z, V, G, X, Y, Z, Q, ee, et, er, en, ei, ea, es, eo = e.i(28042);
      let el = Symbol("internal request");
      class ec extends Request {
        constructor(e10, t10 = {}) {
          const r10 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          O(r10), e10 instanceof Request ? super(e10, t10) : super(r10, t10);
          const n10 = new F(r10, { headers: C(this.headers), nextConfig: t10.nextConfig });
          this[el] = { cookies: new eo.RequestCookies(this.headers), nextUrl: n10, url: n10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[el].cookies;
        }
        get nextUrl() {
          return this[el].nextUrl;
        }
        get page() {
          throw new v();
        }
        get ua() {
          throw new _();
        }
        get url() {
          return this[el].url;
        }
      }
      class eu {
        static get(e10, t10, r10) {
          let n10 = Reflect.get(e10, t10, r10);
          return "function" == typeof n10 ? n10.bind(e10) : n10;
        }
        static set(e10, t10, r10, n10) {
          return Reflect.set(e10, t10, r10, n10);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let eh = Symbol("internal response"), ed = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function ep(e10, t10) {
        var r10;
        if (null == e10 || null == (r10 = e10.request) ? void 0 : r10.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r11 = [];
          for (let [n10, i10] of e10.request.headers) t10.set("x-middleware-request-" + n10, i10), r11.push(n10);
          t10.set("x-middleware-override-headers", r11.join(","));
        }
      }
      class ef extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          const r10 = this.headers, n10 = new Proxy(new eo.ResponseCookies(r10), { get(e11, n11, i10) {
            switch (n11) {
              case "delete":
              case "set":
                return (...i11) => {
                  let a10 = Reflect.apply(e11[n11], e11, i11), s10 = new Headers(r10);
                  return a10 instanceof eo.ResponseCookies && r10.set("x-middleware-set-cookie", a10.getAll().map((e12) => (0, eo.stringifyCookie)(e12)).join(",")), ep(t10, s10), a10;
                };
              default:
                return eu.get(e11, n11, i10);
            }
          } });
          this[eh] = { cookies: n10, url: t10.url ? new F(t10.url, { headers: C(r10), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[eh].cookies;
        }
        static json(e10, t10) {
          let r10 = Response.json(e10, t10);
          return new ef(r10.body, r10);
        }
        static redirect(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!ed.has(r10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n10 = "object" == typeof t10 ? t10 : {}, i10 = new Headers(null == n10 ? void 0 : n10.headers);
          return i10.set("Location", O(e10)), new ef(null, { ...n10, headers: i10, status: r10 });
        }
        static rewrite(e10, t10) {
          let r10 = new Headers(null == t10 ? void 0 : t10.headers);
          return r10.set("x-middleware-rewrite", O(e10)), ep(t10, r10), new ef(null, { ...t10, headers: r10 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), ep(e10, t10), new ef(null, { ...e10, headers: t10 });
        }
      }
      function eg(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, n10 = new URL(e10, t10), i10 = n10.origin === r10.origin;
        return { url: i10 ? n10.toString().slice(r10.origin.length) : n10.toString(), isRelative: i10 };
      }
      let em = "next-router-prefetch", ey = ["rsc", "next-router-state-tree", em, "next-hmr-refresh", "next-router-segment-prefetch"], eb = "_rsc";
      function ew(e10) {
        return e10.startsWith("/") ? e10 : `/${e10}`;
      }
      function ev(e10) {
        return ew(e10.split("/").reduce((e11, t10, r10, n10) => t10 ? "(" === t10[0] && t10.endsWith(")") || "@" === t10[0] || ("page" === t10 || "route" === t10) && r10 === n10.length - 1 ? e11 : `${e11}/${t10}` : e11, ""));
      }
      class e_ extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new e_();
        }
      }
      class ex extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, n10) {
            if ("symbol" == typeof r10) return eu.get(t10, r10, n10);
            let i10 = r10.toLowerCase(), a10 = Object.keys(e10).find((e11) => e11.toLowerCase() === i10);
            if (void 0 !== a10) return eu.get(t10, a10, n10);
          }, set(t10, r10, n10, i10) {
            if ("symbol" == typeof r10) return eu.set(t10, r10, n10, i10);
            let a10 = r10.toLowerCase(), s10 = Object.keys(e10).find((e11) => e11.toLowerCase() === a10);
            return eu.set(t10, s10 ?? r10, n10, i10);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return eu.has(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 !== i10 && eu.has(t10, i10);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return eu.deleteProperty(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 === i10 || eu.deleteProperty(t10, i10);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return e_.callable;
              default:
                return eu.get(e11, t10, r10);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new ex(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, n10] of this.entries()) e10.call(t10, n10, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      e.i(7754);
      var eE = e.i(46478), eE = eE;
      class ek extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new ek();
        }
      }
      class eS {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return ek.callable;
              default:
                return eu.get(e11, t10, r10);
            }
          } });
        }
      }
      let eT = Symbol.for("next.mutated.cookies");
      class eA {
        static wrap(e10, t10) {
          let r10 = new eo.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let n10 = [], i10 = /* @__PURE__ */ new Set(), a10 = () => {
            let e11 = eE.workAsyncStorageInstance.getStore();
            if (e11 && (e11.pathWasRevalidated = 1), n10 = r10.getAll().filter((e12) => i10.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n10) {
                let r11 = new eo.ResponseCookies(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          }, s10 = new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case eT:
                return n10;
              case "delete":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), s10;
                  } finally {
                    a10();
                  }
                };
              case "set":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), s10;
                  } finally {
                    a10();
                  }
                };
              default:
                return eu.get(e11, t11, r11);
            }
          } });
          return s10;
        }
      }
      function eR(e10) {
        return "action" === e10.phase;
      }
      function eC(e10, t10) {
        if (!eR(e10)) throw new ek();
      }
      var eO = ((ad = eO || {}).handleRequest = "BaseServer.handleRequest", ad.run = "BaseServer.run", ad.pipe = "BaseServer.pipe", ad.getStaticHTML = "BaseServer.getStaticHTML", ad.render = "BaseServer.render", ad.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", ad.renderToResponse = "BaseServer.renderToResponse", ad.renderToHTML = "BaseServer.renderToHTML", ad.renderError = "BaseServer.renderError", ad.renderErrorToResponse = "BaseServer.renderErrorToResponse", ad.renderErrorToHTML = "BaseServer.renderErrorToHTML", ad.render404 = "BaseServer.render404", ad), eP = ((ap = eP || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", ap.loadComponents = "LoadComponents.loadComponents", ap), eI = ((af = eI || {}).getRequestHandler = "NextServer.getRequestHandler", af.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", af.getServer = "NextServer.getServer", af.getServerRequestHandler = "NextServer.getServerRequestHandler", af.createServer = "createServer.createServer", af), ej = ((ag = ej || {}).compression = "NextNodeServer.compression", ag.getBuildId = "NextNodeServer.getBuildId", ag.createComponentTree = "NextNodeServer.createComponentTree", ag.clientComponentLoading = "NextNodeServer.clientComponentLoading", ag.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", ag.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", ag.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", ag.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", ag.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", ag.sendRenderResult = "NextNodeServer.sendRenderResult", ag.proxyRequest = "NextNodeServer.proxyRequest", ag.runApi = "NextNodeServer.runApi", ag.render = "NextNodeServer.render", ag.renderHTML = "NextNodeServer.renderHTML", ag.imageOptimizer = "NextNodeServer.imageOptimizer", ag.getPagePath = "NextNodeServer.getPagePath", ag.getRoutesManifest = "NextNodeServer.getRoutesManifest", ag.findPageComponents = "NextNodeServer.findPageComponents", ag.getFontManifest = "NextNodeServer.getFontManifest", ag.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", ag.getRequestHandler = "NextNodeServer.getRequestHandler", ag.renderToHTML = "NextNodeServer.renderToHTML", ag.renderError = "NextNodeServer.renderError", ag.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", ag.render404 = "NextNodeServer.render404", ag.startResponse = "NextNodeServer.startResponse", ag.route = "route", ag.onProxyReq = "onProxyReq", ag.apiResolver = "apiResolver", ag.internalFetch = "internalFetch", ag), e$ = ((am = e$ || {}).startServer = "startServer.startServer", am), eN = ((ay = eN || {}).getServerSideProps = "Render.getServerSideProps", ay.getStaticProps = "Render.getStaticProps", ay.renderToString = "Render.renderToString", ay.renderDocument = "Render.renderDocument", ay.createBodyResult = "Render.createBodyResult", ay), eU = ((ab = eU || {}).renderToString = "AppRender.renderToString", ab.renderToReadableStream = "AppRender.renderToReadableStream", ab.getBodyResult = "AppRender.getBodyResult", ab.fetch = "AppRender.fetch", ab), eD = ((aw = eD || {}).executeRoute = "Router.executeRoute", aw), eL = ((av = eL || {}).runHandler = "Node.runHandler", av), eM = ((a_ = eM || {}).runHandler = "AppRouteRouteHandlers.runHandler", a_), eH = ((ax = eH || {}).generateMetadata = "ResolveMetadata.generateMetadata", ax.generateViewport = "ResolveMetadata.generateViewport", ax), eB = ((aE = eB || {}).execute = "Middleware.execute", aE);
      let eW = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), eq = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function eK(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let eJ = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: eF, propagation: ez, trace: eV, SpanStatusCode: eG, SpanKind: eX, ROOT_CONTEXT: eY } = t = e.r(59110);
      class eZ extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let eQ = (e10, t10) => {
        "object" == typeof t10 && null !== t10 && t10 instanceof eZ && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && (e10.recordException(t10), e10.setAttribute("error.type", t10.name)), e10.setStatus({ code: eG.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, e0 = /* @__PURE__ */ new Map(), e1 = t.createContextKey("next.rootSpanId"), e2 = 0, e5 = { set(e10, t10, r10) {
        e10.push({ key: t10, value: r10 });
      } }, e6 = (u = new class e {
        getTracerInstance() {
          return eV.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return eF;
        }
        getTracePropagationData() {
          let e10 = eF.active(), t10 = [];
          return ez.inject(e10, t10, e5), t10;
        }
        getActiveScopeSpan() {
          return eV.getSpan(null == eF ? void 0 : eF.active());
        }
        withPropagatedContext(e10, t10, r10, n10 = false) {
          let i10 = eF.active();
          if (n10) {
            let n11 = ez.extract(eY, e10, r10);
            if (eV.getSpanContext(n11)) return eF.with(n11, t10);
            let a11 = ez.extract(i10, e10, r10);
            return eF.with(a11, t10);
          }
          if (eV.getSpanContext(i10)) return t10();
          let a10 = ez.extract(i10, e10, r10);
          return eF.with(a10, t10);
        }
        trace(...e10) {
          let [t10, r10, n10] = e10, { fn: i10, options: a10 } = "function" == typeof r10 ? { fn: r10, options: {} } : { fn: n10, options: { ...r10 } }, s10 = a10.spanName ?? t10;
          if (!eW.has(t10) && "1" !== process.env.NEXT_OTEL_VERBOSE || a10.hideSpan) return i10();
          let o10 = this.getSpanContext((null == a10 ? void 0 : a10.parentSpan) ?? this.getActiveScopeSpan());
          o10 || (o10 = (null == eF ? void 0 : eF.active()) ?? eY);
          let l10 = o10.getValue(e1), c10 = "number" != typeof l10 || !e0.has(l10), u10 = e2++;
          return a10.attributes = { "next.span_name": s10, "next.span_type": t10, ...a10.attributes }, eF.with(o10.setValue(e1, u10), () => this.getTracerInstance().startActiveSpan(s10, a10, (e11) => {
            let r11;
            eJ && t10 && eq.has(t10) && (r11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n11 = false, s11 = () => {
              !n11 && (n11 = true, e0.delete(u10), r11 && performance.measure(`${eJ}:next-${(t10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: r11, end: performance.now() }));
            };
            if (c10 && e0.set(u10, new Map(Object.entries(a10.attributes ?? {}))), i10.length > 1) try {
              return i10(e11, (t11) => eQ(e11, t11));
            } catch (t11) {
              throw eQ(e11, t11), t11;
            } finally {
              s11();
            }
            try {
              let t11 = i10(e11);
              if (eK(t11)) return t11.then((t12) => (e11.end(), t12)).catch((t12) => {
                throw eQ(e11, t12), t12;
              }).finally(s11);
              return e11.end(), s11(), t11;
            } catch (t11) {
              throw eQ(e11, t11), s11(), t11;
            }
          }));
        }
        wrap(...e10) {
          let t10 = this, [r10, n10, i10] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eW.has(r10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n10;
            "function" == typeof e11 && "function" == typeof i10 && (e11 = e11.apply(this, arguments));
            let a10 = arguments.length - 1, s10 = arguments[a10];
            if ("function" != typeof s10) return t10.trace(r10, e11, () => i10.apply(this, arguments));
            {
              let n11 = t10.getContext().bind(eF.active(), s10);
              return t10.trace(r10, e11, (e12, t11) => (arguments[a10] = function(e13) {
                return null == t11 || t11(e13), n11.apply(this, arguments);
              }, i10.apply(this, arguments)));
            }
          } : i10;
        }
        startSpan(...e10) {
          let [t10, r10] = e10, n10 = this.getSpanContext((null == r10 ? void 0 : r10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t10, r10, n10);
        }
        getSpanContext(e10) {
          return e10 ? eV.setSpan(eF.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = eF.active().getValue(e1);
          return e0.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r10 = eF.active().getValue(e1), n10 = e0.get(r10);
          n10 && !n10.has(e10) && n10.set(e10, t10);
        }
        withSpan(e10, t10) {
          let r10 = eV.setSpan(eF.active(), e10);
          return eF.with(r10, t10);
        }
      }(), () => u), e3 = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(e3);
      class e4 {
        constructor(e10, t10, r10, n10) {
          var i10;
          const a10 = e10 && function(e11, t11) {
            let r11 = ex.from(e11.headers);
            return { isOnDemandRevalidate: r11.get(x) === t11.previewModeId, revalidateOnlyGenerated: r11.has("x-prerender-revalidate-if-generated") };
          }(t10, e10).isOnDemandRevalidate, s10 = null == (i10 = r10.get(e3)) ? void 0 : i10.value;
          this._isEnabled = !!(!a10 && s10 && e10 && s10 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: e3, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: e3, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function e8(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r10 = e10.headers["x-middleware-set-cookie"], n10 = new Headers();
          for (let e11 of R(r10)) n10.append("set-cookie", e11);
          for (let e11 of new eo.ResponseCookies(n10).getAll()) t10.set(e11);
        }
      }
      var e9 = e.i(53835), e7 = e.i(9939), e7 = e7, te = e.i(99734), tt = e.i(25753), eE = eE, tr = e.i(51615);
      process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let tn = Symbol.for("@next/cache-handlers-map"), ti = Symbol.for("@next/cache-handlers-set"), ta = globalThis;
      function ts() {
        if (ta[tn]) return ta[tn].entries();
      }
      async function to(e10, t10) {
        if (!e10) return t10();
        let r10 = tl(e10);
        try {
          return await t10();
        } finally {
          var n10, i10, a10, s10;
          let t11, o10, l10, c10, u10 = (n10 = r10, i10 = tl(e10), t11 = new Set(n10.pendingRevalidatedTags.map((e11) => {
            let t12 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return `${e11.tag}:${t12}`;
          })), o10 = new Set(n10.pendingRevalidateWrites), { pendingRevalidatedTags: i10.pendingRevalidatedTags.filter((e11) => {
            let r11 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return !t11.has(`${e11.tag}:${r11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(i10.pendingRevalidates).filter(([e11]) => !(e11 in n10.pendingRevalidates))), pendingRevalidateWrites: i10.pendingRevalidateWrites.filter((e11) => !o10.has(e11)) });
          await (a10 = e10, l10 = [], (c10 = (null == (s10 = u10) ? void 0 : s10.pendingRevalidatedTags) ?? a10.pendingRevalidatedTags ?? []).length > 0 && l10.push(tc(c10, a10.incrementalCache, a10)), l10.push(...Object.values((null == s10 ? void 0 : s10.pendingRevalidates) ?? a10.pendingRevalidates ?? {})), l10.push(...(null == s10 ? void 0 : s10.pendingRevalidateWrites) ?? a10.pendingRevalidateWrites ?? []), 0 !== l10.length && Promise.all(l10).then(() => void 0));
        }
      }
      function tl(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function tc(e10, t10, r10) {
        if (0 === e10.length) return;
        let n10 = function() {
          if (ta[ti]) return ta[ti].values();
        }(), i10 = [], a10 = /* @__PURE__ */ new Map();
        for (let t11 of e10) {
          let e11, r11 = t11.profile;
          for (let [t12] of a10) if ("string" == typeof t12 && "string" == typeof r11 && t12 === r11 || "object" == typeof t12 && "object" == typeof r11 && JSON.stringify(t12) === JSON.stringify(r11) || t12 === r11) {
            e11 = t12;
            break;
          }
          let n11 = e11 || r11;
          a10.has(n11) || a10.set(n11, []), a10.get(n11).push(t11.tag);
        }
        for (let [e11, o10] of a10) {
          let a11;
          if (e11) {
            let t11;
            if ("object" == typeof e11) t11 = e11;
            else if ("string" == typeof e11) {
              var s10;
              if (!(t11 = null == r10 || null == (s10 = r10.cacheLifeProfiles) ? void 0 : s10[e11])) throw Object.defineProperty(Error(`Invalid profile provided "${e11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            t11 && (a11 = { expire: t11.expire });
          }
          for (let t11 of n10 || []) e11 ? i10.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o10, a11)) : i10.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o10));
          t10 && i10.push(t10.revalidateTag(o10, a11));
        }
        await Promise.all(i10);
      }
      var tu = e.i(90044), e7 = e7;
      let th = (0, tu.createAsyncLocalStorage)();
      class td {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r10, this.callbackQueue = new te.default(), this.callbackQueue.pause();
        }
        after(e10) {
          if (eK(e10)) this.waitUntil || tp(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          this.waitUntil || tp();
          let t10 = e7.workUnitAsyncStorageInstance.getStore();
          t10 && this.workUnitStores.add(t10);
          let r10 = th.getStore(), n10 = r10 ? r10.rootTaskSpawnPhase : null == t10 ? void 0 : t10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let i10 = (0, tu.bindSnapshot)(async () => {
            try {
              await th.run({ rootTaskSpawnPhase: n10 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          });
          this.callbackQueue.add(i10);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = eE.workAsyncStorageInstance.getStore();
          if (!e10) throw Object.defineProperty(new tt.InvariantError("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return to(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new tt.InvariantError("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function tp() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function tf(e10) {
        let t10, r10 = { then: (n10, i10) => (t10 || (t10 = Promise.resolve(e10())), t10.then((e11) => {
          r10.value = e11;
        }).catch(() => {
        }), t10.then(n10, i10)) };
        return r10;
      }
      var eE = eE;
      class tg {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function tm() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let ty = Symbol.for("@next/request-context"), tb = /[^\t\x20-\x7e]/, tw = /[^\t\x20-\x7e]+/g;
      function tv(e10) {
        return tb.test(e10) ? e10.replace(tw, (e11) => encodeURIComponent(e11)) : e10;
      }
      async function t_(e10, t10, r10) {
        let n10 = /* @__PURE__ */ new Set();
        for (let t11 of ((e11) => {
          let t12 = ["/layout"];
          if (e11.startsWith("/")) {
            let r11 = e11.split("/");
            for (let e12 = 1; e12 < r11.length + 1; e12++) {
              let n11 = r11.slice(0, e12).join("/");
              n11 && (n11.endsWith("/page") || n11.endsWith("/route") || (n11 = `${n11}${!n11.endsWith("/") ? "/" : ""}layout`), t12.push(n11));
            }
          }
          return t12;
        })(e10)) t11 = tv(`${T}${t11}`), n10.add(t11);
        if (t10 && (!r10 || 0 === r10.size)) {
          let e11 = tv(`${T}${t10}`);
          n10.add(e11);
        }
        n10.has(`${T}/`) && n10.add(`${T}/index`), n10.has(`${T}/index`) && n10.add(`${T}/`);
        let i10 = Array.from(n10);
        return { tags: i10, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r11 = ts();
          if (r11) for (let [n11, i11] of r11) "getExpiration" in i11 && t11.set(n11, tf(async () => i11.getExpiration(e11)));
          return t11;
        }(i10) };
      }
      let tx = Symbol.for("NextInternalRequestMeta");
      class tE extends ec {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tk = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, tS = (e10, t10) => e6().withPropagatedContext(e10.headers, t10, tk), tT = false;
      async function tA(t10) {
        var r10, n10, i10, a10, s10;
        let o10, l10, c10, u10, h10;
        !function() {
          if (!tT && (tT = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: t11, wrapRequestHandler: r11 } = e.r(94165);
            t11(), tS = r11(tS);
          }
        }(), await y();
        let d2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t10.request.url = t10.request.url.replace(/\.rsc($|\?)/, "$1");
        let p2 = t10.bypassNextUrl ? new URL(t10.request.url) : new F(t10.request.url, { headers: t10.request.headers, nextConfig: t10.request.nextConfig });
        for (let e10 of [...p2.searchParams.keys()]) {
          let t11 = p2.searchParams.getAll(e10), r11 = function(e11) {
            for (let t12 of ["nxtP", "nxtI"]) if (e11 !== t12 && e11.startsWith(t12)) return e11.substring(t12.length);
            return null;
          }(e10);
          if (r11) {
            for (let e11 of (p2.searchParams.delete(r11), t11)) p2.searchParams.append(r11, e11);
            p2.searchParams.delete(e10);
          }
        }
        let f2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in p2 && (f2 = p2.buildId || "", p2.buildId = "");
        let g2 = function(e10) {
          let t11 = new Headers();
          for (let [r11, n11] of Object.entries(e10)) for (let e11 of Array.isArray(n11) ? n11 : [n11]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t11.append(r11, e11));
          return t11;
        }(t10.request.headers), m2 = g2.has("x-nextjs-data"), b2 = "1" === g2.get("rsc");
        m2 && "/index" === p2.pathname && (p2.pathname = "/");
        let w2 = /* @__PURE__ */ new Map();
        if (!d2) for (let e10 of ey) {
          let t11 = g2.get(e10);
          null !== t11 && (w2.set(e10, t11), g2.delete(e10));
        }
        let v2 = p2.searchParams.get(eb), _2 = new tE({ page: t10.page, input: ((u10 = (c10 = "string" == typeof p2) ? new URL(p2) : p2).searchParams.delete(eb), c10 ? u10.toString() : u10).toString(), init: { body: t10.request.body, headers: g2, method: t10.request.method, nextConfig: t10.request.nextConfig, signal: t10.request.signal } });
        t10.request.requestMeta && (s10 = t10.request.requestMeta, _2[tx] = s10), m2 && Object.defineProperty(_2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t10.IncrementalCache && (globalThis.__incrementalCache = new t10.IncrementalCache({ CurCacheHandler: t10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: tm() }) }));
        let x2 = t10.request.waitUntil ?? (null == (r10 = null == (h10 = globalThis[ty]) ? void 0 : h10.get()) ? void 0 : r10.waitUntil), E2 = new N({ request: _2, page: t10.page, context: x2 ? { waitUntil: x2 } : void 0 });
        if ((o10 = await tS(_2, () => {
          if ("/middleware" === t10.page || "/src/middleware" === t10.page || "/proxy" === t10.page || "/src/proxy" === t10.page) {
            let e10 = E2.waitUntil.bind(E2), r11 = new tg();
            return e6().trace(eB.execute, { spanName: `middleware ${_2.method}`, attributes: { "http.target": _2.nextUrl.pathname, "http.method": _2.method } }, async () => {
              try {
                var n11, i11, a11, s11, o11, c11;
                let u11 = tm(), h11 = await t_("/", _2.nextUrl.pathname, null), d3 = (o11 = _2.nextUrl, c11 = (e11) => {
                  l10 = e11;
                }, function(e11, t11, r12, n12, i12, a12, s12, o12, l11, c12) {
                  function u12(e12) {
                    r12 && r12.setHeader("Set-Cookie", e12);
                  }
                  let h12 = {};
                  return { type: "request", phase: e11, implicitTags: a12, url: { pathname: n12.pathname, search: n12.search ?? "" }, rootParams: i12, get headers() {
                    return h12.headers || (h12.headers = function(e12) {
                      let t12 = ex.from(e12);
                      for (let e13 of ey) t12.delete(e13);
                      return ex.seal(t12);
                    }(t11.headers)), h12.headers;
                  }, get cookies() {
                    if (!h12.cookies) {
                      let e12 = new eo.RequestCookies(ex.from(t11.headers));
                      e8(t11, e12), h12.cookies = eS.seal(e12);
                    }
                    return h12.cookies;
                  }, set cookies(value) {
                    h12.cookies = value;
                  }, get mutableCookies() {
                    if (!h12.mutableCookies) {
                      var d4, p4;
                      let e12, n13 = (d4 = t11.headers, p4 = s12 || (r12 ? u12 : void 0), e12 = new eo.RequestCookies(ex.from(d4)), eA.wrap(e12, p4));
                      e8(t11, n13), h12.mutableCookies = n13;
                    }
                    return h12.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!h12.userspaceMutableCookies) {
                      var f3;
                      let e12;
                      f3 = this, h12.userspaceMutableCookies = e12 = new Proxy(f3.mutableCookies, { get(t12, r13, n13) {
                        switch (r13) {
                          case "delete":
                            return function(...r14) {
                              return eC(f3, "cookies().delete"), t12.delete(...r14), e12;
                            };
                          case "set":
                            return function(...r14) {
                              return eC(f3, "cookies().set"), t12.set(...r14), e12;
                            };
                          default:
                            return eu.get(t12, r13, n13);
                        }
                      } });
                    }
                    return h12.userspaceMutableCookies;
                  }, get draftMode() {
                    return h12.draftMode || (h12.draftMode = new e4(o12, t11, this.cookies, this.mutableCookies)), h12.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: l11, serverComponentsHmrCache: c12 || globalThis.__serverComponentsHmrCache, fallbackParams: null };
                }("action", _2, void 0, o11, {}, h11, c11, u11, false, void 0)), p3 = function({ page: e11, renderOpts: t11, isPrefetchRequest: r12, buildId: n12, deploymentId: i12, previouslyRevalidatedTags: a12, nonce: s12 }) {
                  let o12 = !t11.shouldWaitOnAllReady && !t11.supportsDynamicResponse && !t11.isDraftMode && !t11.isPossibleServerAction, l11 = o12 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), c12 = { isStaticGeneration: o12, page: e11, route: ev(e11), incrementalCache: t11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t11.cacheLifeProfiles, isBuildTimePrerendering: t11.isBuildTimePrerendering, fetchCache: t11.fetchCache, isOnDemandRevalidate: t11.isOnDemandRevalidate, isDraftMode: t11.isDraftMode, isPrefetchRequest: r12, buildId: n12, deploymentId: i12, reactLoadableManifest: (null == t11 ? void 0 : t11.reactLoadableManifest) || {}, assetPrefix: (null == t11 ? void 0 : t11.assetPrefix) || "", nonce: s12, afterContext: function(e12) {
                    let { waitUntil: t12, onClose: r13, onAfterTaskError: n13 } = e12;
                    return new td({ waitUntil: t12, onClose: r13, onTaskError: n13 });
                  }(t11), cacheComponentsEnabled: t11.cacheComponents, previouslyRevalidatedTags: a12, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t12 = ts();
                    if (t12) for (let [r13, n13] of t12) "refreshTags" in n13 && e12.set(r13, tf(async () => n13.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: (0, tu.createSnapshot)(), shouldTrackFetchMetrics: l11, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return t11.store = c12, c12;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (i11 = t10.request.nextConfig) || null == (n11 = i11.experimental) ? void 0 : n11.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (s11 = t10.request.nextConfig) || null == (a11 = s11.experimental) ? void 0 : a11.authInterrupts) }, supportsDynamicResponse: true, waitUntil: e10, onClose: r11.onClose.bind(r11), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === _2.headers.get(em), buildId: f2 ?? "", deploymentId: false, previouslyRevalidatedTags: [] });
                return await eE.workAsyncStorageInstance.run(p3, () => e7.workUnitAsyncStorageInstance.run(d3, t10.handler, _2, E2));
              } finally {
                setTimeout(() => {
                  r11.dispatchClose();
                }, 0);
              }
            });
          }
          return t10.handler(_2, E2);
        })) && !(o10 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        o10 && l10 && o10.headers.set("set-cookie", l10);
        let k2 = null == o10 ? void 0 : o10.headers.get("x-middleware-rewrite");
        if (o10 && k2 && (b2 || !d2)) {
          let e10 = new F(k2, { forceLocale: true, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          d2 || e10.host !== _2.nextUrl.host || (e10.buildId = f2 || e10.buildId, o10.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r11, isRelative: s11 } = eg(e10.toString(), p2.toString());
          !d2 && m2 && o10.headers.set("x-nextjs-rewrite", r11);
          let l11 = !s11 && (null == (a10 = t10.request.nextConfig) || null == (i10 = a10.experimental) || null == (n10 = i10.clientParamParsingOrigins) ? void 0 : n10.some((t11) => new RegExp(t11).test(e10.origin)));
          b2 && (s11 || l11) && (p2.pathname !== e10.pathname && o10.headers.set("x-nextjs-rewritten-path", e10.pathname), p2.search !== e10.search && o10.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (o10 && k2 && b2 && v2) {
          let e10 = new URL(k2);
          e10.searchParams.has(eb) || (e10.searchParams.set(eb, v2), o10.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let S2 = null == o10 ? void 0 : o10.headers.get("Location");
        if (o10 && S2 && !d2) {
          let e10 = new F(S2, { forceLocale: false, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          o10 = new Response(o10.body, o10), e10.host === p2.host && (e10.buildId = f2 || e10.buildId, o10.headers.set("Location", eg(e10, p2).url)), m2 && (o10.headers.delete("Location"), o10.headers.set("x-nextjs-redirect", eg(e10.toString(), p2.toString()).url));
        }
        let T2 = o10 || ef.next(), A2 = T2.headers.get("x-middleware-override-headers"), R2 = [];
        if (A2) {
          for (let [e10, t11] of w2) T2.headers.set(`x-middleware-request-${e10}`, t11), R2.push(e10);
          R2.length > 0 && T2.headers.set("x-middleware-override-headers", A2 + "," + R2.join(","));
        }
        return { response: T2, waitUntil: ("internal" === E2[j].kind ? Promise.all(E2[j].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: _2.fetchMetrics };
      }
      class tR {
        constructor() {
          let e10, t10;
          this.promise = new Promise((r10, n10) => {
            e10 = r10, t10 = n10;
          }), this.resolve = e10, this.reject = t10;
        }
      }
      class tC {
        constructor(e10, t10, r10) {
          this.prev = null, this.next = null, this.key = e10, this.data = t10, this.size = r10;
        }
      }
      class tO {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class tP {
        constructor(e10, t10, r10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t10, this.onEvict = r10, this.head = new tO(), this.tail = new tO(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(e10) {
          e10.prev = this.head, e10.next = this.head.next, this.head.next.prev = e10, this.head.next = e10;
        }
        removeNode(e10) {
          e10.prev.next = e10.next, e10.next.prev = e10.prev;
        }
        moveToHead(e10) {
          this.removeNode(e10), this.addToHead(e10);
        }
        removeTail() {
          let e10 = this.tail.prev;
          return this.removeNode(e10), e10;
        }
        set(e10, t10) {
          let r10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, t10)) ?? 1;
          if (r10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${r10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (r10 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let n10 = this.cache.get(e10);
          if (n10) n10.data = t10, this.totalSize = this.totalSize - n10.size + r10, n10.size = r10, this.moveToHead(n10);
          else {
            let n11 = new tC(e10, t10, r10);
            this.cache.set(e10, n11), this.addToHead(n11), this.totalSize += r10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let e11 = this.removeTail();
            this.cache.delete(e11.key), this.totalSize -= e11.size, null == this.onEvict || this.onEvict.call(this, e11.key, e11.data);
          }
          return true;
        }
        has(e10) {
          return this.cache.has(e10);
        }
        get(e10) {
          let t10 = this.cache.get(e10);
          if (t10) return this.moveToHead(t10), t10.data;
        }
        *[Symbol.iterator]() {
          let e10 = this.head.next;
          for (; e10 && e10 !== this.tail; ) {
            let t10 = e10;
            yield [t10.key, t10.data], e10 = e10.next;
          }
        }
        remove(e10) {
          let t10 = this.cache.get(e10);
          t10 && (this.removeNode(t10), this.cache.delete(e10), this.totalSize -= t10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let { env: tI, stdout: tj } = (null == (aT = globalThis) ? void 0 : aT.process) ?? {}, t$ = tI && !tI.NO_COLOR && (tI.FORCE_COLOR || (null == tj ? void 0 : tj.isTTY) && !tI.CI && "dumb" !== tI.TERM), tN = (e10, t10, r10, n10) => {
        let i10 = e10.substring(0, n10) + r10, a10 = e10.substring(n10 + t10.length), s10 = a10.indexOf(t10);
        return ~s10 ? i10 + tN(a10, t10, r10, s10) : i10 + a10;
      }, tU = (e10, t10, r10 = e10) => t$ ? (n10) => {
        let i10 = "" + n10, a10 = i10.indexOf(t10, e10.length);
        return ~a10 ? e10 + tN(i10, t10, r10, a10) + t10 : e10 + i10 + t10;
      } : String, tD = tU("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      tU("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), tU("\x1B[3m", "\x1B[23m"), tU("\x1B[4m", "\x1B[24m"), tU("\x1B[7m", "\x1B[27m"), tU("\x1B[8m", "\x1B[28m"), tU("\x1B[9m", "\x1B[29m"), tU("\x1B[30m", "\x1B[39m");
      let tL = tU("\x1B[31m", "\x1B[39m"), tM = tU("\x1B[32m", "\x1B[39m"), tH = tU("\x1B[33m", "\x1B[39m");
      tU("\x1B[34m", "\x1B[39m");
      let tB = tU("\x1B[35m", "\x1B[39m");
      tU("\x1B[38;2;173;127;168m", "\x1B[39m"), tU("\x1B[36m", "\x1B[39m");
      let tW = tU("\x1B[37m", "\x1B[39m");
      tU("\x1B[90m", "\x1B[39m"), tU("\x1B[40m", "\x1B[49m"), tU("\x1B[41m", "\x1B[49m"), tU("\x1B[42m", "\x1B[49m"), tU("\x1B[43m", "\x1B[49m"), tU("\x1B[44m", "\x1B[49m"), tU("\x1B[45m", "\x1B[49m"), tU("\x1B[46m", "\x1B[49m"), tU("\x1B[47m", "\x1B[49m"), tW(tD("\u25CB")), tL(tD("\u2A2F")), tH(tD("\u26A0")), tW(tD(" ")), tM(tD("\u2713")), tB(tD("\xBB")), new tP(1e4, (e10) => e10.length), new tP(1e4, (e10) => e10.length);
      var tq = ((ak = {}).APP_PAGE = "APP_PAGE", ak.APP_ROUTE = "APP_ROUTE", ak.PAGES = "PAGES", ak.FETCH = "FETCH", ak.REDIRECT = "REDIRECT", ak.IMAGE = "IMAGE", ak), tK = ((aS = {}).APP_PAGE = "APP_PAGE", aS.APP_ROUTE = "APP_ROUTE", aS.PAGES = "PAGES", aS.FETCH = "FETCH", aS.IMAGE = "IMAGE", aS);
      function tJ() {
      }
      new TextEncoder();
      let tF = new TextEncoder();
      function tz(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(tF.encode(e10)), t10.close();
        } });
      }
      function tV(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(e10), t10.close();
        } });
      }
      async function tG(e10, t10) {
        let r10 = new TextDecoder("utf-8", { fatal: true }), n10 = "";
        for await (let i10 of e10) {
          if (null == t10 ? void 0 : t10.aborted) return n10;
          n10 += r10.decode(i10, { stream: true });
        }
        return n10 + r10.decode();
      }
      let tX = "ResponseAborted";
      class tY extends Error {
        constructor(...e10) {
          super(...e10), this.name = tX;
        }
      }
      let tZ = 0, tQ = 0, t0 = 0;
      function t1(e10) {
        return (null == e10 ? void 0 : e10.name) === "AbortError" || (null == e10 ? void 0 : e10.name) === tX;
      }
      async function t2(e10, t10, r10) {
        try {
          let n10, { errored: i10, destroyed: a10 } = t10;
          if (i10 || a10) return;
          let s10 = (n10 = new AbortController(), t10.once("close", () => {
            t10.writableFinished || n10.abort(new tY());
          }), n10), o10 = function(e11, t11) {
            let r11 = false, n11 = new tR();
            function i11() {
              n11.resolve();
            }
            e11.on("drain", i11), e11.once("close", () => {
              e11.off("drain", i11), n11.resolve();
            });
            let a11 = new tR();
            return e11.once("finish", () => {
              a11.resolve();
            }), new WritableStream({ write: async (t12) => {
              if (!r11) {
                if (r11 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                  let e12 = function(e13 = {}) {
                    let t13 = 0 === tZ ? void 0 : { clientComponentLoadStart: tZ, clientComponentLoadTimes: tQ, clientComponentLoadCount: t0 };
                    return e13.reset && (tZ = 0, tQ = 0, t0 = 0), t13;
                  }();
                  e12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: e12.clientComponentLoadStart, end: e12.clientComponentLoadStart + e12.clientComponentLoadTimes });
                }
                e11.flushHeaders(), e6().trace(ej.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let r12 = e11.write(t12);
                "flush" in e11 && "function" == typeof e11.flush && e11.flush(), r12 || (await n11.promise, n11 = new tR());
              } catch (t13) {
                throw e11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: t13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (t12) => {
              e11.writableFinished || e11.destroy(t12);
            }, close: async () => {
              if (t11 && await t11, !e11.writableFinished) return e11.end(), a11.promise;
            } });
          }(t10, r10);
          await e10.pipeTo(o10, { signal: s10.signal });
        } catch (e11) {
          if (t1(e11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      class t5 {
        static #e = this.EMPTY = new t5(null, { metadata: {}, contentType: null });
        static fromStatic(e10, t10) {
          return new t5(e10, { metadata: {}, contentType: t10 });
        }
        constructor(e10, { contentType: t10, waitUntil: r10, metadata: n10 }) {
          this.response = e10, this.contentType = t10, this.metadata = n10, this.waitUntil = r10;
        }
        assignMetadata(e10) {
          Object.assign(this.metadata, e10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(e10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!e10) throw Object.defineProperty(new tt.InvariantError("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return tG(this.readable);
          }
          return this.response;
        }
        get readable() {
          return null === this.response ? new ReadableStream({ start(e10) {
            e10.close();
          } }) : "string" == typeof this.response ? tz(this.response) : tr.Buffer.isBuffer(this.response) ? tV(this.response) : Array.isArray(this.response) ? function(...e10) {
            if (0 === e10.length) return new ReadableStream({ start(e11) {
              e11.close();
            } });
            if (1 === e10.length) return e10[0];
            let { readable: t10, writable: r10 } = new TransformStream(), n10 = e10[0].pipeTo(r10, { preventClose: true }), i10 = 1;
            for (; i10 < e10.length - 1; i10++) {
              let t11 = e10[i10];
              n10 = n10.then(() => t11.pipeTo(r10, { preventClose: true }));
            }
            let a10 = e10[i10];
            return (n10 = n10.then(() => a10.pipeTo(r10))).catch(tJ), t10;
          }(...this.response) : this.response;
        }
        coerce() {
          return null === this.response ? [] : "string" == typeof this.response ? [tz(this.response)] : Array.isArray(this.response) ? this.response : tr.Buffer.isBuffer(this.response) ? [tV(this.response)] : [this.response];
        }
        pipeThrough(e10) {
          this.response = this.readable.pipeThrough(e10);
        }
        unshift(e10) {
          this.response = this.coerce(), this.response.unshift(e10);
        }
        push(e10) {
          this.response = this.coerce(), this.response.push(e10);
        }
        async pipeTo(e10) {
          try {
            await this.readable.pipeTo(e10, { preventClose: true }), this.waitUntil && await this.waitUntil, await e10.close();
          } catch (t10) {
            if (t1(t10)) return void await e10.abort(t10);
            throw t10;
          }
        }
        async pipeToNodeResponse(e10) {
          await t2(this.readable, e10, this.waitUntil);
        }
      }
      function t6(e10, t10) {
        if (!e10) return t10;
        let r10 = parseInt(e10, 10);
        return Number.isFinite(r10) && r10 > 0 ? r10 : t10;
      }
      t6(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), t6(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var t3 = e.i(68886);
      let t4 = /* @__PURE__ */ new Map(), t8 = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = t4.get(r10), n10 = null == e11 ? void 0 : e11.expired;
          if ("number" == typeof n10 && n10 <= Date.now() && n10 > t10) return true;
        }
        return false;
      }, t9 = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = t4.get(r10), n10 = (null == e11 ? void 0 : e11.stale) ?? 0;
          if ("number" == typeof n10 && n10 > t10) return true;
        }
        return false;
      };
      class t7 {
        constructor(e10) {
          this.fs = e10, this.tasks = [];
        }
        findOrCreateTask(e10) {
          for (let t11 of this.tasks) if (t11[0] === e10) return t11;
          let t10 = this.fs.mkdir(e10);
          t10.catch(() => {
          });
          let r10 = [e10, t10, []];
          return this.tasks.push(r10), r10;
        }
        append(e10, t10) {
          let r10 = this.findOrCreateTask(t3.default.dirname(e10)), n10 = r10[1].then(() => this.fs.writeFile(e10, t10));
          n10.catch(() => {
          }), r10[2].push(n10);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((e10) => e10[2]));
        }
      }
      function re(e10) {
        return (null == e10 ? void 0 : e10.length) || 0;
      }
      class rt {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(e10) {
          this.fs = e10.fs, this.flushToDisk = e10.flushToDisk, this.serverDistDir = e10.serverDistDir, this.revalidatedTags = e10.revalidatedTags, e10.maxMemoryCacheSize ? rt.memoryCache ? rt.debug && console.log("FileSystemCache: memory store already initialized") : (rt.debug && console.log("FileSystemCache: using memory store for fetch cache"), rt.memoryCache = function(e11) {
            return r || (r = new tP(e11, function({ value: e12 }) {
              var t10, r10;
              if (!e12) return 25;
              if (e12.kind === tq.REDIRECT) return JSON.stringify(e12.props).length;
              if (e12.kind === tq.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              if (e12.kind === tq.FETCH) return JSON.stringify(e12.data || "").length;
              if (e12.kind === tq.APP_ROUTE) return e12.body.length;
              return e12.kind === tq.APP_PAGE ? Math.max(1, e12.html.length + re(e12.rscData) + ((null == (r10 = e12.postponed) ? void 0 : r10.length) || 0) + function(e13) {
                if (!e13) return 0;
                let t11 = 0;
                for (let [r11, n10] of e13) t11 += r11.length + re(n10);
                return t11;
              }(e12.segmentData)) : e12.html.length + ((null == (t10 = JSON.stringify(e12.pageData)) ? void 0 : t10.length) || 0);
            })), r;
          }(e10.maxMemoryCacheSize)) : rt.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(e10, t10) {
          if (e10 = "string" == typeof e10 ? [e10] : e10, rt.debug && console.log("FileSystemCache: revalidateTag", e10, t10), 0 === e10.length) return;
          let r10 = Date.now();
          for (let n10 of e10) {
            let e11 = t4.get(n10) || {};
            if (t10) {
              let i10 = { ...e11 };
              i10.stale = r10, void 0 !== t10.expire && (i10.expired = r10 + 1e3 * t10.expire), t4.set(n10, i10);
            } else t4.set(n10, { ...e11, expired: r10 });
          }
        }
        async get(...e10) {
          var t10, r10, n10, i10, a10, s10;
          let [o10, l10] = e10, { kind: c10 } = l10, u10 = null == (t10 = rt.memoryCache) ? void 0 : t10.get(o10);
          if (rt.debug && (c10 === tK.FETCH ? console.log("FileSystemCache: get", o10, l10.tags, c10, !!u10) : console.log("FileSystemCache: get", o10, c10, !!u10)), (null == u10 || null == (r10 = u10.value) ? void 0 : r10.kind) === tq.APP_PAGE || (null == u10 || null == (n10 = u10.value) ? void 0 : n10.kind) === tq.APP_ROUTE || (null == u10 || null == (i10 = u10.value) ? void 0 : i10.kind) === tq.PAGES) {
            let e11 = null == (s10 = u10.value.headers) ? void 0 : s10[k];
            if ("string" == typeof e11) {
              let t11 = e11.split(",");
              if (t11.length > 0 && t8(t11, u10.lastModified)) return rt.debug && console.log("FileSystemCache: expired tags", t11), null;
            }
          } else if ((null == u10 || null == (a10 = u10.value) ? void 0 : a10.kind) === tq.FETCH) {
            let e11 = l10.kind === tK.FETCH ? [...l10.tags || [], ...l10.softTags || []] : [];
            if (e11.some((e12) => this.revalidatedTags.includes(e12))) return rt.debug && console.log("FileSystemCache: was revalidated", e11), null;
            if (t8(e11, u10.lastModified)) return rt.debug && console.log("FileSystemCache: expired tags", e11), null;
          }
          return u10 ?? null;
        }
        async set(e10, t10, r10) {
          var n10;
          if (null == (n10 = rt.memoryCache) || n10.set(e10, { value: t10, lastModified: Date.now() }), rt.debug && console.log("FileSystemCache: set", e10), !this.flushToDisk || !t10) return;
          let i10 = new t7(this.fs);
          if (t10.kind === tq.APP_ROUTE) {
            let r11 = this.getFilePath(`${e10}.body`, tK.APP_ROUTE);
            i10.append(r11, t10.body);
            let n11 = { headers: t10.headers, status: t10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            i10.append(r11.replace(/\.body$/, E), JSON.stringify(n11, null, 2));
          } else if (t10.kind === tq.PAGES || t10.kind === tq.APP_PAGE) {
            let n11 = t10.kind === tq.APP_PAGE, a10 = this.getFilePath(`${e10}.html`, n11 ? tK.APP_PAGE : tK.PAGES);
            if (i10.append(a10, t10.html), r10.fetchCache || r10.isFallback || r10.isRoutePPREnabled || i10.append(this.getFilePath(`${e10}${n11 ? ".rsc" : ".json"}`, n11 ? tK.APP_PAGE : tK.PAGES), n11 ? t10.rscData : JSON.stringify(t10.pageData)), (null == t10 ? void 0 : t10.kind) === tq.APP_PAGE) {
              let e11;
              if (t10.segmentData) {
                e11 = [];
                let r12 = a10.replace(/\.html$/, ".segments");
                for (let [n12, a11] of t10.segmentData) {
                  e11.push(n12);
                  let t11 = r12 + n12 + ".segment.rsc";
                  i10.append(t11, a11);
                }
              }
              let r11 = { headers: t10.headers, status: t10.status, postponed: t10.postponed, segmentPaths: e11, prefetchHints: void 0 };
              i10.append(a10.replace(/\.html$/, E), JSON.stringify(r11));
            }
          } else if (t10.kind === tq.FETCH) {
            let n11 = this.getFilePath(e10, tK.FETCH);
            i10.append(n11, JSON.stringify({ ...t10, tags: r10.fetchCache ? r10.tags : [] }));
          }
          await i10.wait();
        }
        getFilePath(e10, t10) {
          switch (t10) {
            case tK.FETCH:
              return t3.default.join(this.serverDistDir, "..", "cache", "fetch-cache", e10);
            case tK.PAGES:
              return t3.default.join(this.serverDistDir, "pages", e10);
            case tK.IMAGE:
            case tK.APP_PAGE:
            case tK.APP_ROUTE:
              return t3.default.join(this.serverDistDir, "app", e10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${t10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let rr = ["(..)(..)", "(.)", "(..)", "(...)"], rn = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, ri = /\/\[[^/]+\](?=\/|$)/;
      function ra(e10) {
        return e10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      class rs {
        static #e = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(e10) {
          this.prerenderManifest = e10;
        }
        get(e10) {
          let t10 = rs.cacheControls.get(e10);
          if (t10) return t10;
          let r10 = this.prerenderManifest.routes[e10];
          if (r10) {
            let { initialRevalidateSeconds: e11, initialExpireSeconds: t11 } = r10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
          let n10 = this.prerenderManifest.dynamicRoutes[e10];
          if (n10) {
            let { fallbackRevalidate: e11, fallbackExpire: t11 } = n10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
        }
        set(e10, t10) {
          rs.cacheControls.set(e10, t10);
        }
        clear() {
          rs.cacheControls.clear();
        }
      }
      var e7 = e7;
      e.i(67914);
      var eE = eE;
      function ro(e10) {
        let t10 = "buffer" in e10 ? new Uint8Array(e10.buffer, e10.byteOffset, e10.byteLength) : new Uint8Array(e10), r10 = "";
        for (let e11 of t10) r10 += e11.toString(16).padStart(2, "0");
        return r10;
      }
      async function rl(e10) {
        {
          let t10 = new TextEncoder().encode(e10);
          return ro(await crypto.subtle.digest("SHA-256", t10));
        }
      }
      class rc {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: e10, dev: t10, flushToDisk: r10, minimalMode: n10, serverDistDir: i10, requestHeaders: a10, maxMemoryCacheSize: s10, getPrerenderManifest: o10, fetchCacheKeyPrefix: l10, CurCacheHandler: c10, allowedRevalidateHeaderKeys: u10 }) {
          var h10, d2, p2, f2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!c10;
          const g2 = Symbol.for("@next/cache-handlers"), m2 = globalThis;
          if (c10) rc.debug && console.log("IncrementalCache: using custom cache handler", c10.name);
          else {
            const t11 = m2[g2];
            (null == t11 ? void 0 : t11.FetchCache) ? (c10 = t11.FetchCache, rc.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : e10 && i10 && (rc.debug && console.log("IncrementalCache: using filesystem cache handler"), c10 = rt);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (s10 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = t10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = n10, this.requestHeaders = a10, this.allowedRevalidateHeaderKeys = u10, this.prerenderManifest = o10(), this.cacheControls = new rs(this.prerenderManifest), this.fetchCacheKeyPrefix = l10;
          let y2 = [];
          a10[x] === (null == (d2 = this.prerenderManifest) || null == (h10 = d2.preview) ? void 0 : h10.previewModeId) && (this.isOnDemandRevalidate = true), n10 && (y2 = this.revalidatedTags = function(e11, t11) {
            return "string" == typeof e11[S] && e11["x-next-revalidate-tag-token"] === t11 ? e11[S].split(",") : [];
          }(a10, null == (f2 = this.prerenderManifest) || null == (p2 = f2.preview) ? void 0 : p2.previewModeId)), c10 && (this.cacheHandler = new c10({ dev: t10, fs: e10, flushToDisk: r10, serverDistDir: i10, revalidatedTags: y2, maxMemoryCacheSize: s10, _requestHeaders: a10, fetchCacheKeyPrefix: l10 }));
        }
        calculateRevalidate(e10, t10, r10, n10) {
          if (r10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let i10 = this.cacheControls.get(ra(e10)), a10 = i10 ? i10.revalidate : !n10 && 1;
          return "number" == typeof a10 ? 1e3 * a10 + t10 : a10;
        }
        _getPathname(e10, t10) {
          return t10 ? e10 : /^\/index(\/|$)/.test(e10) && !function(e11, t11 = true) {
            return (void 0 !== e11.split("/").find((e12) => rr.find((t12) => e12.startsWith(t12))) && (e11 = function(e12) {
              let t12, r10, n10;
              for (let i10 of e12.split("/")) if (r10 = rr.find((e13) => i10.startsWith(e13))) {
                [t12, n10] = e12.split(r10, 2);
                break;
              }
              if (!t12 || !r10 || !n10) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
              switch (t12 = ev(t12), r10) {
                case "(.)":
                  n10 = "/" === t12 ? `/${n10}` : t12 + "/" + n10;
                  break;
                case "(..)":
                  if ("/" === t12) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                  n10 = t12.split("/").slice(0, -1).concat(n10).join("/");
                  break;
                case "(...)":
                  n10 = "/" + n10;
                  break;
                case "(..)(..)":
                  let i10 = t12.split("/");
                  if (i10.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                  n10 = i10.slice(0, -2).concat(n10).join("/");
                  break;
                default:
                  throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
              }
              return { interceptingRoute: t12, interceptedRoute: n10 };
            }(e11).interceptedRoute), t11) ? ri.test(e11) : rn.test(e11);
          }(e10) ? `/index${e10}` : "/" === e10 ? "/index" : ew(e10);
        }
        resetRequestCache() {
          var e10, t10;
          null == (t10 = this.cacheHandler) || null == (e10 = t10.resetRequestCache) || e10.call(t10);
        }
        async lock(e10) {
          for (; ; ) {
            let t11 = this.locks.get(e10);
            if (rc.debug && console.log("IncrementalCache: lock get", e10, !!t11), !t11) break;
            await t11;
          }
          let { resolve: t10, promise: r10 } = new tR();
          return rc.debug && console.log("IncrementalCache: successfully locked", e10), this.locks.set(e10, r10), () => {
            t10(), this.locks.delete(e10);
          };
        }
        async revalidateTag(e10, t10) {
          var r10;
          return null == (r10 = this.cacheHandler) ? void 0 : r10.revalidateTag(e10, t10);
        }
        async generateSimpleCacheKey(e10) {
          return rl(JSON.stringify(["v4", this.fetchCacheKeyPrefix || "", e10]));
        }
        async generateCacheKey(e10, t10 = {}) {
          let r10 = [], n10 = new TextEncoder(), i10 = null, a10 = t10.body;
          if (a10) if ("object" == typeof a10 && "byteLength" in a10) r10.push(`bytes:${ro(a10)}`), t10._ogBody = a10;
          else if ("function" == typeof a10.getReader) {
            let e11 = [];
            try {
              await a10.pipeTo(new WritableStream({ write(t11) {
                e11.push("string" == typeof t11 ? n10.encode(t11) : t11);
              } }));
              let i11 = e11.reduce((e12, t11) => e12 + t11.length, 0), s11 = new Uint8Array(i11), o10 = 0;
              for (let t11 of e11) s11.set(t11, o10), o10 += t11.length;
              r10.push(`bytes:${ro(s11)}`), t10._ogBody = s11;
            } catch (e12) {
              console.error("Problem reading body", e12);
            }
          } else if ("function" == typeof a10.keys) for (let [e11, n11] of (i10 = "[object FormData]" === String(a10) ? "multipart/form-data; boundary=" : "application/x-www-form-urlencoded;charset=UTF-8", t10._ogBody = a10, a10.entries())) r10.push(`key:${e11}`), "string" == typeof n11 ? r10.push(`str:${n11}`) : r10.push("file", n11.name, n11.type, `bytes:${ro(await n11.arrayBuffer())}`);
          else if ("function" == typeof a10.arrayBuffer) {
            let e11 = await a10.arrayBuffer();
            r10.push("blob", a10.type, `bytes:${ro(e11)}`), t10._ogBody = new Blob([e11], { type: a10.type }), i10 = a10.type;
          } else if ("string" == typeof a10) r10.push(`str:${a10}`), t10._ogBody = a10, i10 = "text/plain;charset=UTF-8";
          else throw Object.defineProperty(Error(`Unsupported body type: ${typeof a10}`), "__NEXT_ERROR_CODE", { value: "E1145", enumerable: false, configurable: true });
          let s10 = "function" == typeof (t10.headers || {}).keys ? Object.fromEntries(t10.headers) : Object.assign({}, t10.headers);
          return "traceparent" in s10 && delete s10.traceparent, "tracestate" in s10 && delete s10.tracestate, rl(JSON.stringify(["v4", this.fetchCacheKeyPrefix || "", e10, t10.method, i10, s10, t10.mode, t10.redirect, t10.credentials, t10.referrer, t10.referrerPolicy, t10.integrity, t10.cache, r10]));
        }
        async get(e10, t10) {
          var r10, n10, i10, a10, s10, o10, l10;
          let c10, u10;
          if (t10.kind === tK.FETCH) {
            let r11 = e7.workUnitAsyncStorageInstance.getStore(), n11 = r11 ? (0, e9.getRenderResumeDataCache)(r11) : null;
            if (n11) {
              let r12 = n11.fetch.get(e10);
              if ((null == r12 ? void 0 : r12.kind) === tq.FETCH) {
                let n12 = eE.workAsyncStorageInstance.getStore();
                if (![...t10.tags || [], ...t10.softTags || []].some((e11) => {
                  var t11, r13;
                  return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == n12 || null == (r13 = n12.pendingRevalidatedTags) ? void 0 : r13.some((t12) => t12.tag === e11));
                })) return rc.debug && console.log("IncrementalCache: rdc:hit", e10), { isStale: false, value: r12 };
                rc.debug && console.log("IncrementalCache: rdc:revalidated-tag", e10);
              } else rc.debug && console.log("IncrementalCache: rdc:miss", e10);
            } else rc.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (t10.kind !== tK.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          e10 = this._getPathname(e10, t10.kind === tK.FETCH);
          let h10 = await (null == (r10 = this.cacheHandler) ? void 0 : r10.get(e10, t10));
          if (t10.kind === tK.FETCH) {
            if (!h10) return null;
            if ((null == (i10 = h10.value) ? void 0 : i10.kind) !== tq.FETCH) throw Object.defineProperty(new tt.InvariantError(`Expected cached value for cache key ${JSON.stringify(e10)} to be a "FETCH" kind, got ${JSON.stringify(null == (a10 = h10.value) ? void 0 : a10.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let r11 = eE.workAsyncStorageInstance.getStore(), n11 = [...t10.tags || [], ...t10.softTags || []];
            if (n11.some((e11) => {
              var t11, n12;
              return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == r11 || null == (n12 = r11.pendingRevalidatedTags) ? void 0 : n12.some((t12) => t12.tag === e11));
            })) return rc.debug && console.log("IncrementalCache: expired tag", e10), null;
            let s11 = e7.workUnitAsyncStorageInstance.getStore();
            if (s11) {
              let t11 = (0, e9.getPrerenderResumeDataCache)(s11);
              t11 && (rc.debug && console.log("IncrementalCache: rdc:set", e10), t11.fetch.set(e10, h10.value));
            }
            let o11 = t10.revalidate || h10.value.revalidate, l11 = (performance.timeOrigin + performance.now() - (h10.lastModified || 0)) / 1e3 > o11, c11 = h10.value.data;
            return t8(n11, h10.lastModified) ? null : (t9(n11, h10.lastModified) && (l11 = true), { isStale: l11, value: { kind: tq.FETCH, data: c11, revalidate: o11 } });
          }
          if ((null == h10 || null == (n10 = h10.value) ? void 0 : n10.kind) === tq.FETCH) throw Object.defineProperty(new tt.InvariantError(`Expected cached value for cache key ${JSON.stringify(e10)} not to be a ${JSON.stringify(t10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let d2 = null, { isFallback: p2 } = t10, f2 = this.cacheControls.get(ra(e10));
          if ((null == h10 ? void 0 : h10.lastModified) === -1) c10 = -1, u10 = -31536e6;
          else {
            let r11 = performance.timeOrigin + performance.now(), n11 = (null == h10 ? void 0 : h10.lastModified) || r11;
            if (void 0 === (c10 = false !== (u10 = this.calculateRevalidate(e10, n11, this.dev ?? false, t10.isFallback)) && u10 < r11 || void 0) && ((null == h10 || null == (s10 = h10.value) ? void 0 : s10.kind) === tq.APP_PAGE || (null == h10 || null == (o10 = h10.value) ? void 0 : o10.kind) === tq.APP_ROUTE)) {
              let e11 = null == (l10 = h10.value.headers) ? void 0 : l10[k];
              if ("string" == typeof e11) {
                let t11 = e11.split(",");
                t11.length > 0 && (t8(t11, n11) ? c10 = -1 : t9(t11, n11) && (c10 = true));
              }
            }
          }
          return h10 && (d2 = { isStale: c10, cacheControl: f2, revalidateAfter: u10, value: h10.value, isFallback: p2 }), !h10 && this.prerenderManifest.notFoundRoutes.includes(e10) && (d2 = { isStale: c10, value: null, cacheControl: f2, revalidateAfter: u10, isFallback: p2 }, this.set(e10, d2.value, { ...t10, cacheControl: f2 })), d2;
        }
        async set(e10, t10, r10) {
          if ((null == t10 ? void 0 : t10.kind) === tq.FETCH) {
            let r11 = e7.workUnitAsyncStorageInstance.getStore(), n11 = r11 ? (0, e9.getPrerenderResumeDataCache)(r11) : null;
            n11 && (rc.debug && console.log("IncrementalCache: rdc:set", e10), n11.fetch.set(e10, t10));
          }
          if (this.disableForTestmode || this.dev && !r10.fetchCache) return;
          e10 = this._getPathname(e10, r10.fetchCache);
          let n10 = JSON.stringify(t10).length;
          if (r10.fetchCache && n10 > 2097152 && !this.hasCustomCacheHandler && !r10.isImplicitBuildTimeCache) {
            let t11 = `Failed to set Next.js data cache for ${r10.fetchUrl || e10}, items over 2MB can not be cached (${n10} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(t11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(t11);
            return;
          }
          try {
            var i10;
            !r10.fetchCache && r10.cacheControl && this.cacheControls.set(ra(e10), r10.cacheControl), await (null == (i10 = this.cacheHandler) ? void 0 : i10.set(e10, t10, r10));
          } catch (t11) {
            console.warn("Failed to update prerender cache for", e10, t11);
          }
        }
      }
      var ru = function(e10, t10, r10, n10, i10) {
        if ("m" === n10) throw TypeError("Private method is not writable");
        if ("a" === n10 && !i10) throw TypeError("Private accessor was defined without a setter");
        if ("function" == typeof t10 ? e10 !== t10 || !i10 : !t10.has(e10)) throw TypeError("Cannot write private member to an object whose class did not declare it");
        return "a" === n10 ? i10.call(e10, r10) : i10 ? i10.value = r10 : t10.set(e10, r10), r10;
      }, rh = function(e10, t10, r10, n10) {
        if ("a" === r10 && !n10) throw TypeError("Private accessor was defined without a getter");
        if ("function" == typeof t10 ? e10 !== t10 || !n10 : !t10.has(e10)) throw TypeError("Cannot read private member from an object whose class did not declare it");
        return "m" === r10 ? n10 : "a" === r10 ? n10.call(e10) : n10 ? n10.value : t10.get(e10);
      };
      function rd(e10) {
        let t10 = e10 ? "__Secure-" : "";
        return { sessionToken: { name: `${t10}authjs.session-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10 } }, callbackUrl: { name: `${t10}authjs.callback-url`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10 } }, csrfToken: { name: `${e10 ? "__Host-" : ""}authjs.csrf-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10 } }, pkceCodeVerifier: { name: `${t10}authjs.pkce.code_verifier`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10, maxAge: 900 } }, state: { name: `${t10}authjs.state`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10, maxAge: 900 } }, nonce: { name: `${t10}authjs.nonce`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10 } }, webauthnChallenge: { name: `${t10}authjs.challenge`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10, maxAge: 900 } } };
      }
      class rp {
        constructor(e10, t10, r10) {
          if (aA.add(this), aR.set(this, {}), aC.set(this, void 0), aO.set(this, void 0), ru(this, aO, r10, "f"), ru(this, aC, e10, "f"), !t10) return;
          const { name: n10 } = e10;
          for (const [e11, r11] of Object.entries(t10)) e11.startsWith(n10) && r11 && (rh(this, aR, "f")[e11] = r11);
        }
        get value() {
          return Object.keys(rh(this, aR, "f")).sort((e10, t10) => parseInt(e10.split(".").pop() || "0") - parseInt(t10.split(".").pop() || "0")).map((e10) => rh(this, aR, "f")[e10]).join("");
        }
        chunk(e10, t10) {
          let r10 = rh(this, aA, "m", aI).call(this);
          for (let n10 of rh(this, aA, "m", aP).call(this, { name: rh(this, aC, "f").name, value: e10, options: { ...rh(this, aC, "f").options, ...t10 } })) r10[n10.name] = n10;
          return Object.values(r10);
        }
        clean() {
          return Object.values(rh(this, aA, "m", aI).call(this));
        }
      }
      aR = /* @__PURE__ */ new WeakMap(), aC = /* @__PURE__ */ new WeakMap(), aO = /* @__PURE__ */ new WeakMap(), aA = /* @__PURE__ */ new WeakSet(), aP = function(e10) {
        let t10 = Math.ceil(e10.value.length / 3936);
        if (1 === t10) return rh(this, aR, "f")[e10.name] = e10.value, [e10];
        let r10 = [];
        for (let n10 = 0; n10 < t10; n10++) {
          let t11 = `${e10.name}.${n10}`, i10 = e10.value.substr(3936 * n10, 3936);
          r10.push({ ...e10, name: t11, value: i10 }), rh(this, aR, "f")[t11] = i10;
        }
        return rh(this, aO, "f").debug("CHUNKING_SESSION_COOKIE", { message: "Session cookie exceeds allowed 4096 bytes.", emptyCookieSize: 160, valueSize: e10.value.length, chunks: r10.map((e11) => e11.value.length + 160) }), r10;
      }, aI = function() {
        let e10 = {};
        for (let t10 in rh(this, aR, "f")) delete rh(this, aR, "f")?.[t10], e10[t10] = { name: t10, value: "", options: { ...rh(this, aC, "f").options, maxAge: 0 } };
        return e10;
      };
      class rf extends Error {
        constructor(e10, t10) {
          e10 instanceof Error ? super(void 0, { cause: { err: e10, ...e10.cause, ...t10 } }) : "string" == typeof e10 ? (t10 instanceof Error && (t10 = { err: t10, ...t10.cause }), super(e10, t10)) : super(void 0, e10), this.name = this.constructor.name, this.type = this.constructor.type ?? "AuthError", this.kind = this.constructor.kind ?? "error", Error.captureStackTrace?.(this, this.constructor);
          const r10 = `https://errors.authjs.dev#${this.type.toLowerCase()}`;
          this.message += `${this.message ? ". " : ""}Read more at ${r10}`;
        }
      }
      class rg extends rf {
      }
      rg.kind = "signIn";
      class rm extends rf {
      }
      rm.type = "AdapterError";
      class ry extends rf {
      }
      ry.type = "AccessDenied";
      class rb extends rf {
      }
      rb.type = "CallbackRouteError";
      class rw extends rf {
      }
      rw.type = "ErrorPageLoop";
      class rv extends rf {
      }
      rv.type = "EventError";
      class r_ extends rf {
      }
      r_.type = "InvalidCallbackUrl";
      class rx extends rg {
        constructor() {
          super(...arguments), this.code = "credentials";
        }
      }
      rx.type = "CredentialsSignin";
      class rE extends rf {
      }
      rE.type = "InvalidEndpoints";
      class rk extends rf {
      }
      rk.type = "InvalidCheck";
      class rS extends rf {
      }
      rS.type = "JWTSessionError";
      class rT extends rf {
      }
      rT.type = "MissingAdapter";
      class rA extends rf {
      }
      rA.type = "MissingAdapterMethods";
      class rR extends rf {
      }
      rR.type = "MissingAuthorize";
      class rC extends rf {
      }
      rC.type = "MissingSecret";
      class rO extends rg {
      }
      rO.type = "OAuthAccountNotLinked";
      class rP extends rg {
      }
      rP.type = "OAuthCallbackError";
      class rI extends rf {
      }
      rI.type = "OAuthProfileParseError";
      class rj extends rf {
      }
      rj.type = "SessionTokenError";
      class r$ extends rf {
      }
      r$.type = "SignOutError";
      class rN extends rf {
      }
      rN.type = "UnknownAction";
      class rU extends rf {
      }
      rU.type = "UnsupportedStrategy";
      class rD extends rf {
      }
      rD.type = "InvalidProvider";
      class rL extends rf {
      }
      rL.type = "UntrustedHost";
      class rM extends rf {
      }
      rM.type = "Verification";
      class rH extends rg {
      }
      rH.type = "MissingCSRF";
      let rB = /* @__PURE__ */ new Set(["CredentialsSignin", "OAuthAccountNotLinked", "OAuthCallbackError", "AccessDenied", "Verification", "MissingCSRF", "AccountNotLinked", "WebAuthnVerificationError"]);
      class rW extends rf {
      }
      rW.type = "DuplicateConditionalUI";
      class rq extends rf {
      }
      rq.type = "MissingWebAuthnAutocomplete";
      class rK extends rf {
      }
      rK.type = "WebAuthnVerificationError";
      class rJ extends rg {
      }
      rJ.type = "AccountNotLinked";
      class rF extends rf {
      }
      rF.type = "ExperimentalFeatureNotEnabled";
      let rz = false;
      function rV(e10, t10) {
        try {
          return /^https?:/.test(new URL(e10, e10.startsWith("/") ? t10 : void 0).protocol);
        } catch {
          return false;
        }
      }
      let rG = false, rX = false, rY = false, rZ = ["createVerificationToken", "useVerificationToken", "getUserByEmail"], rQ = ["createUser", "getUser", "getUserByEmail", "getUserByAccount", "updateUser", "linkAccount", "createSession", "getSessionAndUser", "updateSession", "deleteSession"], r0 = ["createUser", "getUser", "linkAccount", "getAccount", "getAuthenticator", "createAuthenticator", "listAuthenticatorsByUserId", "updateAuthenticatorCounter"], r1 = async (e10, t10, r10, n10, i10) => {
        let { crypto: { subtle: a10 } } = (() => {
          if ("u" > typeof globalThis) return globalThis;
          if ("u" > typeof self) return self;
          throw Error("unable to locate global object");
        })();
        return new Uint8Array(await a10.deriveBits({ name: "HKDF", hash: `SHA-${e10.substr(3)}`, salt: r10, info: n10 }, await a10.importKey("raw", t10, "HKDF", false, ["deriveBits"]), i10 << 3));
      };
      function r2(e10, t10) {
        if ("string" == typeof e10) return new TextEncoder().encode(e10);
        if (!(e10 instanceof Uint8Array)) throw TypeError(`"${t10}"" must be an instance of Uint8Array or a string`);
        return e10;
      }
      async function r5(e10, t10, r10, n10, i10) {
        return r1(function(e11) {
          switch (e11) {
            case "sha256":
            case "sha384":
            case "sha512":
            case "sha1":
              return e11;
            default:
              throw TypeError('unsupported "digest" value');
          }
        }(e10), function(e11) {
          let t11 = r2(e11, "ikm");
          if (!t11.byteLength) throw TypeError('"ikm" must be at least one byte in length');
          return t11;
        }(t10), r2(r10, "salt"), function(e11) {
          let t11 = r2(e11, "info");
          if (t11.byteLength > 1024) throw TypeError('"info" must not contain more than 1024 bytes');
          return t11;
        }(n10), function(e11, t11) {
          if ("number" != typeof e11 || !Number.isInteger(e11) || e11 < 1) throw TypeError('"keylen" must be a positive integer');
          if (e11 > 255 * (parseInt(t11.substr(3), 10) >> 3 || 20)) throw TypeError('"keylen" too large');
          return e11;
        }(i10, e10));
      }
      let r6 = new TextEncoder(), r3 = new TextDecoder();
      function r4(...e10) {
        let t10 = new Uint8Array(e10.reduce((e11, { length: t11 }) => e11 + t11, 0)), r10 = 0;
        for (let n10 of e10) t10.set(n10, r10), r10 += n10.length;
        return t10;
      }
      function r8(e10, t10, r10) {
        if (t10 < 0 || t10 >= 4294967296) throw RangeError(`value must be >= 0 and <= ${4294967296 - 1}. Received ${t10}`);
        e10.set([t10 >>> 24, t10 >>> 16, t10 >>> 8, 255 & t10], r10);
      }
      function r9(e10) {
        let t10 = Math.floor(e10 / 4294967296), r10 = new Uint8Array(8);
        return r8(r10, t10, 0), r8(r10, e10 % 4294967296, 4), r10;
      }
      function r7(e10) {
        let t10 = new Uint8Array(4);
        return r8(t10, e10), t10;
      }
      function ne(e10) {
        let t10 = new Uint8Array(e10.length);
        for (let r10 = 0; r10 < e10.length; r10++) {
          let n10 = e10.charCodeAt(r10);
          if (n10 > 127) throw TypeError("non-ASCII string encountered in encode()");
          t10[r10] = n10;
        }
        return t10;
      }
      function nt(e10) {
        if (Uint8Array.fromBase64) return Uint8Array.fromBase64("string" == typeof e10 ? e10 : r3.decode(e10), { alphabet: "base64url" });
        let t10 = e10;
        t10 instanceof Uint8Array && (t10 = r3.decode(t10)), t10 = t10.replace(/-/g, "+").replace(/_/g, "/");
        try {
          var r10 = t10;
          if (Uint8Array.fromBase64) return Uint8Array.fromBase64(r10);
          let e11 = atob(r10), n10 = new Uint8Array(e11.length);
          for (let t11 = 0; t11 < e11.length; t11++) n10[t11] = e11.charCodeAt(t11);
          return n10;
        } catch {
          throw TypeError("The input to be decoded is not correctly encoded.");
        }
      }
      function nr(e10) {
        let t10 = e10;
        return ("string" == typeof t10 && (t10 = r6.encode(t10)), Uint8Array.prototype.toBase64) ? t10.toBase64({ alphabet: "base64url", omitPadding: true }) : function(e11) {
          if (Uint8Array.prototype.toBase64) return e11.toBase64();
          let t11 = [];
          for (let r10 = 0; r10 < e11.length; r10 += 32768) t11.push(String.fromCharCode.apply(null, e11.subarray(r10, r10 + 32768)));
          return btoa(t11.join(""));
        }(t10).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      e.s(["decode", 0, nt, "encode", 0, nr], 22423);
      let nn = Symbol();
      function ni(e10, t10) {
        if (e10) throw TypeError(`${t10} can only be called once`);
      }
      function na(e10, t10, r10) {
        try {
          return nt(e10);
        } catch {
          throw new r10(`Failed to base64url decode the ${t10}`);
        }
      }
      async function ns(e10, t10) {
        let r10 = `SHA-${e10.slice(-3)}`;
        return new Uint8Array(await crypto.subtle.digest(r10, t10));
      }
      let no = (e10, t10 = "algorithm.name") => TypeError(`CryptoKey does not support this operation, its ${t10} must be ${e10}`);
      function nl(e10, t10, r10) {
        switch (t10) {
          case "A128GCM":
          case "A192GCM":
          case "A256GCM": {
            if ("AES-GCM" !== e10.algorithm.name) throw no("AES-GCM");
            let r11 = parseInt(t10.slice(1, 4), 10);
            if (e10.algorithm.length !== r11) throw no(r11, "algorithm.length");
            break;
          }
          case "A128KW":
          case "A192KW":
          case "A256KW": {
            if ("AES-KW" !== e10.algorithm.name) throw no("AES-KW");
            let r11 = parseInt(t10.slice(1, 4), 10);
            if (e10.algorithm.length !== r11) throw no(r11, "algorithm.length");
            break;
          }
          case "ECDH":
            switch (e10.algorithm.name) {
              case "ECDH":
              case "X25519":
                break;
              default:
                throw no("ECDH or X25519");
            }
            break;
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW":
            if ("PBKDF2" !== e10.algorithm.name) throw no("PBKDF2");
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            if ("RSA-OAEP" !== e10.algorithm.name) throw no("RSA-OAEP");
            var n10 = e10.algorithm, i10 = parseInt(t10.slice(9), 10) || 1;
            if (parseInt(n10.hash.name.slice(4), 10) !== i10) throw no(`SHA-${i10}`, "algorithm.hash");
            break;
          default:
            throw TypeError("CryptoKey does not support this operation");
        }
        if (r10 && !e10.usages.includes(r10)) throw TypeError(`CryptoKey does not support this operation, its usages must include ${r10}.`);
      }
      function nc(e10, t10, ...r10) {
        if ((r10 = r10.filter(Boolean)).length > 2) {
          let t11 = r10.pop();
          e10 += `one of type ${r10.join(", ")}, or ${t11}.`;
        } else 2 === r10.length ? e10 += `one of type ${r10[0]} or ${r10[1]}.` : e10 += `of type ${r10[0]}.`;
        return null == t10 ? e10 += ` Received ${t10}` : "function" == typeof t10 && t10.name ? e10 += ` Received function ${t10.name}` : "object" == typeof t10 && null != t10 && t10.constructor?.name && (e10 += ` Received an instance of ${t10.constructor.name}`), e10;
      }
      let nu = (e10, ...t10) => nc("Key must be ", e10, ...t10), nh = (e10, t10, ...r10) => nc(`Key for the ${e10} algorithm must be `, t10, ...r10);
      class nd extends Error {
        static code = "ERR_JOSE_GENERIC";
        code = "ERR_JOSE_GENERIC";
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class np extends nd {
        static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        claim;
        reason;
        payload;
        constructor(e10, t10, r10 = "unspecified", n10 = "unspecified") {
          super(e10, { cause: { claim: r10, reason: n10, payload: t10 } }), this.claim = r10, this.reason = n10, this.payload = t10;
        }
      }
      class nf extends nd {
        static code = "ERR_JWT_EXPIRED";
        code = "ERR_JWT_EXPIRED";
        claim;
        reason;
        payload;
        constructor(e10, t10, r10 = "unspecified", n10 = "unspecified") {
          super(e10, { cause: { claim: r10, reason: n10, payload: t10 } }), this.claim = r10, this.reason = n10, this.payload = t10;
        }
      }
      class ng extends nd {
        static code = "ERR_JOSE_ALG_NOT_ALLOWED";
        code = "ERR_JOSE_ALG_NOT_ALLOWED";
      }
      class nm extends nd {
        static code = "ERR_JOSE_NOT_SUPPORTED";
        code = "ERR_JOSE_NOT_SUPPORTED";
      }
      class ny extends nd {
        static code = "ERR_JWE_DECRYPTION_FAILED";
        code = "ERR_JWE_DECRYPTION_FAILED";
        constructor(e10 = "decryption operation failed", t10) {
          super(e10, t10);
        }
      }
      class nb extends nd {
        static code = "ERR_JWE_INVALID";
        code = "ERR_JWE_INVALID";
      }
      class nw extends nd {
        static code = "ERR_JWT_INVALID";
        code = "ERR_JWT_INVALID";
      }
      class nv extends nd {
        static code = "ERR_JWK_INVALID";
        code = "ERR_JWK_INVALID";
      }
      class n_ extends nd {
        [Symbol.asyncIterator];
        static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        constructor(e10 = "multiple matching keys found in the JSON Web Key Set", t10) {
          super(e10, t10);
        }
      }
      function nx(e10) {
        if (!nE(e10)) throw Error("CryptoKey instance expected");
      }
      let nE = (e10) => {
        if (e10?.[Symbol.toStringTag] === "CryptoKey") return true;
        try {
          return e10 instanceof CryptoKey;
        } catch {
          return false;
        }
      }, nk = (e10) => e10?.[Symbol.toStringTag] === "KeyObject", nS = (e10) => nE(e10) || nk(e10);
      function nT(e10) {
        switch (e10) {
          case "A128GCM":
            return 128;
          case "A192GCM":
            return 192;
          case "A256GCM":
          case "A128CBC-HS256":
            return 256;
          case "A192CBC-HS384":
            return 384;
          case "A256CBC-HS512":
            return 512;
          default:
            throw new nm(`Unsupported JWE Algorithm: ${e10}`);
        }
      }
      let nA = (e10) => crypto.getRandomValues(new Uint8Array(nT(e10) >> 3));
      function nR(e10, t10) {
        let r10 = e10.byteLength << 3;
        if (r10 !== t10) throw new nb(`Invalid Content Encryption Key length. Expected ${t10} bits, got ${r10} bits`);
      }
      function nC(e10) {
        switch (e10) {
          case "A128GCM":
          case "A128GCMKW":
          case "A192GCM":
          case "A192GCMKW":
          case "A256GCM":
          case "A256GCMKW":
            return 96;
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return 128;
          default:
            throw new nm(`Unsupported JWE Algorithm: ${e10}`);
        }
      }
      function nO(e10, t10) {
        if (t10.length << 3 !== nC(e10)) throw new nb("Invalid Initialization Vector length");
      }
      async function nP(e10, t10, r10) {
        if (!(t10 instanceof Uint8Array)) throw TypeError(nu(t10, "Uint8Array"));
        let n10 = parseInt(e10.slice(1, 4), 10);
        return { encKey: await crypto.subtle.importKey("raw", t10.subarray(n10 >> 3), "AES-CBC", false, [r10]), macKey: await crypto.subtle.importKey("raw", t10.subarray(0, n10 >> 3), { hash: `SHA-${n10 << 1}`, name: "HMAC" }, false, ["sign"]), keySize: n10 };
      }
      async function nI(e10, t10, r10) {
        return new Uint8Array((await crypto.subtle.sign("HMAC", e10, t10)).slice(0, r10 >> 3));
      }
      async function nj(e10, t10, r10, n10, i10) {
        let { encKey: a10, macKey: s10, keySize: o10 } = await nP(e10, r10, "encrypt"), l10 = new Uint8Array(await crypto.subtle.encrypt({ iv: n10, name: "AES-CBC" }, a10, t10)), c10 = r4(i10, n10, l10, r9(i10.length << 3));
        return { ciphertext: l10, tag: await nI(s10, c10, o10), iv: n10 };
      }
      async function n$(e10, t10) {
        if (!(e10 instanceof Uint8Array)) throw TypeError("First argument must be a buffer");
        if (!(t10 instanceof Uint8Array)) throw TypeError("Second argument must be a buffer");
        let r10 = { name: "HMAC", hash: "SHA-256" }, n10 = await crypto.subtle.generateKey(r10, false, ["sign"]), i10 = new Uint8Array(await crypto.subtle.sign(r10, n10, e10)), a10 = new Uint8Array(await crypto.subtle.sign(r10, n10, t10)), s10 = 0, o10 = -1;
        for (; ++o10 < 32; ) s10 |= i10[o10] ^ a10[o10];
        return 0 === s10;
      }
      async function nN(e10, t10, r10, n10, i10, a10) {
        let s10, o10, { encKey: l10, macKey: c10, keySize: u10 } = await nP(e10, t10, "decrypt"), h10 = r4(a10, n10, r10, r9(a10.length << 3)), d2 = await nI(c10, h10, u10);
        try {
          s10 = await n$(i10, d2);
        } catch {
        }
        if (!s10) throw new ny();
        try {
          o10 = new Uint8Array(await crypto.subtle.decrypt({ iv: n10, name: "AES-CBC" }, l10, r10));
        } catch {
        }
        if (!o10) throw new ny();
        return o10;
      }
      async function nU(e10, t10, r10, n10, i10) {
        let a10;
        r10 instanceof Uint8Array ? a10 = await crypto.subtle.importKey("raw", r10, "AES-GCM", false, ["encrypt"]) : (nl(r10, e10, "encrypt"), a10 = r10);
        let s10 = new Uint8Array(await crypto.subtle.encrypt({ additionalData: i10, iv: n10, name: "AES-GCM", tagLength: 128 }, a10, t10)), o10 = s10.slice(-16);
        return { ciphertext: s10.slice(0, -16), tag: o10, iv: n10 };
      }
      async function nD(e10, t10, r10, n10, i10, a10) {
        let s10;
        t10 instanceof Uint8Array ? s10 = await crypto.subtle.importKey("raw", t10, "AES-GCM", false, ["decrypt"]) : (nl(t10, e10, "decrypt"), s10 = t10);
        try {
          return new Uint8Array(await crypto.subtle.decrypt({ additionalData: a10, iv: n10, name: "AES-GCM", tagLength: 128 }, s10, r4(r10, i10)));
        } catch {
          throw new ny();
        }
      }
      let nL = "Unsupported JWE Content Encryption Algorithm";
      async function nM(e10, t10, r10, n10, i10) {
        if (!nE(r10) && !(r10 instanceof Uint8Array)) throw TypeError(nu(r10, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
        if (n10) nO(e10, n10);
        else n10 = crypto.getRandomValues(new Uint8Array(nC(e10) >> 3));
        switch (e10) {
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return r10 instanceof Uint8Array && nR(r10, parseInt(e10.slice(-3), 10)), nj(e10, t10, r10, n10, i10);
          case "A128GCM":
          case "A192GCM":
          case "A256GCM":
            return r10 instanceof Uint8Array && nR(r10, parseInt(e10.slice(1, 4), 10)), nU(e10, t10, r10, n10, i10);
          default:
            throw new nm(nL);
        }
      }
      async function nH(e10, t10, r10, n10, i10, a10) {
        if (!nE(t10) && !(t10 instanceof Uint8Array)) throw TypeError(nu(t10, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
        if (!n10) throw new nb("JWE Initialization Vector missing");
        if (!i10) throw new nb("JWE Authentication Tag missing");
        switch (nO(e10, n10), e10) {
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return t10 instanceof Uint8Array && nR(t10, parseInt(e10.slice(-3), 10)), nN(e10, t10, r10, n10, i10, a10);
          case "A128GCM":
          case "A192GCM":
          case "A256GCM":
            return t10 instanceof Uint8Array && nR(t10, parseInt(e10.slice(1, 4), 10)), nD(e10, t10, r10, n10, i10, a10);
          default:
            throw new nm(nL);
        }
      }
      function nB(e10, t10) {
        if (e10.algorithm.length !== parseInt(t10.slice(1, 4), 10)) throw TypeError(`Invalid key size for alg: ${t10}`);
      }
      function nW(e10, t10, r10) {
        return e10 instanceof Uint8Array ? crypto.subtle.importKey("raw", e10, "AES-KW", true, [r10]) : (nl(e10, t10, r10), e10);
      }
      async function nq(e10, t10, r10) {
        let n10 = await nW(t10, e10, "wrapKey");
        nB(n10, e10);
        let i10 = await crypto.subtle.importKey("raw", r10, { hash: "SHA-256", name: "HMAC" }, true, ["sign"]);
        return new Uint8Array(await crypto.subtle.wrapKey("raw", i10, n10, "AES-KW"));
      }
      async function nK(e10, t10, r10) {
        let n10 = await nW(t10, e10, "unwrapKey");
        nB(n10, e10);
        let i10 = await crypto.subtle.unwrapKey("raw", r10, n10, "AES-KW", { hash: "SHA-256", name: "HMAC" }, true, ["sign"]);
        return new Uint8Array(await crypto.subtle.exportKey("raw", i10));
      }
      function nJ(e10) {
        return r4(r7(e10.length), e10);
      }
      async function nF(e10, t10, r10) {
        let n10 = t10 >> 3, i10 = Math.ceil(n10 / 32), a10 = new Uint8Array(32 * i10);
        for (let t11 = 1; t11 <= i10; t11++) {
          let n11 = new Uint8Array(4 + e10.length + r10.length);
          n11.set(r7(t11), 0), n11.set(e10, 4), n11.set(r10, 4 + e10.length);
          let i11 = await ns("sha256", n11);
          a10.set(i11, (t11 - 1) * 32);
        }
        return a10.slice(0, n10);
      }
      async function nz(e10, t10, r10, n10, i10 = new Uint8Array(), a10 = new Uint8Array()) {
        var s10;
        nl(e10, "ECDH"), nl(t10, "ECDH", "deriveBits");
        let o10 = r4(nJ(ne(r10)), nJ(i10), nJ(a10), r7(n10), new Uint8Array());
        return nF(new Uint8Array(await crypto.subtle.deriveBits({ name: e10.algorithm.name, public: e10 }, t10, "X25519" === (s10 = e10).algorithm.name ? 256 : Math.ceil(parseInt(s10.algorithm.namedCurve.slice(-3), 10) / 8) << 3)), n10, o10);
      }
      function nV(e10) {
        switch (e10.algorithm.namedCurve) {
          case "P-256":
          case "P-384":
          case "P-521":
            return true;
          default:
            return "X25519" === e10.algorithm.name;
        }
      }
      async function nG(e10, t10, r10, n10) {
        if (!(e10 instanceof Uint8Array) || e10.length < 8) throw new nb("PBES2 Salt Input must be 8 or more octets");
        if (!Number.isSafeInteger(r10) || 1 !== Math.sign(r10)) throw new nb("PBES2 Count Input must be a positive integer");
        let i10 = r4(ne(t10), Uint8Array.of(0), e10), a10 = parseInt(t10.slice(13, 16), 10), s10 = { hash: `SHA-${t10.slice(8, 11)}`, iterations: r10, name: "PBKDF2", salt: i10 }, o10 = await (n10 instanceof Uint8Array ? crypto.subtle.importKey("raw", n10, "PBKDF2", false, ["deriveBits"]) : (nl(n10, t10, "deriveBits"), n10));
        return new Uint8Array(await crypto.subtle.deriveBits(s10, o10, a10));
      }
      async function nX(e10, t10, r10, n10 = 2048, i10 = crypto.getRandomValues(new Uint8Array(16))) {
        let a10 = await nG(i10, e10, n10, t10);
        return { encryptedKey: await nq(e10.slice(-6), a10, r10), p2c: n10, p2s: nr(i10) };
      }
      async function nY(e10, t10, r10, n10, i10) {
        let a10 = await nG(i10, e10, n10, t10);
        return nK(e10.slice(-6), a10, r10);
      }
      function nZ(e10, t10) {
        if (e10.startsWith("RS") || e10.startsWith("PS")) {
          let { modulusLength: r10 } = t10.algorithm;
          if ("number" != typeof r10 || r10 < 2048) throw TypeError(`${e10} requires key modulusLength to be 2048 bits or larger`);
        }
      }
      let nQ = (e10) => {
        switch (e10) {
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            return "RSA-OAEP";
          default:
            throw new nm(`alg ${e10} is not supported either by JOSE or your javascript runtime`);
        }
      };
      async function n0(e10, t10, r10) {
        return nl(t10, e10, "encrypt"), nZ(e10, t10), new Uint8Array(await crypto.subtle.encrypt(nQ(e10), t10, r10));
      }
      async function n1(e10, t10, r10) {
        return nl(t10, e10, "decrypt"), nZ(e10, t10), new Uint8Array(await crypto.subtle.decrypt(nQ(e10), t10, r10));
      }
      function n2(e10) {
        if ("object" != typeof e10 || null === e10 || "[object Object]" !== Object.prototype.toString.call(e10)) return false;
        if (null === Object.getPrototypeOf(e10)) return true;
        let t10 = e10;
        for (; null !== Object.getPrototypeOf(t10); ) t10 = Object.getPrototypeOf(t10);
        return Object.getPrototypeOf(e10) === t10;
      }
      function n5(...e10) {
        let t10, r10 = e10.filter(Boolean);
        if (0 === r10.length || 1 === r10.length) return true;
        for (let e11 of r10) {
          let r11 = Object.keys(e11);
          if (!t10 || 0 === t10.size) {
            t10 = new Set(r11);
            continue;
          }
          for (let e12 of r11) {
            if (t10.has(e12)) return false;
            t10.add(e12);
          }
        }
        return true;
      }
      let n6 = (e10) => n2(e10) && "string" == typeof e10.kty, n3 = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value';
      async function n4(e10) {
        if (!e10.alg) throw TypeError('"alg" argument is required when "jwk.alg" is not present');
        let { algorithm: t10, keyUsages: r10 } = function(e11) {
          let t11, r11;
          switch (e11.kty) {
            case "AKP":
              switch (e11.alg) {
                case "ML-DSA-44":
                case "ML-DSA-65":
                case "ML-DSA-87":
                  t11 = { name: e11.alg }, r11 = e11.priv ? ["sign"] : ["verify"];
                  break;
                default:
                  throw new nm(n3);
              }
              break;
            case "RSA":
              switch (e11.alg) {
                case "PS256":
                case "PS384":
                case "PS512":
                  t11 = { name: "RSA-PSS", hash: `SHA-${e11.alg.slice(-3)}` }, r11 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RS256":
                case "RS384":
                case "RS512":
                  t11 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e11.alg.slice(-3)}` }, r11 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RSA-OAEP":
                case "RSA-OAEP-256":
                case "RSA-OAEP-384":
                case "RSA-OAEP-512":
                  t11 = { name: "RSA-OAEP", hash: `SHA-${parseInt(e11.alg.slice(-3), 10) || 1}` }, r11 = e11.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
                  break;
                default:
                  throw new nm(n3);
              }
              break;
            case "EC":
              switch (e11.alg) {
                case "ES256":
                case "ES384":
                case "ES512":
                  t11 = { name: "ECDSA", namedCurve: { ES256: "P-256", ES384: "P-384", ES512: "P-521" }[e11.alg] }, r11 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t11 = { name: "ECDH", namedCurve: e11.crv }, r11 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new nm(n3);
              }
              break;
            case "OKP":
              switch (e11.alg) {
                case "Ed25519":
                case "EdDSA":
                  t11 = { name: "Ed25519" }, r11 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t11 = { name: e11.crv }, r11 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new nm(n3);
              }
              break;
            default:
              throw new nm('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
          }
          return { algorithm: t11, keyUsages: r11 };
        }(e10), n10 = { ...e10 };
        return "AKP" !== n10.kty && delete n10.alg, delete n10.use, crypto.subtle.importKey("jwk", n10, t10, e10.ext ?? (!e10.d && !e10.priv), e10.key_ops ?? r10);
      }
      let n8 = "given KeyObject instance cannot be used for this algorithm", n9 = async (e10, t10, r10, i10 = false) => {
        let a10 = (n ||= /* @__PURE__ */ new WeakMap()).get(e10);
        if (a10?.[r10]) return a10[r10];
        let s10 = await n4({ ...t10, alg: r10 });
        return i10 && Object.freeze(e10), a10 ? a10[r10] = s10 : n.set(e10, { [r10]: s10 }), s10;
      };
      async function n7(e10, t10) {
        if (e10 instanceof Uint8Array || nE(e10)) return e10;
        if (nk(e10)) {
          if ("secret" === e10.type) return e10.export();
          if ("toCryptoKey" in e10 && "function" == typeof e10.toCryptoKey) try {
            return ((e11, t11) => {
              let r11, i10 = (n ||= /* @__PURE__ */ new WeakMap()).get(e11);
              if (i10?.[t11]) return i10[t11];
              let a10 = "public" === e11.type, s10 = !!a10;
              if ("x25519" === e11.asymmetricKeyType) {
                switch (t11) {
                  case "ECDH-ES":
                  case "ECDH-ES+A128KW":
                  case "ECDH-ES+A192KW":
                  case "ECDH-ES+A256KW":
                    break;
                  default:
                    throw TypeError(n8);
                }
                r11 = e11.toCryptoKey(e11.asymmetricKeyType, s10, a10 ? [] : ["deriveBits"]);
              }
              if ("ed25519" === e11.asymmetricKeyType) {
                if ("EdDSA" !== t11 && "Ed25519" !== t11) throw TypeError(n8);
                r11 = e11.toCryptoKey(e11.asymmetricKeyType, s10, [a10 ? "verify" : "sign"]);
              }
              switch (e11.asymmetricKeyType) {
                case "ml-dsa-44":
                case "ml-dsa-65":
                case "ml-dsa-87":
                  if (t11 !== e11.asymmetricKeyType.toUpperCase()) throw TypeError(n8);
                  r11 = e11.toCryptoKey(e11.asymmetricKeyType, s10, [a10 ? "verify" : "sign"]);
              }
              if ("rsa" === e11.asymmetricKeyType) {
                let n10;
                switch (t11) {
                  case "RSA-OAEP":
                    n10 = "SHA-1";
                    break;
                  case "RS256":
                  case "PS256":
                  case "RSA-OAEP-256":
                    n10 = "SHA-256";
                    break;
                  case "RS384":
                  case "PS384":
                  case "RSA-OAEP-384":
                    n10 = "SHA-384";
                    break;
                  case "RS512":
                  case "PS512":
                  case "RSA-OAEP-512":
                    n10 = "SHA-512";
                    break;
                  default:
                    throw TypeError(n8);
                }
                if (t11.startsWith("RSA-OAEP")) return e11.toCryptoKey({ name: "RSA-OAEP", hash: n10 }, s10, a10 ? ["encrypt"] : ["decrypt"]);
                r11 = e11.toCryptoKey({ name: t11.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5", hash: n10 }, s10, [a10 ? "verify" : "sign"]);
              }
              if ("ec" === e11.asymmetricKeyType) {
                let n10 = (/* @__PURE__ */ new Map([["prime256v1", "P-256"], ["secp384r1", "P-384"], ["secp521r1", "P-521"]])).get(e11.asymmetricKeyDetails?.namedCurve);
                if (!n10) throw TypeError(n8);
                let i11 = { ES256: "P-256", ES384: "P-384", ES512: "P-521" };
                i11[t11] && n10 === i11[t11] && (r11 = e11.toCryptoKey({ name: "ECDSA", namedCurve: n10 }, s10, [a10 ? "verify" : "sign"])), t11.startsWith("ECDH-ES") && (r11 = e11.toCryptoKey({ name: "ECDH", namedCurve: n10 }, s10, a10 ? [] : ["deriveBits"]));
              }
              if (!r11) throw TypeError(n8);
              return i10 ? i10[t11] = r11 : n.set(e11, { [t11]: r11 }), r11;
            })(e10, t10);
          } catch (e11) {
            if (e11 instanceof TypeError) throw e11;
          }
          let r10 = e10.export({ format: "jwk" });
          return n9(e10, r10, t10);
        }
        if (n6(e10)) return e10.k ? nt(e10.k) : n9(e10, e10, t10, true);
        throw Error("unreachable");
      }
      async function ie(e10, t10, r10) {
        let n10;
        if (!n2(e10)) throw TypeError("JWK must be an object");
        switch (t10 ??= e10.alg, n10 ??= r10?.extractable ?? e10.ext, e10.kty) {
          case "oct":
            if ("string" != typeof e10.k || !e10.k) throw TypeError('missing "k" (Key Value) Parameter value');
            return nt(e10.k);
          case "RSA":
            if ("oth" in e10 && void 0 !== e10.oth) throw new nm('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
            return n4({ ...e10, alg: t10, ext: n10 });
          case "AKP":
            if ("string" != typeof e10.alg || !e10.alg) throw TypeError('missing "alg" (Algorithm) Parameter value');
            if (void 0 !== t10 && t10 !== e10.alg) throw TypeError("JWK alg and alg option value mismatch");
            return n4({ ...e10, ext: n10 });
          case "EC":
          case "OKP":
            return n4({ ...e10, alg: t10, ext: n10 });
          default:
            throw new nm('Unsupported "kty" (Key Type) Parameter value');
        }
      }
      async function it(e10) {
        if (nk(e10)) if ("secret" !== e10.type) return e10.export({ format: "jwk" });
        else e10 = e10.export();
        if (e10 instanceof Uint8Array) return { kty: "oct", k: nr(e10) };
        if (!nE(e10)) throw TypeError(nu(e10, "CryptoKey", "KeyObject", "Uint8Array"));
        if (!e10.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
        let { ext: t10, key_ops: r10, alg: n10, use: i10, ...a10 } = await crypto.subtle.exportKey("jwk", e10);
        return "AKP" === a10.kty && (a10.alg = n10), a10;
      }
      async function ir(e10) {
        return it(e10);
      }
      async function ii(e10, t10, r10, n10) {
        let i10 = e10.slice(0, 7), a10 = await nM(i10, r10, t10, n10, new Uint8Array());
        return { encryptedKey: a10.ciphertext, iv: nr(a10.iv), tag: nr(a10.tag) };
      }
      async function ia(e10, t10, r10, n10, i10) {
        return nH(e10.slice(0, 7), t10, r10, n10, i10, new Uint8Array());
      }
      let is = 'Invalid or unsupported "alg" (JWE Algorithm) header value';
      function io(e10) {
        if (void 0 === e10) throw new nb("JWE Encrypted Key missing");
      }
      async function il(e10, t10, r10, n10, i10) {
        switch (e10) {
          case "dir":
            if (void 0 !== r10) throw new nb("Encountered unexpected JWE Encrypted Key");
            return t10;
          case "ECDH-ES":
            if (void 0 !== r10) throw new nb("Encountered unexpected JWE Encrypted Key");
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            let i11, a10;
            if (!n2(n10.epk)) throw new nb('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
            if (nx(t10), !nV(t10)) throw new nm("ECDH with the provided key is not allowed or not supported by your javascript runtime");
            let s10 = await ie(n10.epk, e10);
            if (nx(s10), void 0 !== n10.apu) {
              if ("string" != typeof n10.apu) throw new nb('JOSE Header "apu" (Agreement PartyUInfo) invalid');
              i11 = na(n10.apu, "apu", nb);
            }
            if (void 0 !== n10.apv) {
              if ("string" != typeof n10.apv) throw new nb('JOSE Header "apv" (Agreement PartyVInfo) invalid');
              a10 = na(n10.apv, "apv", nb);
            }
            let o10 = await nz(s10, t10, "ECDH-ES" === e10 ? n10.enc : e10, "ECDH-ES" === e10 ? nT(n10.enc) : parseInt(e10.slice(-5, -2), 10), i11, a10);
            if ("ECDH-ES" === e10) return o10;
            return io(r10), nK(e10.slice(-6), o10, r10);
          }
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            return io(r10), nx(t10), n1(e10, t10, r10);
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW": {
            let a10;
            if (io(r10), "number" != typeof n10.p2c) throw new nb('JOSE Header "p2c" (PBES2 Count) missing or invalid');
            let s10 = i10?.maxPBES2Count || 1e4;
            if (n10.p2c > s10) throw new nb('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
            if ("string" != typeof n10.p2s) throw new nb('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
            return a10 = na(n10.p2s, "p2s", nb), nY(e10, t10, r10, n10.p2c, a10);
          }
          case "A128KW":
          case "A192KW":
          case "A256KW":
            return io(r10), nK(e10, t10, r10);
          case "A128GCMKW":
          case "A192GCMKW":
          case "A256GCMKW":
            if (io(r10), "string" != typeof n10.iv) throw new nb('JOSE Header "iv" (Initialization Vector) missing or invalid');
            if ("string" != typeof n10.tag) throw new nb('JOSE Header "tag" (Authentication Tag) missing or invalid');
            return ia(e10, t10, r10, na(n10.iv, "iv", nb), na(n10.tag, "tag", nb));
          default:
            throw new nm(is);
        }
      }
      async function ic(e10, t10, r10, n10, i10 = {}) {
        let a10, s10, o10;
        switch (e10) {
          case "dir":
            o10 = r10;
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            let l10;
            if (nx(r10), !nV(r10)) throw new nm("ECDH with the provided key is not allowed or not supported by your javascript runtime");
            let { apu: c10, apv: u10 } = i10;
            l10 = i10.epk ? await n7(i10.epk, e10) : (await crypto.subtle.generateKey(r10.algorithm, true, ["deriveBits"])).privateKey;
            let { x: h10, y: d2, crv: p2, kty: f2 } = await ir(l10), g2 = await nz(r10, l10, "ECDH-ES" === e10 ? t10 : e10, "ECDH-ES" === e10 ? nT(t10) : parseInt(e10.slice(-5, -2), 10), c10, u10);
            if (s10 = { epk: { x: h10, crv: p2, kty: f2 } }, "EC" === f2 && (s10.epk.y = d2), c10 && (s10.apu = nr(c10)), u10 && (s10.apv = nr(u10)), "ECDH-ES" === e10) {
              o10 = g2;
              break;
            }
            o10 = n10 || nA(t10);
            let m2 = e10.slice(-6);
            a10 = await nq(m2, g2, o10);
            break;
          }
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            o10 = n10 || nA(t10), nx(r10), a10 = await n0(e10, r10, o10);
            break;
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW": {
            o10 = n10 || nA(t10);
            let { p2c: l10, p2s: c10 } = i10;
            ({ encryptedKey: a10, ...s10 } = await nX(e10, r10, o10, l10, c10));
            break;
          }
          case "A128KW":
          case "A192KW":
          case "A256KW":
            o10 = n10 || nA(t10), a10 = await nq(e10, r10, o10);
            break;
          case "A128GCMKW":
          case "A192GCMKW":
          case "A256GCMKW": {
            o10 = n10 || nA(t10);
            let { iv: l10 } = i10;
            ({ encryptedKey: a10, ...s10 } = await ii(e10, r10, o10, l10));
            break;
          }
          default:
            throw new nm(is);
        }
        return { cek: o10, encryptedKey: a10, parameters: s10 };
      }
      function iu(e10, t10, r10, n10, i10) {
        let a10;
        if (void 0 !== i10.crit && n10?.crit === void 0) throw new e10('"crit" (Critical) Header Parameter MUST be integrity protected');
        if (!n10 || void 0 === n10.crit) return /* @__PURE__ */ new Set();
        if (!Array.isArray(n10.crit) || 0 === n10.crit.length || n10.crit.some((e11) => "string" != typeof e11 || 0 === e11.length)) throw new e10('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
        for (let s10 of (a10 = void 0 !== r10 ? new Map([...Object.entries(r10), ...t10.entries()]) : t10, n10.crit)) {
          if (!a10.has(s10)) throw new nm(`Extension Header Parameter "${s10}" is not recognized`);
          if (void 0 === i10[s10]) throw new e10(`Extension Header Parameter "${s10}" is missing`);
          if (a10.get(s10) && void 0 === n10[s10]) throw new e10(`Extension Header Parameter "${s10}" MUST be integrity protected`);
        }
        return new Set(n10.crit);
      }
      let ih = (e10) => e10?.[Symbol.toStringTag], id = (e10, t10, r10) => {
        if (void 0 !== t10.use) {
          let e11;
          switch (r10) {
            case "sign":
            case "verify":
              e11 = "sig";
              break;
            case "encrypt":
            case "decrypt":
              e11 = "enc";
          }
          if (t10.use !== e11) throw TypeError(`Invalid key for this operation, its "use" must be "${e11}" when present`);
        }
        if (void 0 !== t10.alg && t10.alg !== e10) throw TypeError(`Invalid key for this operation, its "alg" must be "${e10}" when present`);
        if (Array.isArray(t10.key_ops)) {
          let n10;
          switch (true) {
            case ("sign" === r10 || "verify" === r10):
            case "dir" === e10:
            case e10.includes("CBC-HS"):
              n10 = r10;
              break;
            case e10.startsWith("PBES2"):
              n10 = "deriveBits";
              break;
            case /^A\d{3}(?:GCM)?(?:KW)?$/.test(e10):
              n10 = !e10.includes("GCM") && e10.endsWith("KW") ? "encrypt" === r10 ? "wrapKey" : "unwrapKey" : r10;
              break;
            case ("encrypt" === r10 && e10.startsWith("RSA")):
              n10 = "wrapKey";
              break;
            case "decrypt" === r10:
              n10 = e10.startsWith("RSA") ? "unwrapKey" : "deriveBits";
          }
          if (n10 && t10.key_ops?.includes?.(n10) === false) throw TypeError(`Invalid key for this operation, its "key_ops" must include "${n10}" when present`);
        }
        return true;
      };
      function ip(e10, t10, r10) {
        switch (e10.substring(0, 2)) {
          case "A1":
          case "A2":
          case "di":
          case "HS":
          case "PB":
            ((e11, t11, r11) => {
              if (!(t11 instanceof Uint8Array)) {
                if (n6(t11)) {
                  if ("oct" === t11.kty && "string" == typeof t11.k && id(e11, t11, r11)) return;
                  throw TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
                }
                if (!nS(t11)) throw TypeError(nh(e11, t11, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
                if ("secret" !== t11.type) throw TypeError(`${ih(t11)} instances for symmetric algorithms must be of type "secret"`);
              }
            })(e10, t10, r10);
            break;
          default:
            ((e11, t11, r11) => {
              if (n6(t11)) switch (r11) {
                case "decrypt":
                case "sign":
                  if ("oct" !== t11.kty && ("AKP" === t11.kty && "string" == typeof t11.priv || "string" == typeof t11.d) && id(e11, t11, r11)) return;
                  throw TypeError("JSON Web Key for this operation must be a private JWK");
                case "encrypt":
                case "verify":
                  if ("oct" !== t11.kty && void 0 === t11.d && void 0 === t11.priv && id(e11, t11, r11)) return;
                  throw TypeError("JSON Web Key for this operation must be a public JWK");
              }
              if (!nS(t11)) throw TypeError(nh(e11, t11, "CryptoKey", "KeyObject", "JSON Web Key"));
              if ("secret" === t11.type) throw TypeError(`${ih(t11)} instances for asymmetric algorithms must not be of type "secret"`);
              if ("public" === t11.type) switch (r11) {
                case "sign":
                  throw TypeError(`${ih(t11)} instances for asymmetric algorithm signing must be of type "private"`);
                case "decrypt":
                  throw TypeError(`${ih(t11)} instances for asymmetric algorithm decryption must be of type "private"`);
              }
              if ("private" === t11.type) switch (r11) {
                case "verify":
                  throw TypeError(`${ih(t11)} instances for asymmetric algorithm verifying must be of type "public"`);
                case "encrypt":
                  throw TypeError(`${ih(t11)} instances for asymmetric algorithm encryption must be of type "public"`);
              }
            })(e10, t10, r10);
        }
      }
      function ig(e10) {
        if (void 0 === globalThis[e10]) throw new nm(`JWE "zip" (Compression Algorithm) Header Parameter requires the ${e10} API.`);
      }
      async function im(e10) {
        ig("CompressionStream");
        let t10 = new CompressionStream("deflate-raw"), r10 = t10.writable.getWriter();
        r10.write(e10).catch(() => {
        }), r10.close().catch(() => {
        });
        let n10 = [], i10 = t10.readable.getReader();
        for (; ; ) {
          let { value: e11, done: t11 } = await i10.read();
          if (t11) break;
          n10.push(e11);
        }
        return r4(...n10);
      }
      async function iy(e10, t10) {
        ig("DecompressionStream");
        let r10 = new DecompressionStream("deflate-raw"), n10 = r10.writable.getWriter();
        n10.write(e10).catch(() => {
        }), n10.close().catch(() => {
        });
        let i10 = [], a10 = 0, s10 = r10.readable.getReader();
        for (; ; ) {
          let { value: e11, done: r11 } = await s10.read();
          if (r11) break;
          if (i10.push(e11), a10 += e11.byteLength, t10 !== 1 / 0 && a10 > t10) throw new nb("Decompressed plaintext exceeded the configured limit");
        }
        return r4(...i10);
      }
      class ib {
        #t;
        #r;
        #n;
        #i;
        #a;
        #s;
        #o;
        #l;
        constructor(e10) {
          if (!(e10 instanceof Uint8Array)) throw TypeError("plaintext must be an instance of Uint8Array");
          this.#t = e10;
        }
        setKeyManagementParameters(e10) {
          return ni(this.#l, "setKeyManagementParameters"), this.#l = e10, this;
        }
        setProtectedHeader(e10) {
          return ni(this.#r, "setProtectedHeader"), this.#r = e10, this;
        }
        setSharedUnprotectedHeader(e10) {
          return ni(this.#n, "setSharedUnprotectedHeader"), this.#n = e10, this;
        }
        setUnprotectedHeader(e10) {
          return ni(this.#i, "setUnprotectedHeader"), this.#i = e10, this;
        }
        setAdditionalAuthenticatedData(e10) {
          return this.#a = e10, this;
        }
        setContentEncryptionKey(e10) {
          return ni(this.#s, "setContentEncryptionKey"), this.#s = e10, this;
        }
        setInitializationVector(e10) {
          return ni(this.#o, "setInitializationVector"), this.#o = e10, this;
        }
        async encrypt(e10, t10) {
          let r10, n10, i10, a10, s10, o10;
          if (!this.#r && !this.#i && !this.#n) throw new nb("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
          if (!n5(this.#r, this.#i, this.#n)) throw new nb("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
          let l10 = { ...this.#r, ...this.#i, ...this.#n };
          if (iu(nb, /* @__PURE__ */ new Map(), t10?.crit, this.#r, l10), void 0 !== l10.zip && "DEF" !== l10.zip) throw new nm('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
          if (void 0 !== l10.zip && !this.#r?.zip) throw new nb('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
          let { alg: c10, enc: u10 } = l10;
          if ("string" != typeof c10 || !c10) throw new nb('JWE "alg" (Algorithm) Header Parameter missing or invalid');
          if ("string" != typeof u10 || !u10) throw new nb('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
          if (this.#s && ("dir" === c10 || "ECDH-ES" === c10)) throw TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${c10}`);
          ip("dir" === c10 ? u10 : c10, e10, "encrypt");
          {
            let i11, a11 = await n7(e10, c10);
            ({ cek: n10, encryptedKey: r10, parameters: i11 } = await ic(c10, u10, a11, this.#s, this.#l)), i11 && (t10 && nn in t10 ? this.#i ? this.#i = { ...this.#i, ...i11 } : this.setUnprotectedHeader(i11) : this.#r ? this.#r = { ...this.#r, ...i11 } : this.setProtectedHeader(i11));
          }
          if (this.#r ? s10 = ne(a10 = nr(JSON.stringify(this.#r))) : (a10 = "", s10 = new Uint8Array()), this.#a) {
            let e11 = ne(o10 = nr(this.#a));
            i10 = r4(s10, ne("."), e11);
          } else i10 = s10;
          let h10 = this.#t;
          "DEF" === l10.zip && (h10 = await im(h10).catch((e11) => {
            throw new nb("Failed to compress plaintext", { cause: e11 });
          }));
          let { ciphertext: d2, tag: p2, iv: f2 } = await nM(u10, h10, n10, this.#o, i10), g2 = { ciphertext: nr(d2) };
          return f2 && (g2.iv = nr(f2)), p2 && (g2.tag = nr(p2)), r10 && (g2.encrypted_key = nr(r10)), o10 && (g2.aad = o10), this.#r && (g2.protected = a10), this.#n && (g2.unprotected = this.#n), this.#i && (g2.header = this.#i), g2;
        }
      }
      class iw {
        #c;
        constructor(e10) {
          this.#c = new ib(e10);
        }
        setContentEncryptionKey(e10) {
          return this.#c.setContentEncryptionKey(e10), this;
        }
        setInitializationVector(e10) {
          return this.#c.setInitializationVector(e10), this;
        }
        setProtectedHeader(e10) {
          return this.#c.setProtectedHeader(e10), this;
        }
        setKeyManagementParameters(e10) {
          return this.#c.setKeyManagementParameters(e10), this;
        }
        async encrypt(e10, t10) {
          let r10 = await this.#c.encrypt(e10, t10);
          return [r10.protected, r10.encrypted_key, r10.iv, r10.ciphertext, r10.tag].join(".");
        }
      }
      let iv = (e10) => Math.floor(e10.getTime() / 1e3), i_ = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
      function ix(e10) {
        let t10, r10 = i_.exec(e10);
        if (!r10 || r10[4] && r10[1]) throw TypeError("Invalid time period format");
        let n10 = parseFloat(r10[2]);
        switch (r10[3].toLowerCase()) {
          case "sec":
          case "secs":
          case "second":
          case "seconds":
          case "s":
            t10 = Math.round(n10);
            break;
          case "minute":
          case "minutes":
          case "min":
          case "mins":
          case "m":
            t10 = Math.round(60 * n10);
            break;
          case "hour":
          case "hours":
          case "hr":
          case "hrs":
          case "h":
            t10 = Math.round(3600 * n10);
            break;
          case "day":
          case "days":
          case "d":
            t10 = Math.round(86400 * n10);
            break;
          case "week":
          case "weeks":
          case "w":
            t10 = Math.round(604800 * n10);
            break;
          default:
            t10 = Math.round(31557600 * n10);
        }
        return "-" === r10[1] || "ago" === r10[4] ? -t10 : t10;
      }
      function iE(e10, t10) {
        if (!Number.isFinite(t10)) throw TypeError(`Invalid ${e10} input`);
        return t10;
      }
      let ik = (e10) => e10.includes("/") ? e10.toLowerCase() : `application/${e10.toLowerCase()}`;
      class iS {
        #u;
        constructor(e10) {
          if (!n2(e10)) throw TypeError("JWT Claims Set MUST be an object");
          this.#u = structuredClone(e10);
        }
        data() {
          return r6.encode(JSON.stringify(this.#u));
        }
        get iss() {
          return this.#u.iss;
        }
        set iss(e10) {
          this.#u.iss = e10;
        }
        get sub() {
          return this.#u.sub;
        }
        set sub(e10) {
          this.#u.sub = e10;
        }
        get aud() {
          return this.#u.aud;
        }
        set aud(e10) {
          this.#u.aud = e10;
        }
        set jti(e10) {
          this.#u.jti = e10;
        }
        set nbf(e10) {
          "number" == typeof e10 ? this.#u.nbf = iE("setNotBefore", e10) : e10 instanceof Date ? this.#u.nbf = iE("setNotBefore", iv(e10)) : this.#u.nbf = iv(/* @__PURE__ */ new Date()) + ix(e10);
        }
        set exp(e10) {
          "number" == typeof e10 ? this.#u.exp = iE("setExpirationTime", e10) : e10 instanceof Date ? this.#u.exp = iE("setExpirationTime", iv(e10)) : this.#u.exp = iv(/* @__PURE__ */ new Date()) + ix(e10);
        }
        set iat(e10) {
          void 0 === e10 ? this.#u.iat = iv(/* @__PURE__ */ new Date()) : e10 instanceof Date ? this.#u.iat = iE("setIssuedAt", iv(e10)) : "string" == typeof e10 ? this.#u.iat = iE("setIssuedAt", iv(/* @__PURE__ */ new Date()) + ix(e10)) : this.#u.iat = iE("setIssuedAt", e10);
        }
      }
      class iT {
        #s;
        #o;
        #l;
        #r;
        #h;
        #d;
        #p;
        #f;
        constructor(e10 = {}) {
          this.#f = new iS(e10);
        }
        setIssuer(e10) {
          return this.#f.iss = e10, this;
        }
        setSubject(e10) {
          return this.#f.sub = e10, this;
        }
        setAudience(e10) {
          return this.#f.aud = e10, this;
        }
        setJti(e10) {
          return this.#f.jti = e10, this;
        }
        setNotBefore(e10) {
          return this.#f.nbf = e10, this;
        }
        setExpirationTime(e10) {
          return this.#f.exp = e10, this;
        }
        setIssuedAt(e10) {
          return this.#f.iat = e10, this;
        }
        setProtectedHeader(e10) {
          return ni(this.#r, "setProtectedHeader"), this.#r = e10, this;
        }
        setKeyManagementParameters(e10) {
          return ni(this.#l, "setKeyManagementParameters"), this.#l = e10, this;
        }
        setContentEncryptionKey(e10) {
          return ni(this.#s, "setContentEncryptionKey"), this.#s = e10, this;
        }
        setInitializationVector(e10) {
          return ni(this.#o, "setInitializationVector"), this.#o = e10, this;
        }
        replicateIssuerAsHeader() {
          return this.#h = true, this;
        }
        replicateSubjectAsHeader() {
          return this.#d = true, this;
        }
        replicateAudienceAsHeader() {
          return this.#p = true, this;
        }
        async encrypt(e10, t10) {
          let r10 = new iw(this.#f.data());
          return this.#r && (this.#h || this.#d || this.#p) && (this.#r = { ...this.#r, iss: this.#h ? this.#f.iss : void 0, sub: this.#d ? this.#f.sub : void 0, aud: this.#p ? this.#f.aud : void 0 }), r10.setProtectedHeader(this.#r), this.#o && r10.setInitializationVector(this.#o), this.#s && r10.setContentEncryptionKey(this.#s), this.#l && r10.setKeyManagementParameters(this.#l), r10.encrypt(e10, t10);
        }
      }
      var iA = e.i(22423), iA = iA;
      let iR = (e10, t10) => {
        if ("string" != typeof e10 || !e10) throw new nv(`${t10} missing or invalid`);
      };
      async function iC(e10, t10) {
        let r10, n10;
        if (n6(e10)) r10 = e10;
        else if (nS(e10)) r10 = await ir(e10);
        else throw TypeError(nu(e10, "CryptoKey", "KeyObject", "JSON Web Key"));
        if ("sha256" !== (t10 ??= "sha256") && "sha384" !== t10 && "sha512" !== t10) throw TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
        switch (r10.kty) {
          case "AKP":
            iR(r10.alg, '"alg" (Algorithm) Parameter'), iR(r10.pub, '"pub" (Public key) Parameter'), n10 = { alg: r10.alg, kty: r10.kty, pub: r10.pub };
            break;
          case "EC":
            iR(r10.crv, '"crv" (Curve) Parameter'), iR(r10.x, '"x" (X Coordinate) Parameter'), iR(r10.y, '"y" (Y Coordinate) Parameter'), n10 = { crv: r10.crv, kty: r10.kty, x: r10.x, y: r10.y };
            break;
          case "OKP":
            iR(r10.crv, '"crv" (Subtype of Key Pair) Parameter'), iR(r10.x, '"x" (Public Key) Parameter'), n10 = { crv: r10.crv, kty: r10.kty, x: r10.x };
            break;
          case "RSA":
            iR(r10.e, '"e" (Exponent) Parameter'), iR(r10.n, '"n" (Modulus) Parameter'), n10 = { e: r10.e, kty: r10.kty, n: r10.n };
            break;
          case "oct":
            iR(r10.k, '"k" (Key Value) Parameter'), n10 = { k: r10.k, kty: r10.kty };
            break;
          default:
            throw new nm('"kty" (Key Type) Parameter missing or unsupported');
        }
        let i10 = ne(JSON.stringify(n10));
        return nr(await ns(t10, i10));
      }
      function iO(e10, t10) {
        if (void 0 !== t10 && (!Array.isArray(t10) || t10.some((e11) => "string" != typeof e11))) throw TypeError(`"${e10}" option must be an array of strings`);
        if (t10) return new Set(t10);
      }
      async function iP(e10, t10, r10) {
        let n10, i10, a10, s10, o10, l10;
        if (!n2(e10)) throw new nb("Flattened JWE must be an object");
        if (void 0 === e10.protected && void 0 === e10.header && void 0 === e10.unprotected) throw new nb("JOSE Header missing");
        if (void 0 !== e10.iv && "string" != typeof e10.iv) throw new nb("JWE Initialization Vector incorrect type");
        if ("string" != typeof e10.ciphertext) throw new nb("JWE Ciphertext missing or incorrect type");
        if (void 0 !== e10.tag && "string" != typeof e10.tag) throw new nb("JWE Authentication Tag incorrect type");
        if (void 0 !== e10.protected && "string" != typeof e10.protected) throw new nb("JWE Protected Header incorrect type");
        if (void 0 !== e10.encrypted_key && "string" != typeof e10.encrypted_key) throw new nb("JWE Encrypted Key incorrect type");
        if (void 0 !== e10.aad && "string" != typeof e10.aad) throw new nb("JWE AAD incorrect type");
        if (void 0 !== e10.header && !n2(e10.header)) throw new nb("JWE Shared Unprotected Header incorrect type");
        if (void 0 !== e10.unprotected && !n2(e10.unprotected)) throw new nb("JWE Per-Recipient Unprotected Header incorrect type");
        if (e10.protected) try {
          let t11 = nt(e10.protected);
          n10 = JSON.parse(r3.decode(t11));
        } catch {
          throw new nb("JWE Protected Header is invalid");
        }
        if (!n5(n10, e10.header, e10.unprotected)) throw new nb("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
        let c10 = { ...n10, ...e10.header, ...e10.unprotected };
        if (iu(nb, /* @__PURE__ */ new Map(), r10?.crit, n10, c10), void 0 !== c10.zip && "DEF" !== c10.zip) throw new nm('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
        if (void 0 !== c10.zip && !n10?.zip) throw new nb('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
        let { alg: u10, enc: h10 } = c10;
        if ("string" != typeof u10 || !u10) throw new nb("missing JWE Algorithm (alg) in JWE Header");
        if ("string" != typeof h10 || !h10) throw new nb("missing JWE Encryption Algorithm (enc) in JWE Header");
        let d2 = r10 && iO("keyManagementAlgorithms", r10.keyManagementAlgorithms), p2 = r10 && iO("contentEncryptionAlgorithms", r10.contentEncryptionAlgorithms);
        if (d2 && !d2.has(u10) || !d2 && u10.startsWith("PBES2")) throw new ng('"alg" (Algorithm) Header Parameter value not allowed');
        if (p2 && !p2.has(h10)) throw new ng('"enc" (Encryption Algorithm) Header Parameter value not allowed');
        void 0 !== e10.encrypted_key && (i10 = na(e10.encrypted_key, "encrypted_key", nb));
        let f2 = false;
        "function" == typeof t10 && (t10 = await t10(n10, e10), f2 = true), ip("dir" === u10 ? h10 : u10, t10, "decrypt");
        let g2 = await n7(t10, u10);
        try {
          a10 = await il(u10, g2, i10, c10, r10);
        } catch (e11) {
          if (e11 instanceof TypeError || e11 instanceof nb || e11 instanceof nm) throw e11;
          a10 = nA(h10);
        }
        void 0 !== e10.iv && (s10 = na(e10.iv, "iv", nb)), void 0 !== e10.tag && (o10 = na(e10.tag, "tag", nb));
        let m2 = void 0 !== e10.protected ? ne(e10.protected) : new Uint8Array();
        l10 = void 0 !== e10.aad ? r4(m2, ne("."), ne(e10.aad)) : m2;
        let y2 = na(e10.ciphertext, "ciphertext", nb), b2 = await nH(h10, a10, y2, s10, o10, l10), w2 = { plaintext: b2 };
        if ("DEF" === c10.zip) {
          let e11 = r10?.maxDecompressedLength ?? 25e4;
          if (0 === e11) throw new nm('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
          if (e11 !== 1 / 0 && (!Number.isSafeInteger(e11) || e11 < 1)) throw TypeError("maxDecompressedLength must be 0, a positive safe integer, or Infinity");
          w2.plaintext = await iy(b2, e11).catch((e12) => {
            if (e12 instanceof nb) throw e12;
            throw new nb("Failed to decompress plaintext", { cause: e12 });
          });
        }
        return (void 0 !== e10.protected && (w2.protectedHeader = n10), void 0 !== e10.aad && (w2.additionalAuthenticatedData = na(e10.aad, "aad", nb)), void 0 !== e10.unprotected && (w2.sharedUnprotectedHeader = e10.unprotected), void 0 !== e10.header && (w2.unprotectedHeader = e10.header), f2) ? { ...w2, key: g2 } : w2;
      }
      async function iI(e10, t10, r10) {
        if (e10 instanceof Uint8Array && (e10 = r3.decode(e10)), "string" != typeof e10) throw new nb("Compact JWE must be a string or Uint8Array");
        let { 0: n10, 1: i10, 2: a10, 3: s10, 4: o10, length: l10 } = e10.split(".");
        if (5 !== l10) throw new nb("Invalid Compact JWE");
        let c10 = await iP({ ciphertext: s10, iv: a10 || void 0, protected: n10, tag: o10 || void 0, encrypted_key: i10 || void 0 }, t10, r10), u10 = { plaintext: c10.plaintext, protectedHeader: c10.protectedHeader };
        return "function" == typeof t10 ? { ...u10, key: c10.key } : u10;
      }
      async function ij(e10, t10, r10) {
        let n10 = await iI(e10, t10, r10), i10 = function(e11, t11, r11 = {}) {
          var n11, i11;
          let a11, s11;
          try {
            a11 = JSON.parse(r3.decode(t11));
          } catch {
          }
          if (!n2(a11)) throw new nw("JWT Claims Set must be a top-level JSON object");
          let { typ: o10 } = r11;
          if (o10 && ("string" != typeof e11.typ || ik(e11.typ) !== ik(o10))) throw new np('unexpected "typ" JWT header value', a11, "typ", "check_failed");
          let { requiredClaims: l10 = [], issuer: c10, subject: u10, audience: h10, maxTokenAge: d2 } = r11, p2 = [...l10];
          for (let e12 of (void 0 !== d2 && p2.push("iat"), void 0 !== h10 && p2.push("aud"), void 0 !== u10 && p2.push("sub"), void 0 !== c10 && p2.push("iss"), new Set(p2.reverse()))) if (!(e12 in a11)) throw new np(`missing required "${e12}" claim`, a11, e12, "missing");
          if (c10 && !(Array.isArray(c10) ? c10 : [c10]).includes(a11.iss)) throw new np('unexpected "iss" claim value', a11, "iss", "check_failed");
          if (u10 && a11.sub !== u10) throw new np('unexpected "sub" claim value', a11, "sub", "check_failed");
          if (h10 && (n11 = a11.aud, i11 = "string" == typeof h10 ? [h10] : h10, "string" == typeof n11 ? !i11.includes(n11) : !(Array.isArray(n11) && i11.some(Set.prototype.has.bind(new Set(n11)))))) throw new np('unexpected "aud" claim value', a11, "aud", "check_failed");
          switch (typeof r11.clockTolerance) {
            case "string":
              s11 = ix(r11.clockTolerance);
              break;
            case "number":
              s11 = r11.clockTolerance;
              break;
            case "undefined":
              s11 = 0;
              break;
            default:
              throw TypeError("Invalid clockTolerance option type");
          }
          let { currentDate: f2 } = r11, g2 = iv(f2 || /* @__PURE__ */ new Date());
          if ((void 0 !== a11.iat || d2) && "number" != typeof a11.iat) throw new np('"iat" claim must be a number', a11, "iat", "invalid");
          if (void 0 !== a11.nbf) {
            if ("number" != typeof a11.nbf) throw new np('"nbf" claim must be a number', a11, "nbf", "invalid");
            if (a11.nbf > g2 + s11) throw new np('"nbf" claim timestamp check failed', a11, "nbf", "check_failed");
          }
          if (void 0 !== a11.exp) {
            if ("number" != typeof a11.exp) throw new np('"exp" claim must be a number', a11, "exp", "invalid");
            if (a11.exp <= g2 - s11) throw new nf('"exp" claim timestamp check failed', a11, "exp", "check_failed");
          }
          if (d2) {
            let e12 = g2 - a11.iat;
            if (e12 - s11 > ("number" == typeof d2 ? d2 : ix(d2))) throw new nf('"iat" claim timestamp check failed (too far in the past)', a11, "iat", "check_failed");
            if (e12 < 0 - s11) throw new np('"iat" claim timestamp check failed (it should be in the past)', a11, "iat", "check_failed");
          }
          return a11;
        }(n10.protectedHeader, n10.plaintext, r10), { protectedHeader: a10 } = n10;
        if (void 0 !== a10.iss && a10.iss !== i10.iss) throw new np('replicated "iss" claim header parameter mismatch', i10, "iss", "mismatch");
        if (void 0 !== a10.sub && a10.sub !== i10.sub) throw new np('replicated "sub" claim header parameter mismatch', i10, "sub", "mismatch");
        if (void 0 !== a10.aud && JSON.stringify(a10.aud) !== JSON.stringify(i10.aud)) throw new np('replicated "aud" claim header parameter mismatch', i10, "aud", "mismatch");
        let s10 = { payload: i10, protectedHeader: a10 };
        return "function" == typeof t10 ? { ...s10, key: n10.key } : s10;
      }
      let i$ = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/, iN = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/, iU = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, iD = /^[\u0020-\u003A\u003D-\u007E]*$/, iL = Object.prototype.toString, iM = ((h = function() {
      }).prototype = /* @__PURE__ */ Object.create(null), h);
      function iH(e10, t10, r10) {
        do {
          let r11 = e10.charCodeAt(t10);
          if (32 !== r11 && 9 !== r11) return t10;
        } while (++t10 < r10);
        return r10;
      }
      function iB(e10, t10, r10) {
        for (; t10 > r10; ) {
          let r11 = e10.charCodeAt(--t10);
          if (32 !== r11 && 9 !== r11) return t10 + 1;
        }
        return r10;
      }
      function iW(e10) {
        if (-1 === e10.indexOf("%")) return e10;
        try {
          return decodeURIComponent(e10);
        } catch (t10) {
          return e10;
        }
      }
      e.s(["parse", 0, function(e10, t10) {
        let r10 = new iM(), n10 = e10.length;
        if (n10 < 2) return r10;
        let i10 = t10?.decode || iW, a10 = 0;
        do {
          let t11 = e10.indexOf("=", a10);
          if (-1 === t11) break;
          let s10 = e10.indexOf(";", a10), o10 = -1 === s10 ? n10 : s10;
          if (t11 > o10) {
            a10 = e10.lastIndexOf(";", t11 - 1) + 1;
            continue;
          }
          let l10 = iH(e10, a10, t11), c10 = iB(e10, t11, l10), u10 = e10.slice(l10, c10);
          if (void 0 === r10[u10]) {
            let n11 = iH(e10, t11 + 1, o10), a11 = iB(e10, o10, n11), s11 = i10(e10.slice(n11, a11));
            r10[u10] = s11;
          }
          a10 = o10 + 1;
        } while (a10 < n10);
        return r10;
      }, "serialize", 0, function(e10, t10, r10) {
        let n10 = r10?.encode || encodeURIComponent;
        if (!i$.test(e10)) throw TypeError(`argument name is invalid: ${e10}`);
        let i10 = n10(t10);
        if (!iN.test(i10)) throw TypeError(`argument val is invalid: ${t10}`);
        let a10 = e10 + "=" + i10;
        if (!r10) return a10;
        if (void 0 !== r10.maxAge) {
          if (!Number.isInteger(r10.maxAge)) throw TypeError(`option maxAge is invalid: ${r10.maxAge}`);
          a10 += "; Max-Age=" + r10.maxAge;
        }
        if (r10.domain) {
          if (!iU.test(r10.domain)) throw TypeError(`option domain is invalid: ${r10.domain}`);
          a10 += "; Domain=" + r10.domain;
        }
        if (r10.path) {
          if (!iD.test(r10.path)) throw TypeError(`option path is invalid: ${r10.path}`);
          a10 += "; Path=" + r10.path;
        }
        if (r10.expires) {
          var s10;
          if (s10 = r10.expires, "[object Date]" !== iL.call(s10) || !Number.isFinite(r10.expires.valueOf())) throw TypeError(`option expires is invalid: ${r10.expires}`);
          a10 += "; Expires=" + r10.expires.toUTCString();
        }
        if (r10.httpOnly && (a10 += "; HttpOnly"), r10.secure && (a10 += "; Secure"), r10.partitioned && (a10 += "; Partitioned"), r10.priority) switch ("string" == typeof r10.priority ? r10.priority.toLowerCase() : void 0) {
          case "low":
            a10 += "; Priority=Low";
            break;
          case "medium":
            a10 += "; Priority=Medium";
            break;
          case "high":
            a10 += "; Priority=High";
            break;
          default:
            throw TypeError(`option priority is invalid: ${r10.priority}`);
        }
        if (r10.sameSite) switch ("string" == typeof r10.sameSite ? r10.sameSite.toLowerCase() : r10.sameSite) {
          case true:
          case "strict":
            a10 += "; SameSite=Strict";
            break;
          case "lax":
            a10 += "; SameSite=Lax";
            break;
          case "none":
            a10 += "; SameSite=None";
            break;
          default:
            throw TypeError(`option sameSite is invalid: ${r10.sameSite}`);
        }
        return a10;
      }], 87501);
      var iq = e.i(87501);
      let { parse: iK } = iq, iJ = "A256CBC-HS512";
      async function iF(e10) {
        let { token: t10 = {}, secret: r10, maxAge: n10 = 2592e3, salt: i10 } = e10, a10 = Array.isArray(r10) ? r10 : [r10], s10 = await iV(iJ, a10[0], i10), o10 = await iC({ kty: "oct", k: iA.encode(s10) }, `sha${s10.byteLength << 3}`);
        return await new iT(t10).setProtectedHeader({ alg: "dir", enc: iJ, kid: o10 }).setIssuedAt().setExpirationTime((Date.now() / 1e3 | 0) + n10).setJti(crypto.randomUUID()).encrypt(s10);
      }
      async function iz(e10) {
        let { token: t10, secret: r10, salt: n10 } = e10, i10 = Array.isArray(r10) ? r10 : [r10];
        if (!t10) return null;
        let { payload: a10 } = await ij(t10, async ({ kid: e11, enc: t11 }) => {
          for (let r11 of i10) {
            let i11 = await iV(t11, r11, n10);
            if (void 0 === e11 || e11 === await iC({ kty: "oct", k: iA.encode(i11) }, `sha${i11.byteLength << 3}`)) return i11;
          }
          throw Error("no matching decryption secret");
        }, { clockTolerance: 15, keyManagementAlgorithms: ["dir"], contentEncryptionAlgorithms: [iJ, "A256GCM"] });
        return a10;
      }
      async function iV(e10, t10, r10) {
        let n10;
        switch (e10) {
          case "A256CBC-HS512":
            n10 = 64;
            break;
          case "A256GCM":
            n10 = 32;
            break;
          default:
            throw Error("Unsupported JWT Content Encryption Algorithm");
        }
        return await r5("sha256", t10, r10, `Auth.js Generated Encryption Key (${r10})`, n10);
      }
      async function iG({ options: e10, paramValue: t10, cookieValue: r10 }) {
        let { url: n10, callbacks: i10 } = e10, a10 = n10.origin;
        return t10 ? a10 = await i10.redirect({ url: t10, baseUrl: n10.origin }) : r10 && (a10 = await i10.redirect({ url: r10, baseUrl: n10.origin })), { callbackUrl: a10, callbackUrlCookie: a10 !== r10 ? a10 : void 0 };
      }
      let iX = "\x1B[31m", iY = "\x1B[0m", iZ = { error(e10) {
        let t10 = e10 instanceof rf ? e10.type : e10.name;
        if (console.error(`${iX}[auth][error]${iY} ${t10}: ${e10.message}`), e10.cause && "object" == typeof e10.cause && "err" in e10.cause && e10.cause.err instanceof Error) {
          let { err: t11, ...r10 } = e10.cause;
          console.error(`${iX}[auth][cause]${iY}:`, t11.stack), r10 && console.error(`${iX}[auth][details]${iY}:`, JSON.stringify(r10, null, 2));
        } else e10.stack && console.error(e10.stack.replace(/.*/, "").substring(1));
      }, warn(e10) {
        console.warn(`\x1B[33m[auth][warn][${e10}]${iY}`, "Read more: https://warnings.authjs.dev");
      }, debug(e10, t10) {
        console.log(`\x1B[90m[auth][debug]:${iY} ${e10}`, JSON.stringify(t10, null, 2));
      } };
      function iQ(e10) {
        let t10 = { ...iZ };
        return e10.debug || (t10.debug = () => {
        }), e10.logger?.error && (t10.error = e10.logger.error), e10.logger?.warn && (t10.warn = e10.logger.warn), e10.logger?.debug && (t10.debug = e10.logger.debug), e10.logger ?? (e10.logger = t10), t10;
      }
      let i0 = ["providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error", "webauthn-options"], { parse: i1, serialize: i2 } = iq;
      async function i5(e10) {
        if (!("body" in e10) || !e10.body || "POST" !== e10.method) return;
        let t10 = e10.headers.get("content-type");
        return t10?.includes("application/json") ? await e10.json() : t10?.includes("application/x-www-form-urlencoded") ? Object.fromEntries(new URLSearchParams(await e10.text())) : void 0;
      }
      async function i6(e10, t10) {
        try {
          if ("GET" !== e10.method && "POST" !== e10.method) throw new rN("Only GET and POST requests are supported");
          t10.basePath ?? (t10.basePath = "/auth");
          let r10 = new URL(e10.url), { action: n10, providerId: i10 } = function(e11, t11) {
            let r11 = e11.match(RegExp(`^${t11}(.+)`));
            if (null === r11) throw new rN(`Cannot parse action at ${e11}`);
            let n11 = r11.at(-1).replace(/^\//, "").split("/").filter(Boolean);
            if (1 !== n11.length && 2 !== n11.length) throw new rN(`Cannot parse action at ${e11}`);
            let [i11, a10] = n11;
            if (!i0.includes(i11) || a10 && !["signin", "callback", "webauthn-options"].includes(i11)) throw new rN(`Cannot parse action at ${e11}`);
            return { action: i11, providerId: "undefined" == a10 ? void 0 : a10 };
          }(r10.pathname, t10.basePath);
          return { url: r10, action: n10, providerId: i10, method: e10.method, headers: Object.fromEntries(e10.headers), body: e10.body ? await i5(e10) : void 0, cookies: i1(e10.headers.get("cookie") ?? "") ?? {}, error: r10.searchParams.get("error") ?? void 0, query: Object.fromEntries(r10.searchParams) };
        } catch (n10) {
          let r10 = iQ(t10);
          r10.error(n10), r10.debug("request", e10);
        }
      }
      function i3(e10) {
        let t10 = new Headers(e10.headers);
        e10.cookies?.forEach((e11) => {
          let { name: r11, value: n11, options: i10 } = e11, a10 = i2(r11, n11, i10);
          t10.has("Set-Cookie") ? t10.append("Set-Cookie", a10) : t10.set("Set-Cookie", a10);
        });
        let r10 = e10.body;
        "application/json" === t10.get("content-type") ? r10 = JSON.stringify(e10.body) : "application/x-www-form-urlencoded" === t10.get("content-type") && (r10 = new URLSearchParams(e10.body).toString());
        let n10 = new Response(r10, { headers: t10, status: e10.redirect ? 302 : e10.status ?? 200 });
        return e10.redirect && n10.headers.set("Location", e10.redirect), n10;
      }
      async function i4(e10) {
        let t10 = new TextEncoder().encode(e10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", t10))).map((e11) => e11.toString(16).padStart(2, "0")).join("").toString();
      }
      function i8(e10) {
        return Array.from(crypto.getRandomValues(new Uint8Array(e10))).reduce((e11, t10) => e11 + ("0" + t10.toString(16)).slice(-2), "");
      }
      async function i9({ options: e10, cookieValue: t10, isPost: r10, bodyValue: n10 }) {
        if (t10) {
          let [i11, a11] = t10.split("|");
          if (a11 === await i4(`${i11}${e10.secret}`)) return { csrfTokenVerified: r10 && i11 === n10, csrfToken: i11 };
        }
        let i10 = i8(32), a10 = await i4(`${i10}${e10.secret}`);
        return { cookie: `${i10}|${a10}`, csrfToken: i10 };
      }
      function i7(e10, t10) {
        if (!t10) throw new rH(`CSRF token was missing during an action ${e10}`);
      }
      function ae(e10) {
        return null !== e10 && "object" == typeof e10;
      }
      function at(e10, ...t10) {
        if (!t10.length) return e10;
        let r10 = t10.shift();
        if (ae(e10) && ae(r10)) for (let t11 in r10) ae(r10[t11]) ? (ae(e10[t11]) || (e10[t11] = Array.isArray(r10[t11]) ? [] : {}), at(e10[t11], r10[t11])) : void 0 !== r10[t11] && (e10[t11] = r10[t11]);
        return at(e10, ...t10);
      }
      let ar = Symbol("skip-csrf-check"), an = Symbol("return-type-raw"), ai = Symbol("custom-fetch"), aa = Symbol("conform-internal"), as = (e10) => al({ id: e10.sub ?? e10.id ?? crypto.randomUUID(), name: e10.name ?? e10.nickname ?? e10.preferred_username, email: e10.email, image: e10.picture }), ao = (e10) => al({ access_token: e10.access_token, id_token: e10.id_token, refresh_token: e10.refresh_token, expires_at: e10.expires_at, scope: e10.scope, token_type: e10.token_type, session_state: e10.session_state });
      function al(e10) {
        let t10 = {};
        for (let [r10, n10] of Object.entries(e10)) void 0 !== n10 && (t10[r10] = n10);
        return t10;
      }
      function ac(e10, t10) {
        if (!e10 && t10) return;
        if ("string" == typeof e10) return { url: new URL(e10) };
        let r10 = new URL(e10?.url ?? "https://authjs.dev");
        if (e10?.params != null) for (let [t11, n10] of Object.entries(e10.params)) "claims" === t11 && (n10 = JSON.stringify(n10)), r10.searchParams.set(t11, String(n10));
        return { url: r10, request: e10?.request, conform: e10?.conform, ...e10?.clientPrivateKey ? { clientPrivateKey: e10?.clientPrivateKey } : null };
      }
      let au = { signIn: () => true, redirect: ({ url: e10, baseUrl: t10 }) => e10.startsWith("/") ? `${t10}${e10}` : new URL(e10).origin === t10 ? e10 : t10, session: ({ session: e10 }) => ({ user: { name: e10.user?.name, email: e10.user?.email, image: e10.user?.image }, expires: e10.expires?.toISOString?.() ?? e10.expires }), jwt: ({ token: e10 }) => e10 };
      async function ah({ authOptions: e10, providerId: t10, action: r10, url: n10, cookies: i10, callbackUrl: a10, csrfToken: s10, csrfDisabled: o10, isPost: l10 }) {
        var c10, u10;
        let h10 = iQ(e10), { providers: d2, provider: p2 } = function(e11) {
          let { providerId: t11, config: r11 } = e11, n11 = new URL(r11.basePath ?? "/auth", e11.url.origin), i11 = r11.providers.map((e12) => {
            let t12 = "function" == typeof e12 ? e12() : e12, { options: i12, ...a12 } = t12, s11 = i12?.id ?? a12.id, o11 = at(a12, i12, { signinUrl: `${n11}/signin/${s11}`, callbackUrl: `${n11}/callback/${s11}` });
            if ("oauth" === t12.type || "oidc" === t12.type) {
              var l11;
              let e13, t13, n12, a13;
              o11.redirectProxyUrl ?? (o11.redirectProxyUrl = i12?.redirectProxyUrl ?? r11.redirectProxyUrl);
              let s12 = ((l11 = o11).issuer && (l11.wellKnown ?? (l11.wellKnown = `${l11.issuer}/.well-known/openid-configuration`)), (e13 = ac(l11.authorization, l11.issuer)) && !e13.url?.searchParams.has("scope") && e13.url.searchParams.set("scope", "openid profile email"), t13 = ac(l11.token, l11.issuer), n12 = ac(l11.userinfo, l11.issuer), a13 = l11.checks ?? ["pkce"], l11.redirectProxyUrl && (a13.includes("state") || a13.push("state"), l11.redirectProxyUrl = `${l11.redirectProxyUrl}/callback/${l11.id}`), { ...l11, authorization: e13, token: t13, checks: a13, userinfo: n12, profile: l11.profile ?? as, account: l11.account ?? ao });
              return s12.authorization?.url.searchParams.get("response_mode") === "form_post" && delete s12.redirectProxyUrl, s12[ai] ?? (s12[ai] = i12?.[ai]), s12;
            }
            return o11;
          }), a11 = i11.find(({ id: e12 }) => e12 === t11);
          if (t11 && !a11) {
            let e12 = i11.map((e13) => e13.id).join(", ");
            throw Error(`Provider with id "${t11}" not found. Available providers: [${e12}].`);
          }
          return { providers: i11, provider: a11 };
        }({ url: n10, providerId: t10, config: e10 }), f2 = false;
        if ((p2?.type === "oauth" || p2?.type === "oidc") && p2.redirectProxyUrl) try {
          f2 = new URL(p2.redirectProxyUrl).origin === n10.origin;
        } catch {
          throw TypeError(`redirectProxyUrl must be a valid URL. Received: ${p2.redirectProxyUrl}`);
        }
        let g2 = { debug: false, pages: {}, theme: { colorScheme: "auto", logo: "", brandColor: "", buttonText: "" }, ...e10, url: n10, action: r10, provider: p2, cookies: at(rd(e10.useSecureCookies ?? "https:" === n10.protocol), e10.cookies), providers: d2, session: { strategy: e10.adapter ? "database" : "jwt", maxAge: 2592e3, updateAge: 86400, generateSessionToken: () => crypto.randomUUID(), ...e10.session }, jwt: { secret: e10.secret, maxAge: e10.session?.maxAge ?? 2592e3, encode: iF, decode: iz, ...e10.jwt }, events: (c10 = e10.events ?? {}, u10 = h10, Object.keys(c10).reduce((e11, t11) => (e11[t11] = async (...e12) => {
          try {
            let r11 = c10[t11];
            return await r11(...e12);
          } catch (e13) {
            u10.error(new rv(e13));
          }
        }, e11), {})), adapter: function(e11, t11) {
          if (e11) return Object.keys(e11).reduce((r11, n11) => (r11[n11] = async (...r12) => {
            try {
              t11.debug(`adapter_${n11}`, { args: r12 });
              let i11 = e11[n11];
              return await i11(...r12);
            } catch (r13) {
              let e12 = new rm(r13);
              throw t11.error(e12), e12;
            }
          }, r11), {});
        }(e10.adapter, h10), callbacks: { ...au, ...e10.callbacks }, logger: h10, callbackUrl: n10.origin, isOnRedirectProxy: f2, experimental: { ...e10.experimental } }, m2 = [];
        if (o10) g2.csrfTokenVerified = true;
        else {
          let { csrfToken: e11, cookie: t11, csrfTokenVerified: r11 } = await i9({ options: g2, cookieValue: i10?.[g2.cookies.csrfToken.name], isPost: l10, bodyValue: s10 });
          g2.csrfToken = e11, g2.csrfTokenVerified = r11, t11 && m2.push({ name: g2.cookies.csrfToken.name, value: t11, options: g2.cookies.csrfToken.options });
        }
        let { callbackUrl: y2, callbackUrlCookie: b2 } = await iG({ options: g2, cookieValue: i10?.[g2.cookies.callbackUrl.name], paramValue: a10 });
        return g2.callbackUrl = y2, b2 && m2.push({ name: g2.cookies.callbackUrl.name, value: b2, options: g2.cookies.callbackUrl.options }), { options: g2, cookies: m2 };
      }
      var ad, ap, af, ag, am, ay, ab, aw, av, a_, ax, aE, ak, aS, aT, aA, aR, aC, aO, aP, aI, aj, a$, aN, aU, aD, aL, aM, aH, aB, aW, aq = {}, aK = [], aJ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, aF = Array.isArray;
      function az(e10, t10) {
        for (var r10 in t10) e10[r10] = t10[r10];
        return e10;
      }
      function aV(e10) {
        e10 && e10.parentNode && e10.parentNode.removeChild(e10);
      }
      function aG(e10, t10, r10, n10, i10) {
        var a10 = { type: e10, props: t10, key: r10, ref: n10, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == i10 ? ++aN : i10, __i: -1, __u: 0 };
        return null == i10 && null != a$.vnode && a$.vnode(a10), a10;
      }
      function aX(e10) {
        return e10.children;
      }
      function aY(e10, t10) {
        this.props = e10, this.context = t10;
      }
      function aZ(e10, t10) {
        if (null == t10) return e10.__ ? aZ(e10.__, e10.__i + 1) : null;
        for (var r10; t10 < e10.__k.length; t10++) if (null != (r10 = e10.__k[t10]) && null != r10.__e) return r10.__e;
        return "function" == typeof e10.type ? aZ(e10) : null;
      }
      function aQ(e10) {
        (!e10.__d && (e10.__d = true) && aU.push(e10) && !a0.__r++ || aD !== a$.debounceRendering) && ((aD = a$.debounceRendering) || aL)(a0);
      }
      function a0() {
        var e10, t10, r10, n10, i10, a10, s10, o10;
        for (aU.sort(aM); e10 = aU.shift(); ) e10.__d && (t10 = aU.length, n10 = void 0, a10 = (i10 = (r10 = e10).__v).__e, s10 = [], o10 = [], r10.__P && ((n10 = az({}, i10)).__v = i10.__v + 1, a$.vnode && a$.vnode(n10), a3(r10.__P, n10, i10, r10.__n, r10.__P.namespaceURI, 32 & i10.__u ? [a10] : null, s10, null == a10 ? aZ(i10) : a10, !!(32 & i10.__u), o10), n10.__v = i10.__v, n10.__.__k[n10.__i] = n10, function(e11, t11, r11) {
          t11.__d = void 0;
          for (var n11 = 0; n11 < r11.length; n11++) a4(r11[n11], r11[++n11], r11[++n11]);
          a$.__c && a$.__c(t11, e11), e11.some(function(t12) {
            try {
              e11 = t12.__h, t12.__h = [], e11.some(function(e12) {
                e12.call(t12);
              });
            } catch (e12) {
              a$.__e(e12, t12.__v);
            }
          });
        }(s10, n10, o10), n10.__e != a10 && function e11(t11) {
          var r11, n11;
          if (null != (t11 = t11.__) && null != t11.__c) {
            for (t11.__e = t11.__c.base = null, r11 = 0; r11 < t11.__k.length; r11++) if (null != (n11 = t11.__k[r11]) && null != n11.__e) {
              t11.__e = t11.__c.base = n11.__e;
              break;
            }
            return e11(t11);
          }
        }(n10)), aU.length > t10 && aU.sort(aM));
        a0.__r = 0;
      }
      function a1(e10, t10, r10, n10, i10, a10, s10, o10, l10, c10, u10) {
        var h10, d2, p2, f2, g2, m2 = n10 && n10.__k || aK, y2 = t10.length;
        for (r10.__d = l10, function(e11, t11, r11) {
          var n11, i11, a11, s11, o11, l11 = t11.length, c11 = r11.length, u11 = c11, h11 = 0;
          for (e11.__k = [], n11 = 0; n11 < l11; n11++) null != (i11 = t11[n11]) && "boolean" != typeof i11 && "function" != typeof i11 ? (s11 = n11 + h11, (i11 = e11.__k[n11] = "string" == typeof i11 || "number" == typeof i11 || "bigint" == typeof i11 || i11.constructor == String ? aG(null, i11, null, null, null) : aF(i11) ? aG(aX, { children: i11 }, null, null, null) : void 0 === i11.constructor && i11.__b > 0 ? aG(i11.type, i11.props, i11.key, i11.ref ? i11.ref : null, i11.__v) : i11).__ = e11, i11.__b = e11.__b + 1, a11 = null, -1 !== (o11 = i11.__i = function(e12, t12, r12, n12) {
            var i12 = e12.key, a12 = e12.type, s12 = r12 - 1, o12 = r12 + 1, l12 = t12[r12];
            if (null === l12 || l12 && i12 == l12.key && a12 === l12.type && 0 == (131072 & l12.__u)) return r12;
            if (n12 > +(null != l12 && 0 == (131072 & l12.__u))) for (; s12 >= 0 || o12 < t12.length; ) {
              if (s12 >= 0) {
                if ((l12 = t12[s12]) && 0 == (131072 & l12.__u) && i12 == l12.key && a12 === l12.type) return s12;
                s12--;
              }
              if (o12 < t12.length) {
                if ((l12 = t12[o12]) && 0 == (131072 & l12.__u) && i12 == l12.key && a12 === l12.type) return o12;
                o12++;
              }
            }
            return -1;
          }(i11, r11, s11, u11)) && (u11--, (a11 = r11[o11]) && (a11.__u |= 131072)), null == a11 || null === a11.__v ? (-1 == o11 && h11--, "function" != typeof i11.type && (i11.__u |= 65536)) : o11 !== s11 && (o11 == s11 - 1 ? h11-- : o11 == s11 + 1 ? h11++ : (o11 > s11 ? h11-- : h11++, i11.__u |= 65536))) : i11 = e11.__k[n11] = null;
          if (u11) for (n11 = 0; n11 < c11; n11++) null != (a11 = r11[n11]) && 0 == (131072 & a11.__u) && (a11.__e == e11.__d && (e11.__d = aZ(a11)), function e12(t12, r12, n12) {
            var i12, a12;
            if (a$.unmount && a$.unmount(t12), (i12 = t12.ref) && (i12.current && i12.current !== t12.__e || a4(i12, null, r12)), null != (i12 = t12.__c)) {
              if (i12.componentWillUnmount) try {
                i12.componentWillUnmount();
              } catch (e13) {
                a$.__e(e13, r12);
              }
              i12.base = i12.__P = null;
            }
            if (i12 = t12.__k) for (a12 = 0; a12 < i12.length; a12++) i12[a12] && e12(i12[a12], r12, n12 || "function" != typeof t12.type);
            n12 || aV(t12.__e), t12.__c = t12.__ = t12.__e = t12.__d = void 0;
          }(a11, a11));
        }(r10, t10, m2), l10 = r10.__d, h10 = 0; h10 < y2; h10++) null != (p2 = r10.__k[h10]) && (d2 = -1 === p2.__i ? aq : m2[p2.__i] || aq, p2.__i = h10, a3(e10, p2, d2, i10, a10, s10, o10, l10, c10, u10), f2 = p2.__e, p2.ref && d2.ref != p2.ref && (d2.ref && a4(d2.ref, null, p2), u10.push(p2.ref, p2.__c || f2, p2)), null == g2 && null != f2 && (g2 = f2), 65536 & p2.__u || d2.__k === p2.__k ? l10 = function e11(t11, r11, n11) {
          var i11, a11;
          if ("function" == typeof t11.type) {
            for (i11 = t11.__k, a11 = 0; i11 && a11 < i11.length; a11++) i11[a11] && (i11[a11].__ = t11, r11 = e11(i11[a11], r11, n11));
            return r11;
          }
          t11.__e != r11 && (r11 && t11.type && !n11.contains(r11) && (r11 = aZ(t11)), n11.insertBefore(t11.__e, r11 || null), r11 = t11.__e);
          do
            r11 = r11 && r11.nextSibling;
          while (null != r11 && 8 === r11.nodeType);
          return r11;
        }(p2, l10, e10) : "function" == typeof p2.type && void 0 !== p2.__d ? l10 = p2.__d : f2 && (l10 = f2.nextSibling), p2.__d = void 0, p2.__u &= -196609);
        r10.__d = l10, r10.__e = g2;
      }
      function a2(e10, t10, r10) {
        "-" === t10[0] ? e10.setProperty(t10, null == r10 ? "" : r10) : e10[t10] = null == r10 ? "" : "number" != typeof r10 || aJ.test(t10) ? r10 : r10 + "px";
      }
      function a5(e10, t10, r10, n10, i10) {
        var a10;
        e: if ("style" === t10) if ("string" == typeof r10) e10.style.cssText = r10;
        else {
          if ("string" == typeof n10 && (e10.style.cssText = n10 = ""), n10) for (t10 in n10) r10 && t10 in r10 || a2(e10.style, t10, "");
          if (r10) for (t10 in r10) n10 && r10[t10] === n10[t10] || a2(e10.style, t10, r10[t10]);
        }
        else if ("o" === t10[0] && "n" === t10[1]) a10 = t10 !== (t10 = t10.replace(/(PointerCapture)$|Capture$/i, "$1")), t10 = t10.toLowerCase() in e10 || "onFocusOut" === t10 || "onFocusIn" === t10 ? t10.toLowerCase().slice(2) : t10.slice(2), e10.l || (e10.l = {}), e10.l[t10 + a10] = r10, r10 ? n10 ? r10.u = n10.u : (r10.u = aH, e10.addEventListener(t10, a10 ? aW : aB, a10)) : e10.removeEventListener(t10, a10 ? aW : aB, a10);
        else {
          if ("http://www.w3.org/2000/svg" == i10) t10 = t10.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
          else if ("width" != t10 && "height" != t10 && "href" != t10 && "list" != t10 && "form" != t10 && "tabIndex" != t10 && "download" != t10 && "rowSpan" != t10 && "colSpan" != t10 && "role" != t10 && "popover" != t10 && t10 in e10) try {
            e10[t10] = null == r10 ? "" : r10;
            break e;
          } catch (e11) {
          }
          "function" == typeof r10 || (null == r10 || false === r10 && "-" !== t10[4] ? e10.removeAttribute(t10) : e10.setAttribute(t10, "popover" == t10 && 1 == r10 ? "" : r10));
        }
      }
      function a6(e10) {
        return function(t10) {
          if (this.l) {
            var r10 = this.l[t10.type + e10];
            if (null == t10.t) t10.t = aH++;
            else if (t10.t < r10.u) return;
            return r10(a$.event ? a$.event(t10) : t10);
          }
        };
      }
      function a3(e10, t10, r10, n10, i10, a10, s10, o10, l10, c10) {
        var u10, h10, d2, p2, f2, g2, m2, y2, b2, w2, v2, _2, x2, E2, k2, S2, T2 = t10.type;
        if (void 0 !== t10.constructor) return null;
        128 & r10.__u && (l10 = !!(32 & r10.__u), a10 = [o10 = t10.__e = r10.__e]), (u10 = a$.__b) && u10(t10);
        e: if ("function" == typeof T2) try {
          if (y2 = t10.props, b2 = "prototype" in T2 && T2.prototype.render, w2 = (u10 = T2.contextType) && n10[u10.__c], v2 = u10 ? w2 ? w2.props.value : u10.__ : n10, r10.__c ? m2 = (h10 = t10.__c = r10.__c).__ = h10.__E : (b2 ? t10.__c = h10 = new T2(y2, v2) : (t10.__c = h10 = new aY(y2, v2), h10.constructor = T2, h10.render = a8), w2 && w2.sub(h10), h10.props = y2, h10.state || (h10.state = {}), h10.context = v2, h10.__n = n10, d2 = h10.__d = true, h10.__h = [], h10._sb = []), b2 && null == h10.__s && (h10.__s = h10.state), b2 && null != T2.getDerivedStateFromProps && (h10.__s == h10.state && (h10.__s = az({}, h10.__s)), az(h10.__s, T2.getDerivedStateFromProps(y2, h10.__s))), p2 = h10.props, f2 = h10.state, h10.__v = t10, d2) b2 && null == T2.getDerivedStateFromProps && null != h10.componentWillMount && h10.componentWillMount(), b2 && null != h10.componentDidMount && h10.__h.push(h10.componentDidMount);
          else {
            if (b2 && null == T2.getDerivedStateFromProps && y2 !== p2 && null != h10.componentWillReceiveProps && h10.componentWillReceiveProps(y2, v2), !h10.__e && (null != h10.shouldComponentUpdate && false === h10.shouldComponentUpdate(y2, h10.__s, v2) || t10.__v === r10.__v)) {
              for (t10.__v !== r10.__v && (h10.props = y2, h10.state = h10.__s, h10.__d = false), t10.__e = r10.__e, t10.__k = r10.__k, t10.__k.some(function(e11) {
                e11 && (e11.__ = t10);
              }), _2 = 0; _2 < h10._sb.length; _2++) h10.__h.push(h10._sb[_2]);
              h10._sb = [], h10.__h.length && s10.push(h10);
              break e;
            }
            null != h10.componentWillUpdate && h10.componentWillUpdate(y2, h10.__s, v2), b2 && null != h10.componentDidUpdate && h10.__h.push(function() {
              h10.componentDidUpdate(p2, f2, g2);
            });
          }
          if (h10.context = v2, h10.props = y2, h10.__P = e10, h10.__e = false, x2 = a$.__r, E2 = 0, b2) {
            for (h10.state = h10.__s, h10.__d = false, x2 && x2(t10), u10 = h10.render(h10.props, h10.state, h10.context), k2 = 0; k2 < h10._sb.length; k2++) h10.__h.push(h10._sb[k2]);
            h10._sb = [];
          } else do
            h10.__d = false, x2 && x2(t10), u10 = h10.render(h10.props, h10.state, h10.context), h10.state = h10.__s;
          while (h10.__d && ++E2 < 25);
          h10.state = h10.__s, null != h10.getChildContext && (n10 = az(az({}, n10), h10.getChildContext())), b2 && !d2 && null != h10.getSnapshotBeforeUpdate && (g2 = h10.getSnapshotBeforeUpdate(p2, f2)), a1(e10, aF(S2 = null != u10 && u10.type === aX && null == u10.key ? u10.props.children : u10) ? S2 : [S2], t10, r10, n10, i10, a10, s10, o10, l10, c10), h10.base = t10.__e, t10.__u &= -161, h10.__h.length && s10.push(h10), m2 && (h10.__E = h10.__ = null);
        } catch (e11) {
          if (t10.__v = null, l10 || null != a10) {
            for (t10.__u |= l10 ? 160 : 128; o10 && 8 === o10.nodeType && o10.nextSibling; ) o10 = o10.nextSibling;
            a10[a10.indexOf(o10)] = null, t10.__e = o10;
          } else t10.__e = r10.__e, t10.__k = r10.__k;
          a$.__e(e11, t10, r10);
        }
        else null == a10 && t10.__v === r10.__v ? (t10.__k = r10.__k, t10.__e = r10.__e) : t10.__e = function(e11, t11, r11, n11, i11, a11, s11, o11, l11) {
          var c11, u11, h11, d3, p3, f3, g3, m3 = r11.props, y3 = t11.props, b3 = t11.type;
          if ("svg" === b3 ? i11 = "http://www.w3.org/2000/svg" : "math" === b3 ? i11 = "http://www.w3.org/1998/Math/MathML" : i11 || (i11 = "http://www.w3.org/1999/xhtml"), null != a11) {
            for (c11 = 0; c11 < a11.length; c11++) if ((p3 = a11[c11]) && "setAttribute" in p3 == !!b3 && (b3 ? p3.localName === b3 : 3 === p3.nodeType)) {
              e11 = p3, a11[c11] = null;
              break;
            }
          }
          if (null == e11) {
            if (null === b3) return document.createTextNode(y3);
            e11 = document.createElementNS(i11, b3, y3.is && y3), o11 && (a$.__m && a$.__m(t11, a11), o11 = false), a11 = null;
          }
          if (null === b3) m3 === y3 || o11 && e11.data === y3 || (e11.data = y3);
          else {
            if (a11 = a11 && aj.call(e11.childNodes), m3 = r11.props || aq, !o11 && null != a11) for (m3 = {}, c11 = 0; c11 < e11.attributes.length; c11++) m3[(p3 = e11.attributes[c11]).name] = p3.value;
            for (c11 in m3) if (p3 = m3[c11], "children" == c11) ;
            else if ("dangerouslySetInnerHTML" == c11) h11 = p3;
            else if (!(c11 in y3)) {
              if ("value" == c11 && "defaultValue" in y3 || "checked" == c11 && "defaultChecked" in y3) continue;
              a5(e11, c11, null, p3, i11);
            }
            for (c11 in y3) p3 = y3[c11], "children" == c11 ? d3 = p3 : "dangerouslySetInnerHTML" == c11 ? u11 = p3 : "value" == c11 ? f3 = p3 : "checked" == c11 ? g3 = p3 : o11 && "function" != typeof p3 || m3[c11] === p3 || a5(e11, c11, p3, m3[c11], i11);
            if (u11) o11 || h11 && (u11.__html === h11.__html || u11.__html === e11.innerHTML) || (e11.innerHTML = u11.__html), t11.__k = [];
            else if (h11 && (e11.innerHTML = ""), a1(e11, aF(d3) ? d3 : [d3], t11, r11, n11, "foreignObject" === b3 ? "http://www.w3.org/1999/xhtml" : i11, a11, s11, a11 ? a11[0] : r11.__k && aZ(r11, 0), o11, l11), null != a11) for (c11 = a11.length; c11--; ) aV(a11[c11]);
            o11 || (c11 = "value", "progress" === b3 && null == f3 ? e11.removeAttribute("value") : void 0 === f3 || f3 === e11[c11] && ("progress" !== b3 || f3) && ("option" !== b3 || f3 === m3[c11]) || a5(e11, c11, f3, m3[c11], i11), c11 = "checked", void 0 !== g3 && g3 !== e11[c11] && a5(e11, c11, g3, m3[c11], i11));
          }
          return e11;
        }(r10.__e, t10, r10, n10, i10, a10, s10, l10, c10);
        (u10 = a$.diffed) && u10(t10);
      }
      function a4(e10, t10, r10) {
        try {
          if ("function" == typeof e10) {
            var n10 = "function" == typeof e10.__u;
            n10 && e10.__u(), n10 && null == t10 || (e10.__u = e10(t10));
          } else e10.current = t10;
        } catch (e11) {
          a$.__e(e11, r10);
        }
      }
      function a8(e10, t10, r10) {
        return this.constructor(e10, r10);
      }
      aj = aK.slice, a$ = { __e: function(e10, t10, r10, n10) {
        for (var i10, a10, s10; t10 = t10.__; ) if ((i10 = t10.__c) && !i10.__) try {
          if ((a10 = i10.constructor) && null != a10.getDerivedStateFromError && (i10.setState(a10.getDerivedStateFromError(e10)), s10 = i10.__d), null != i10.componentDidCatch && (i10.componentDidCatch(e10, n10 || {}), s10 = i10.__d), s10) return i10.__E = i10;
        } catch (t11) {
          e10 = t11;
        }
        throw e10;
      } }, aN = 0, aY.prototype.setState = function(e10, t10) {
        var r10;
        r10 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = az({}, this.state), "function" == typeof e10 && (e10 = e10(az({}, r10), this.props)), e10 && az(r10, e10), null != e10 && this.__v && (t10 && this._sb.push(t10), aQ(this));
      }, aY.prototype.forceUpdate = function(e10) {
        this.__v && (this.__e = true, e10 && this.__h.push(e10), aQ(this));
      }, aY.prototype.render = aX, aU = [], aL = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, aM = function(e10, t10) {
        return e10.__v.__b - t10.__v.__b;
      }, a0.__r = 0, aH = 0, aB = a6(false), aW = a6(true);
      var a9 = /[\s\n\\/='"\0<>]/, a7 = /^(xlink|xmlns|xml)([A-Z])/, se = /^accessK|^auto[A-Z]|^cell|^ch|^col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z]/, st = /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/, sr = /* @__PURE__ */ new Set(["draggable", "spellcheck"]), sn = /["&<]/;
      function si(e10) {
        if (0 === e10.length || false === sn.test(e10)) return e10;
        for (var t10 = 0, r10 = 0, n10 = "", i10 = ""; r10 < e10.length; r10++) {
          switch (e10.charCodeAt(r10)) {
            case 34:
              i10 = "&quot;";
              break;
            case 38:
              i10 = "&amp;";
              break;
            case 60:
              i10 = "&lt;";
              break;
            default:
              continue;
          }
          r10 !== t10 && (n10 += e10.slice(t10, r10)), n10 += i10, t10 = r10 + 1;
        }
        return r10 !== t10 && (n10 += e10.slice(t10, r10)), n10;
      }
      var sa = {}, ss = /* @__PURE__ */ new Set(["animation-iteration-count", "border-image-outset", "border-image-slice", "border-image-width", "box-flex", "box-flex-group", "box-ordinal-group", "column-count", "fill-opacity", "flex", "flex-grow", "flex-negative", "flex-order", "flex-positive", "flex-shrink", "flood-opacity", "font-weight", "grid-column", "grid-row", "line-clamp", "line-height", "opacity", "order", "orphans", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tab-size", "widows", "z-index", "zoom"]), so = /[A-Z]/g;
      function sl() {
        this.__d = true;
      }
      function sc(e10, t10, r10) {
        if (!e10.s) {
          if (r10 instanceof sf) {
            if (!r10.s) return void (r10.o = sc.bind(null, e10, t10));
            1 & t10 && (t10 = r10.s), r10 = r10.v;
          }
          if (r10 && r10.then) return void r10.then(sc.bind(null, e10, t10), sc.bind(null, e10, 2));
          e10.s = t10, e10.v = r10;
          let n10 = e10.o;
          n10 && n10(e10);
        }
      }
      var su, sh, sd, sp, sf = function() {
        function e10() {
        }
        return e10.prototype.then = function(t10, r10) {
          var n10 = new e10(), i10 = this.s;
          if (i10) {
            var a10 = 1 & i10 ? t10 : r10;
            if (a10) {
              try {
                sc(n10, 1, a10(this.v));
              } catch (e11) {
                sc(n10, 2, e11);
              }
              return n10;
            }
            return this;
          }
          return this.o = function(e11) {
            try {
              var i11 = e11.v;
              1 & e11.s ? sc(n10, 1, t10 ? t10(i11) : i11) : r10 ? sc(n10, 1, r10(i11)) : sc(n10, 2, i11);
            } catch (e12) {
              sc(n10, 2, e12);
            }
          }, n10;
        }, e10;
      }(), sg = {}, sm = [], sy = Array.isArray, sb = Object.assign;
      function sw(e10, t10) {
        var r10, n10 = e10.type, i10 = true;
        return e10.__c ? (i10 = false, (r10 = e10.__c).state = r10.__s) : r10 = new n10(e10.props, t10), e10.__c = r10, r10.__v = e10, r10.props = e10.props, r10.context = t10, r10.__d = true, null == r10.state && (r10.state = sg), null == r10.__s && (r10.__s = r10.state), n10.getDerivedStateFromProps ? r10.state = sb({}, r10.state, n10.getDerivedStateFromProps(r10.props, r10.state)) : i10 && r10.componentWillMount ? (r10.componentWillMount(), r10.state = r10.__s !== r10.state ? r10.__s : r10.state) : !i10 && r10.componentWillUpdate && r10.componentWillUpdate(), sd && sd(e10), r10.render(r10.props, r10.state, t10);
      }
      var sv = /* @__PURE__ */ new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]), s_ = 0;
      function sx(e10, t10, r10, n10, i10, a10) {
        t10 || (t10 = {});
        var s10, o10, l10 = t10;
        "ref" in t10 && (s10 = t10.ref, delete t10.ref);
        var c10 = { type: e10, props: l10, key: r10, ref: s10, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --s_, __i: -1, __u: 0, __source: i10, __self: a10 };
        if ("function" == typeof e10 && (s10 = e10.defaultProps)) for (o10 in s10) void 0 === l10[o10] && (l10[o10] = s10[o10]);
        return a$.vnode && a$.vnode(c10), c10;
      }
      async function sE(e10, t10) {
        let r10 = window.SimpleWebAuthnBrowser;
        async function n10(r11) {
          let n11 = new URL(`${e10}/webauthn-options/${t10}`);
          r11 && n11.searchParams.append("action", r11), a10().forEach((e11) => {
            n11.searchParams.append(e11.name, e11.value);
          });
          let i11 = await fetch(n11);
          return i11.ok ? i11.json() : void console.error("Failed to fetch options", i11);
        }
        function i10() {
          let e11 = `#${t10}-form`, r11 = document.querySelector(e11);
          if (!r11) throw Error(`Form '${e11}' not found`);
          return r11;
        }
        function a10() {
          return Array.from(i10().querySelectorAll("input[data-form-field]"));
        }
        async function s10(e11, t11) {
          let r11 = i10();
          if (e11) {
            let t12 = document.createElement("input");
            t12.type = "hidden", t12.name = "action", t12.value = e11, r11.appendChild(t12);
          }
          if (t11) {
            let e12 = document.createElement("input");
            e12.type = "hidden", e12.name = "data", e12.value = JSON.stringify(t11), r11.appendChild(e12);
          }
          return r11.submit();
        }
        async function o10(e11, t11) {
          let n11 = await r10.startAuthentication(e11, t11);
          return await s10("authenticate", n11);
        }
        async function l10(e11) {
          a10().forEach((e12) => {
            if (e12.required && !e12.value) throw Error(`Missing required field: ${e12.name}`);
          });
          let t11 = await r10.startRegistration(e11);
          return await s10("register", t11);
        }
        async function c10() {
          if (!r10.browserSupportsWebAuthnAutofill()) return;
          let e11 = await n10("authenticate");
          if (!e11) return void console.error("Failed to fetch option for autofill authentication");
          try {
            await o10(e11.options, true);
          } catch (e12) {
            console.error(e12);
          }
        }
        (async function() {
          let e11 = i10();
          if (!r10.browserSupportsWebAuthn()) {
            e11.style.display = "none";
            return;
          }
          e11 && e11.addEventListener("submit", async (e12) => {
            e12.preventDefault();
            let t11 = await n10(void 0);
            if (!t11) return void console.error("Failed to fetch options for form submission");
            if ("authenticate" === t11.action) try {
              await o10(t11.options, false);
            } catch (e13) {
              console.error(e13);
            }
            else if ("register" === t11.action) try {
              await l10(t11.options);
            } catch (e13) {
              console.error(e13);
            }
          });
        })(), c10();
      }
      let sk = { default: "Unable to sign in.", Signin: "Try signing in with a different account.", OAuthSignin: "Try signing in with a different account.", OAuthCallbackError: "Try signing in with a different account.", OAuthCreateAccount: "Try signing in with a different account.", EmailCreateAccount: "Try signing in with a different account.", Callback: "Try signing in with a different account.", OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.", EmailSignin: "The e-mail could not be sent.", CredentialsSignin: "Sign in failed. Check the details you provided are correct.", SessionRequired: "Please sign in to access this page." }, sS = `:root {
  --border-width: 1px;
  --border-radius: 0.5rem;
  --color-error: #c94b4b;
  --color-info: #157efb;
  --color-info-hover: #0f6ddb;
  --color-info-text: #fff;
}

.__next-auth-theme-auto,
.__next-auth-theme-light {
  --color-background: #ececec;
  --color-background-hover: rgba(236, 236, 236, 0.8);
  --color-background-card: #fff;
  --color-text: #000;
  --color-primary: #444;
  --color-control-border: #bbb;
  --color-button-active-background: #f9f9f9;
  --color-button-active-border: #aaa;
  --color-separator: #ccc;
  --provider-bg: #fff;
  --provider-bg-hover: color-mix(
    in srgb,
    var(--provider-brand-color) 30%,
    #fff
  );
}

.__next-auth-theme-dark {
  --color-background: #161b22;
  --color-background-hover: rgba(22, 27, 34, 0.8);
  --color-background-card: #0d1117;
  --color-text: #fff;
  --color-primary: #ccc;
  --color-control-border: #555;
  --color-button-active-background: #060606;
  --color-button-active-border: #666;
  --color-separator: #444;
  --provider-bg: #161b22;
  --provider-bg-hover: color-mix(
    in srgb,
    var(--provider-brand-color) 30%,
    #000
  );
}

.__next-auth-theme-dark img[src$="42-school.svg"],
  .__next-auth-theme-dark img[src$="apple.svg"],
  .__next-auth-theme-dark img[src$="boxyhq-saml.svg"],
  .__next-auth-theme-dark img[src$="eveonline.svg"],
  .__next-auth-theme-dark img[src$="github.svg"],
  .__next-auth-theme-dark img[src$="mailchimp.svg"],
  .__next-auth-theme-dark img[src$="medium.svg"],
  .__next-auth-theme-dark img[src$="okta.svg"],
  .__next-auth-theme-dark img[src$="patreon.svg"],
  .__next-auth-theme-dark img[src$="ping-id.svg"],
  .__next-auth-theme-dark img[src$="roblox.svg"],
  .__next-auth-theme-dark img[src$="threads.svg"],
  .__next-auth-theme-dark img[src$="wikimedia.svg"] {
    filter: invert(1);
  }

.__next-auth-theme-dark #submitButton {
    background-color: var(--provider-bg, var(--color-info));
  }

@media (prefers-color-scheme: dark) {
  .__next-auth-theme-auto {
    --color-background: #161b22;
    --color-background-hover: rgba(22, 27, 34, 0.8);
    --color-background-card: #0d1117;
    --color-text: #fff;
    --color-primary: #ccc;
    --color-control-border: #555;
    --color-button-active-background: #060606;
    --color-button-active-border: #666;
    --color-separator: #444;
    --provider-bg: #161b22;
    --provider-bg-hover: color-mix(
      in srgb,
      var(--provider-brand-color) 30%,
      #000
    );
  }
    .__next-auth-theme-auto img[src$="42-school.svg"],
    .__next-auth-theme-auto img[src$="apple.svg"],
    .__next-auth-theme-auto img[src$="boxyhq-saml.svg"],
    .__next-auth-theme-auto img[src$="eveonline.svg"],
    .__next-auth-theme-auto img[src$="github.svg"],
    .__next-auth-theme-auto img[src$="mailchimp.svg"],
    .__next-auth-theme-auto img[src$="medium.svg"],
    .__next-auth-theme-auto img[src$="okta.svg"],
    .__next-auth-theme-auto img[src$="patreon.svg"],
    .__next-auth-theme-auto img[src$="ping-id.svg"],
    .__next-auth-theme-auto img[src$="roblox.svg"],
    .__next-auth-theme-auto img[src$="threads.svg"],
    .__next-auth-theme-auto img[src$="wikimedia.svg"] {
      filter: invert(1);
    }
    .__next-auth-theme-auto #submitButton {
      background-color: var(--provider-bg, var(--color-info));
    }
}

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-background);
  margin: 0;
  padding: 0;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Noto Sans",
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
}

h1 {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  font-weight: 400;
  color: var(--color-text);
}

p {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  color: var(--color-text);
}

form {
  margin: 0;
  padding: 0;
}

label {
  font-weight: 500;
  text-align: left;
  margin-bottom: 0.25rem;
  display: block;
  color: var(--color-text);
}

input[type] {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: var(--border-width) solid var(--color-control-border);
  background: var(--color-background-card);
  font-size: 1rem;
  border-radius: var(--border-radius);
  color: var(--color-text);
}

p {
  font-size: 1.1rem;
  line-height: 2rem;
}

a.button {
  text-decoration: none;
  line-height: 1rem;
}

a.button:link,
  a.button:visited {
    background-color: var(--color-background);
    color: var(--color-primary);
  }

button,
a.button {
  padding: 0.75rem 1rem;
  color: var(--provider-color, var(--color-primary));
  background-color: var(--provider-bg, var(--color-background));
  border: 1px solid #00000031;
  font-size: 0.9rem;
  height: 50px;
  border-radius: var(--border-radius);
  transition: background-color 250ms ease-in-out;
  font-weight: 300;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:is(button,a.button):hover {
    background-color: var(--provider-bg-hover, var(--color-background-hover));
    cursor: pointer;
  }

:is(button,a.button):active {
    cursor: pointer;
  }

:is(button,a.button) span {
    color: var(--provider-bg);
  }

#submitButton {
  color: var(--button-text-color, var(--color-info-text));
  background-color: var(--brand-color, var(--color-info));
  width: 100%;
}

#submitButton:hover {
    background-color: var(
      --button-hover-bg,
      var(--color-info-hover)
    ) !important;
  }

a.site {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 1rem;
  line-height: 2rem;
}

a.site:hover {
    text-decoration: underline;
  }

.page {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page > div {
    text-align: center;
  }

.error a.button {
    padding-left: 2rem;
    padding-right: 2rem;
    margin-top: 0.5rem;
  }

.error .message {
    margin-bottom: 1.5rem;
  }

.signin input[type="text"] {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

.signin hr {
    display: block;
    border: 0;
    border-top: 1px solid var(--color-separator);
    margin: 2rem auto 1rem auto;
    overflow: visible;
  }

.signin hr::before {
      content: "or";
      background: var(--color-background-card);
      color: #888;
      padding: 0 0.4rem;
      position: relative;
      top: -0.7rem;
    }

.signin .error {
    background: #f5f5f5;
    font-weight: 500;
    border-radius: 0.3rem;
    background: var(--color-error);
  }

.signin .error p {
      text-align: left;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      line-height: 1.2rem;
      color: var(--color-info-text);
    }

.signin > div,
  .signin form {
    display: block;
  }

.signin > div input[type], .signin form input[type] {
      margin-bottom: 0.5rem;
    }

.signin > div button, .signin form button {
      width: 100%;
    }

.signin .provider + .provider {
    margin-top: 1rem;
  }

.logo {
  display: inline-block;
  max-width: 150px;
  margin: 1.25rem 0;
  max-height: 70px;
}

.card {
  background-color: var(--color-background-card);
  border-radius: 1rem;
  padding: 1.25rem 2rem;
}

.card .header {
    color: var(--color-primary);
  }

.card input[type]::-moz-placeholder {
    color: color-mix(
      in srgb,
      var(--color-text) 20%,
      var(--color-button-active-background)
    );
  }

.card input[type]::placeholder {
    color: color-mix(
      in srgb,
      var(--color-text) 20%,
      var(--color-button-active-background)
    );
  }

.card input[type] {
    background: color-mix(in srgb, var(--color-background-card) 95%, black);
  }

.section-header {
  color: var(--color-text);
}

@media screen and (min-width: 450px) {
  .card {
    margin: 2rem 0;
    width: 368px;
  }
}

@media screen and (max-width: 450px) {
  .card {
    margin: 1rem 0;
    width: 343px;
  }
}
`;
      function sT({ html: e10, title: t10, status: r10, cookies: n10, theme: i10, headTags: a10 }) {
        return { cookies: n10, status: r10, headers: { "Content-Type": "text/html" }, body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${sS}</style><title>${t10}</title>${a10 ?? ""}</head><body class="__next-auth-theme-${i10?.colorScheme ?? "auto"}"><div class="page">${function(e11) {
          var t11 = a$.__s;
          a$.__s = true, su = a$.__b, sh = a$.diffed, sd = a$.__r, sp = a$.unmount;
          var r11 = function(e12, t12, r12) {
            var n12, i11, a11, s10 = {};
            for (a11 in t12) "key" == a11 ? n12 = t12[a11] : "ref" == a11 ? i11 = t12[a11] : s10[a11] = t12[a11];
            if (arguments.length > 2 && (s10.children = arguments.length > 3 ? aj.call(arguments, 2) : r12), "function" == typeof e12 && null != e12.defaultProps) for (a11 in e12.defaultProps) void 0 === s10[a11] && (s10[a11] = e12.defaultProps[a11]);
            return aG(e12, s10, n12, i11, null);
          }(aX, null);
          r11.__k = [e11];
          try {
            var n11 = function e12(t12, r12, n12, i11, a11, s10, o10) {
              if (null == t12 || true === t12 || false === t12 || "" === t12) return "";
              var l10 = typeof t12;
              if ("object" != l10) return "function" == l10 ? "" : "string" == l10 ? si(t12) : t12 + "";
              if (sy(t12)) {
                var c10, u10 = "";
                a11.__k = t12;
                for (var h10 = 0; h10 < t12.length; h10++) {
                  var d2 = t12[h10];
                  if (null != d2 && "boolean" != typeof d2) {
                    var p2, f2 = e12(d2, r12, n12, i11, a11, s10, o10);
                    "string" == typeof f2 ? u10 += f2 : (c10 || (c10 = []), u10 && c10.push(u10), u10 = "", sy(f2) ? (p2 = c10).push.apply(p2, f2) : c10.push(f2));
                  }
                }
                return c10 ? (u10 && c10.push(u10), c10) : u10;
              }
              if (void 0 !== t12.constructor) return "";
              t12.__ = a11, su && su(t12);
              var g2 = t12.type, m2 = t12.props;
              if ("function" == typeof g2) {
                var y2, b2, w2, v2 = r12;
                if (g2 === aX) {
                  if ("tpl" in m2) {
                    for (var _2 = "", x2 = 0; x2 < m2.tpl.length; x2++) if (_2 += m2.tpl[x2], m2.exprs && x2 < m2.exprs.length) {
                      var E2 = m2.exprs[x2];
                      if (null == E2) continue;
                      "object" == typeof E2 && (void 0 === E2.constructor || sy(E2)) ? _2 += e12(E2, r12, n12, i11, t12, s10, o10) : _2 += E2;
                    }
                    return _2;
                  }
                  if ("UNSTABLE_comment" in m2) return "<!--" + si(m2.UNSTABLE_comment) + "-->";
                  b2 = m2.children;
                } else {
                  if (null != (y2 = g2.contextType)) {
                    var k2 = r12[y2.__c];
                    v2 = k2 ? k2.props.value : y2.__;
                  }
                  var S2 = g2.prototype && "function" == typeof g2.prototype.render;
                  if (S2) b2 = sw(t12, v2), w2 = t12.__c;
                  else {
                    t12.__c = w2 = { __v: t12, context: v2, props: t12.props, setState: sl, forceUpdate: sl, __d: true, __h: [] };
                    for (var T2 = 0; w2.__d && T2++ < 25; ) w2.__d = false, sd && sd(t12), b2 = g2.call(w2, m2, v2);
                    w2.__d = true;
                  }
                  if (null != w2.getChildContext && (r12 = sb({}, r12, w2.getChildContext())), S2 && a$.errorBoundaries && (g2.getDerivedStateFromError || w2.componentDidCatch)) {
                    b2 = null != b2 && b2.type === aX && null == b2.key && null == b2.props.tpl ? b2.props.children : b2;
                    try {
                      return e12(b2, r12, n12, i11, t12, s10, o10);
                    } catch (a12) {
                      return g2.getDerivedStateFromError && (w2.__s = g2.getDerivedStateFromError(a12)), w2.componentDidCatch && w2.componentDidCatch(a12, sg), w2.__d ? (b2 = sw(t12, r12), null != (w2 = t12.__c).getChildContext && (r12 = sb({}, r12, w2.getChildContext())), e12(b2 = null != b2 && b2.type === aX && null == b2.key && null == b2.props.tpl ? b2.props.children : b2, r12, n12, i11, t12, s10, o10)) : "";
                    } finally {
                      sh && sh(t12), t12.__ = null, sp && sp(t12);
                    }
                  }
                }
                b2 = null != b2 && b2.type === aX && null == b2.key && null == b2.props.tpl ? b2.props.children : b2;
                try {
                  var A2 = e12(b2, r12, n12, i11, t12, s10, o10);
                  return sh && sh(t12), t12.__ = null, a$.unmount && a$.unmount(t12), A2;
                } catch (a12) {
                  if (!s10 && o10 && o10.onError) {
                    var R2 = o10.onError(a12, t12, function(a13) {
                      return e12(a13, r12, n12, i11, t12, s10, o10);
                    });
                    if (void 0 !== R2) return R2;
                    var C2 = a$.__e;
                    return C2 && C2(a12, t12), "";
                  }
                  if (!s10 || !a12 || "function" != typeof a12.then) throw a12;
                  return a12.then(function a13() {
                    try {
                      return e12(b2, r12, n12, i11, t12, s10, o10);
                    } catch (l11) {
                      if (!l11 || "function" != typeof l11.then) throw l11;
                      return l11.then(function() {
                        return e12(b2, r12, n12, i11, t12, s10, o10);
                      }, a13);
                    }
                  });
                }
              }
              var O2, P2 = "<" + g2, I2 = "";
              for (var j2 in m2) {
                var $2 = m2[j2];
                if ("function" != typeof $2 || "class" === j2 || "className" === j2) {
                  switch (j2) {
                    case "children":
                      O2 = $2;
                      continue;
                    case "key":
                    case "ref":
                    case "__self":
                    case "__source":
                      continue;
                    case "htmlFor":
                      if ("for" in m2) continue;
                      j2 = "for";
                      break;
                    case "className":
                      if ("class" in m2) continue;
                      j2 = "class";
                      break;
                    case "defaultChecked":
                      j2 = "checked";
                      break;
                    case "defaultSelected":
                      j2 = "selected";
                      break;
                    case "defaultValue":
                    case "value":
                      switch (j2 = "value", g2) {
                        case "textarea":
                          O2 = $2;
                          continue;
                        case "select":
                          i11 = $2;
                          continue;
                        case "option":
                          i11 != $2 || "selected" in m2 || (P2 += " selected");
                      }
                      break;
                    case "dangerouslySetInnerHTML":
                      I2 = $2 && $2.__html;
                      continue;
                    case "style":
                      "object" == typeof $2 && ($2 = function(e13) {
                        var t13 = "";
                        for (var r13 in e13) {
                          var n13 = e13[r13];
                          if (null != n13 && "" !== n13) {
                            var i12 = "-" == r13[0] ? r13 : sa[r13] || (sa[r13] = r13.replace(so, "-$&").toLowerCase()), a12 = ";";
                            "number" != typeof n13 || i12.startsWith("--") || ss.has(i12) || (a12 = "px;"), t13 = t13 + i12 + ":" + n13 + a12;
                          }
                        }
                        return t13 || void 0;
                      }($2));
                      break;
                    case "acceptCharset":
                      j2 = "accept-charset";
                      break;
                    case "httpEquiv":
                      j2 = "http-equiv";
                      break;
                    default:
                      if (a7.test(j2)) j2 = j2.replace(a7, "$1:$2").toLowerCase();
                      else {
                        if (a9.test(j2)) continue;
                        ("-" === j2[4] || sr.has(j2)) && null != $2 ? $2 += "" : n12 ? st.test(j2) && (j2 = "panose1" === j2 ? "panose-1" : j2.replace(/([A-Z])/g, "-$1").toLowerCase()) : se.test(j2) && (j2 = j2.toLowerCase());
                      }
                  }
                  null != $2 && false !== $2 && (P2 = true === $2 || "" === $2 ? P2 + " " + j2 : P2 + " " + j2 + '="' + ("string" == typeof $2 ? si($2) : $2 + "") + '"');
                }
              }
              if (a9.test(g2)) throw Error(g2 + " is not a valid HTML tag name in " + P2 + ">");
              if (I2 || ("string" == typeof O2 ? I2 = si(O2) : null != O2 && false !== O2 && true !== O2 && (I2 = e12(O2, r12, "svg" === g2 || "foreignObject" !== g2 && n12, i11, t12, s10, o10))), sh && sh(t12), t12.__ = null, sp && sp(t12), !I2 && sv.has(g2)) return P2 + "/>";
              var N2 = "</" + g2 + ">", U2 = P2 + ">";
              return sy(I2) ? [U2].concat(I2, [N2]) : "string" != typeof I2 ? [U2, I2, N2] : U2 + I2 + N2;
            }(e11, sg, false, void 0, r11, false, void 0);
            return sy(n11) ? n11.join("") : n11;
          } catch (e12) {
            if (e12.then) throw Error('Use "renderToStringAsync" for suspenseful rendering.');
            throw e12;
          } finally {
            a$.__c && a$.__c(e11, sm), a$.__s = t11, sm.length = 0;
          }
        }(e10)}</div></body></html>` };
      }
      function sA(e10) {
        let { url: t10, theme: r10, query: n10, cookies: i10, pages: a10, providers: s10 } = e10;
        return { csrf: (e11, t11, r11) => e11 ? (t11.logger.warn("csrf-disabled"), r11.push({ name: t11.cookies.csrfToken.name, value: "", options: { ...t11.cookies.csrfToken.options, maxAge: 0 } }), { status: 404, cookies: r11 }) : { headers: { "Content-Type": "application/json", "Cache-Control": "private, no-cache, no-store", Expires: "0", Pragma: "no-cache" }, body: { csrfToken: t11.csrfToken }, cookies: r11 }, providers: (e11) => ({ headers: { "Content-Type": "application/json" }, body: e11.reduce((e12, { id: t11, name: r11, type: n11, signinUrl: i11, callbackUrl: a11 }) => (e12[t11] = { id: t11, name: r11, type: n11, signinUrl: i11, callbackUrl: a11 }, e12), {}) }), signin(t11, o10) {
          if (t11) throw new rN("Unsupported action");
          if (a10?.signIn) {
            let t12 = `${a10.signIn}${a10.signIn.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: e10.callbackUrl ?? "/" })}`;
            return o10 && (t12 = `${t12}&${new URLSearchParams({ error: o10 })}`), { redirect: t12, cookies: i10 };
          }
          let l10 = s10?.find((e11) => "webauthn" === e11.type && e11.enableConditionalUI && !!e11.simpleWebAuthnBrowserVersion), c10 = "";
          if (l10) {
            let { simpleWebAuthnBrowserVersion: e11 } = l10;
            c10 = `<script src="https://unpkg.com/@simplewebauthn/browser@${e11}/dist/bundle/index.umd.min.js" crossorigin="anonymous"></script>`;
          }
          return sT({ cookies: i10, theme: r10, html: function(e11) {
            let { csrfToken: t12, providers: r11 = [], callbackUrl: n11, theme: i11, email: a11, error: s11 } = e11;
            "u" > typeof document && i11?.brandColor && document.documentElement.style.setProperty("--brand-color", i11.brandColor), "u" > typeof document && i11?.buttonText && document.documentElement.style.setProperty("--button-text-color", i11.buttonText);
            let o11 = s11 && (sk[s11] ?? sk.default), l11 = r11.find((e12) => "webauthn" === e12.type && e12.enableConditionalUI)?.id;
            return sx("div", { className: "signin", children: [i11?.brandColor && sx("style", { dangerouslySetInnerHTML: { __html: `:root {--brand-color: ${i11.brandColor}}` } }), i11?.buttonText && sx("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --button-text-color: ${i11.buttonText}
        }
      ` } }), sx("div", { className: "card", children: [o11 && sx("div", { className: "error", children: sx("p", { children: o11 }) }), i11?.logo && sx("img", { src: i11.logo, alt: "Logo", className: "logo" }), r11.map((e12, i12) => {
              let s12, o12, l12;
              ("oauth" === e12.type || "oidc" === e12.type) && ({ bg: s12 = "#fff", brandColor: o12, logo: l12 = `https://authjs.dev/img/providers/${e12.id}.svg` } = e12.style ?? {});
              let c11 = o12 ?? s12 ?? "#fff";
              return sx("div", { className: "provider", children: ["oauth" === e12.type || "oidc" === e12.type ? sx("form", { action: e12.signinUrl, method: "POST", children: [sx("input", { type: "hidden", name: "csrfToken", value: t12 }), n11 && sx("input", { type: "hidden", name: "callbackUrl", value: n11 }), sx("button", { type: "submit", className: "button", style: { "--provider-brand-color": c11 }, tabIndex: 0, children: [sx("span", { style: { filter: "invert(1) grayscale(1) brightness(1.3) contrast(9000)", "mix-blend-mode": "luminosity", opacity: 0.95 }, children: ["Sign in with ", e12.name] }), l12 && sx("img", { loading: "lazy", height: 24, src: l12 })] })] }) : null, ("email" === e12.type || "credentials" === e12.type || "webauthn" === e12.type) && i12 > 0 && "email" !== r11[i12 - 1].type && "credentials" !== r11[i12 - 1].type && "webauthn" !== r11[i12 - 1].type && sx("hr", {}), "email" === e12.type && sx("form", { action: e12.signinUrl, method: "POST", children: [sx("input", { type: "hidden", name: "csrfToken", value: t12 }), sx("label", { className: "section-header", htmlFor: `input-email-for-${e12.id}-provider`, children: "Email" }), sx("input", { id: `input-email-for-${e12.id}-provider`, autoFocus: true, type: "email", name: "email", value: a11, placeholder: "email@example.com", required: true }), sx("button", { id: "submitButton", type: "submit", tabIndex: 0, children: ["Sign in with ", e12.name] })] }), "credentials" === e12.type && sx("form", { action: e12.callbackUrl, method: "POST", children: [sx("input", { type: "hidden", name: "csrfToken", value: t12 }), Object.keys(e12.credentials).map((t13) => sx("div", { children: [sx("label", { className: "section-header", htmlFor: `input-${t13}-for-${e12.id}-provider`, children: e12.credentials[t13].label ?? t13 }), sx("input", { name: t13, id: `input-${t13}-for-${e12.id}-provider`, type: e12.credentials[t13].type ?? "text", placeholder: e12.credentials[t13].placeholder ?? "", ...e12.credentials[t13] })] }, `input-group-${e12.id}`)), sx("button", { id: "submitButton", type: "submit", tabIndex: 0, children: ["Sign in with ", e12.name] })] }), "webauthn" === e12.type && sx("form", { action: e12.callbackUrl, method: "POST", id: `${e12.id}-form`, children: [sx("input", { type: "hidden", name: "csrfToken", value: t12 }), Object.keys(e12.formFields).map((t13) => sx("div", { children: [sx("label", { className: "section-header", htmlFor: `input-${t13}-for-${e12.id}-provider`, children: e12.formFields[t13].label ?? t13 }), sx("input", { name: t13, "data-form-field": true, id: `input-${t13}-for-${e12.id}-provider`, type: e12.formFields[t13].type ?? "text", placeholder: e12.formFields[t13].placeholder ?? "", ...e12.formFields[t13] })] }, `input-group-${e12.id}`)), sx("button", { id: `submitButton-${e12.id}`, type: "submit", tabIndex: 0, children: ["Sign in with ", e12.name] })] }), ("email" === e12.type || "credentials" === e12.type || "webauthn" === e12.type) && i12 + 1 < r11.length && sx("hr", {})] }, e12.id);
            })] }), l11 && sx(aX, { children: sx("script", { dangerouslySetInnerHTML: { __html: `
const currentURL = window.location.href;
const authURL = currentURL.substring(0, currentURL.lastIndexOf('/'));
(${sE})(authURL, "${l11}");
` } }) })] });
          }({ csrfToken: e10.csrfToken, providers: e10.providers?.filter((e11) => ["email", "oauth", "oidc"].includes(e11.type) || "credentials" === e11.type && e11.credentials || "webauthn" === e11.type && e11.formFields || false), callbackUrl: e10.callbackUrl, theme: e10.theme, error: o10, ...n10 }), title: "Sign In", headTags: c10 });
        }, signout: () => a10?.signOut ? { redirect: a10.signOut, cookies: i10 } : sT({ cookies: i10, theme: r10, html: function(e11) {
          let { url: t11, csrfToken: r11, theme: n11 } = e11;
          return sx("div", { className: "signout", children: [n11?.brandColor && sx("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${n11.brandColor}
        }
      ` } }), n11?.buttonText && sx("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --button-text-color: ${n11.buttonText}
        }
      ` } }), sx("div", { className: "card", children: [n11?.logo && sx("img", { src: n11.logo, alt: "Logo", className: "logo" }), sx("h1", { children: "Signout" }), sx("p", { children: "Are you sure you want to sign out?" }), sx("form", { action: t11?.toString(), method: "POST", children: [sx("input", { type: "hidden", name: "csrfToken", value: r11 }), sx("button", { id: "submitButton", type: "submit", children: "Sign out" })] })] })] });
        }({ csrfToken: e10.csrfToken, url: t10, theme: r10 }), title: "Sign Out" }), verifyRequest: (e11) => a10?.verifyRequest ? { redirect: `${a10.verifyRequest}${t10?.search ?? ""}`, cookies: i10 } : sT({ cookies: i10, theme: r10, html: function(e12) {
          let { url: t11, theme: r11 } = e12;
          return sx("div", { className: "verify-request", children: [r11.brandColor && sx("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${r11.brandColor}
        }
      ` } }), sx("div", { className: "card", children: [r11.logo && sx("img", { src: r11.logo, alt: "Logo", className: "logo" }), sx("h1", { children: "Check your email" }), sx("p", { children: "A sign in link has been sent to your email address." }), sx("p", { children: sx("a", { className: "site", href: t11.origin, children: t11.host }) })] })] });
        }({ url: t10, theme: r10, ...e11 }), title: "Verify Request" }), error: (e11) => a10?.error ? { redirect: `${a10.error}${a10.error.includes("?") ? "&" : "?"}error=${e11}`, cookies: i10 } : sT({ cookies: i10, theme: r10, ...function(e12) {
          let { url: t11, error: r11 = "default", theme: n11 } = e12, i11 = `${t11}/signin`, a11 = { default: { status: 200, heading: "Error", message: sx("p", { children: sx("a", { className: "site", href: t11?.origin, children: t11?.host }) }) }, Configuration: { status: 500, heading: "Server error", message: sx("div", { children: [sx("p", { children: "There is a problem with the server configuration." }), sx("p", { children: "Check the server logs for more information." })] }) }, AccessDenied: { status: 403, heading: "Access Denied", message: sx("div", { children: [sx("p", { children: "You do not have permission to sign in." }), sx("p", { children: sx("a", { className: "button", href: i11, children: "Sign in" }) })] }) }, Verification: { status: 403, heading: "Unable to sign in", message: sx("div", { children: [sx("p", { children: "The sign in link is no longer valid." }), sx("p", { children: "It may have been used already or it may have expired." })] }), signin: sx("a", { className: "button", href: i11, children: "Sign in" }) } }, { status: s11, heading: o10, message: l10, signin: c10 } = a11[r11] ?? a11.default;
          return { status: s11, html: sx("div", { className: "error", children: [n11?.brandColor && sx("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${n11?.brandColor}
        }
      ` } }), sx("div", { className: "card", children: [n11?.logo && sx("img", { src: n11?.logo, alt: "Logo", className: "logo" }), sx("h1", { children: o10 }), sx("div", { className: "message", children: l10 }), c10] })] }) };
        }({ url: t10, theme: r10, error: e11 }), title: "Error" }) };
      }
      function sR(e10, t10 = Date.now()) {
        return new Date(t10 + 1e3 * e10);
      }
      async function sC(e10, t10, r10, n10) {
        if (!r10?.providerAccountId || !r10.type) throw Error("Missing or invalid provider account");
        if (!["email", "oauth", "oidc", "webauthn"].includes(r10.type)) throw Error("Provider not supported");
        let { adapter: i10, jwt: a10, events: s10, session: { strategy: o10, generateSessionToken: l10 } } = n10;
        if (!i10) return { user: t10, account: r10 };
        let c10 = r10, { createUser: u10, updateUser: h10, getUser: d2, getUserByAccount: p2, getUserByEmail: f2, linkAccount: g2, createSession: m2, getSessionAndUser: y2, deleteSession: b2 } = i10, w2 = null, v2 = null, _2 = false, x2 = "jwt" === o10;
        if (e10) if (x2) try {
          let t11 = n10.cookies.sessionToken.name;
          (w2 = await a10.decode({ ...a10, token: e10, salt: t11 })) && "sub" in w2 && w2.sub && (v2 = await d2(w2.sub));
        } catch {
        }
        else {
          let t11 = await y2(e10);
          t11 && (w2 = t11.session, v2 = t11.user);
        }
        if ("email" === c10.type) {
          let r11 = await f2(t10.email);
          return r11 ? (v2?.id !== r11.id && !x2 && e10 && await b2(e10), v2 = await h10({ id: r11.id, emailVerified: /* @__PURE__ */ new Date() }), await s10.updateUser?.({ user: v2 })) : (v2 = await u10({ ...t10, emailVerified: /* @__PURE__ */ new Date() }), await s10.createUser?.({ user: v2 }), _2 = true), { session: w2 = x2 ? {} : await m2({ sessionToken: l10(), userId: v2.id, expires: sR(n10.session.maxAge) }), user: v2, isNewUser: _2 };
        }
        if ("webauthn" === c10.type) {
          let e11 = await p2({ providerAccountId: c10.providerAccountId, provider: c10.provider });
          if (e11) {
            if (v2) {
              if (e11.id === v2.id) {
                let e12 = { ...c10, userId: v2.id };
                return { session: w2, user: v2, isNewUser: _2, account: e12 };
              }
              throw new rJ("The account is already associated with another user", { provider: c10.provider });
            }
            w2 = x2 ? {} : await m2({ sessionToken: l10(), userId: e11.id, expires: sR(n10.session.maxAge) });
            let t11 = { ...c10, userId: e11.id };
            return { session: w2, user: e11, isNewUser: _2, account: t11 };
          }
          {
            if (v2) {
              await g2({ ...c10, userId: v2.id }), await s10.linkAccount?.({ user: v2, account: c10, profile: t10 });
              let e13 = { ...c10, userId: v2.id };
              return { session: w2, user: v2, isNewUser: _2, account: e13 };
            }
            if (t10.email ? await f2(t10.email) : null) throw new rJ("Another account already exists with the same e-mail address", { provider: c10.provider });
            v2 = await u10({ ...t10 }), await s10.createUser?.({ user: v2 }), await g2({ ...c10, userId: v2.id }), await s10.linkAccount?.({ user: v2, account: c10, profile: t10 }), w2 = x2 ? {} : await m2({ sessionToken: l10(), userId: v2.id, expires: sR(n10.session.maxAge) });
            let e12 = { ...c10, userId: v2.id };
            return { session: w2, user: v2, isNewUser: true, account: e12 };
          }
        }
        let E2 = await p2({ providerAccountId: c10.providerAccountId, provider: c10.provider });
        if (E2) {
          if (v2) {
            if (E2.id === v2.id) return { session: w2, user: v2, isNewUser: _2 };
            throw new rO("The account is already associated with another user", { provider: c10.provider });
          }
          return { session: w2 = x2 ? {} : await m2({ sessionToken: l10(), userId: E2.id, expires: sR(n10.session.maxAge) }), user: E2, isNewUser: _2 };
        }
        {
          let { provider: e11 } = n10, { type: r11, provider: i11, providerAccountId: a11, userId: o11, ...h11 } = c10;
          if (c10 = Object.assign(e11.account(h11) ?? {}, { providerAccountId: a11, provider: i11, type: r11, userId: o11 }), v2) return await g2({ ...c10, userId: v2.id }), await s10.linkAccount?.({ user: v2, account: c10, profile: t10 }), { session: w2, user: v2, isNewUser: _2 };
          let d3 = t10.email ? await f2(t10.email) : null;
          if (d3) {
            let e12 = n10.provider;
            if (e12?.allowDangerousEmailAccountLinking) v2 = d3, _2 = false;
            else throw new rO("Another account already exists with the same e-mail address", { provider: c10.provider });
          } else v2 = await u10({ ...t10, emailVerified: null }), _2 = true;
          return await s10.createUser?.({ user: v2 }), await g2({ ...c10, userId: v2.id }), await s10.linkAccount?.({ user: v2, account: c10, profile: t10 }), { session: w2 = x2 ? {} : await m2({ sessionToken: l10(), userId: v2.id, expires: sR(n10.session.maxAge) }), user: v2, isNewUser: _2 };
        }
      }
      function sO(e10, t10) {
        if (null == e10) return false;
        try {
          return e10 instanceof t10 || Object.getPrototypeOf(e10)[Symbol.toStringTag] === t10.prototype[Symbol.toStringTag];
        } catch {
          return false;
        }
      }
      ("u" < typeof navigator || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (i = "oauth4webapi/v3.8.6");
      let sP = "ERR_INVALID_ARG_VALUE", sI = "ERR_INVALID_ARG_TYPE";
      function sj(e10, t10, r10) {
        let n10 = TypeError(e10, { cause: r10 });
        return Object.assign(n10, { code: t10 }), n10;
      }
      let s$ = Symbol(), sN = Symbol(), sU = Symbol(), sD = Symbol(), sL = Symbol(), sM = Symbol();
      Symbol();
      let sH = new TextEncoder(), sB = new TextDecoder();
      function sW(e10) {
        return "string" == typeof e10 ? sH.encode(e10) : sB.decode(e10);
      }
      function sq(e10) {
        return "string" == typeof e10 ? s(e10) : a(e10);
      }
      a = Uint8Array.prototype.toBase64 ? (e10) => (e10 instanceof ArrayBuffer && (e10 = new Uint8Array(e10)), e10.toBase64({ alphabet: "base64url", omitPadding: true })) : (e10) => {
        e10 instanceof ArrayBuffer && (e10 = new Uint8Array(e10));
        let t10 = [];
        for (let r10 = 0; r10 < e10.byteLength; r10 += 32768) t10.push(String.fromCharCode.apply(null, e10.subarray(r10, r10 + 32768)));
        return btoa(t10.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }, s = Uint8Array.fromBase64 ? (e10) => {
        try {
          return Uint8Array.fromBase64(e10, { alphabet: "base64url" });
        } catch (e11) {
          throw sj("The input to be decoded is not correctly encoded.", sP, e11);
        }
      } : (e10) => {
        try {
          let t10 = atob(e10.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")), r10 = new Uint8Array(t10.length);
          for (let e11 = 0; e11 < t10.length; e11++) r10[e11] = t10.charCodeAt(e11);
          return r10;
        } catch (e11) {
          throw sj("The input to be decoded is not correctly encoded.", sP, e11);
        }
      };
      class sK extends Error {
        code;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, this.code = oJ, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class sJ extends Error {
        code;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, t10?.code && (this.code = t10?.code), Error.captureStackTrace?.(this, this.constructor);
        }
      }
      function sF(e10, t10, r10) {
        return new sJ(e10, { code: t10, cause: r10 });
      }
      function sz(e10) {
        return !(null === e10 || "object" != typeof e10 || Array.isArray(e10));
      }
      function sV(e10) {
        sO(e10, Headers) && (e10 = Object.fromEntries(e10.entries()));
        let t10 = new Headers(e10 ?? {});
        if (i && !t10.has("user-agent") && t10.set("user-agent", i), t10.has("authorization")) throw sj('"options.headers" must not include the "authorization" header name', sP);
        return t10;
      }
      function sG(e10, t10) {
        if (void 0 !== t10) {
          if ("function" == typeof t10 && (t10 = t10(e10.href)), !(t10 instanceof AbortSignal)) throw sj('"options.signal" must return or be an instance of AbortSignal', sI);
          return t10;
        }
      }
      function sX(e10) {
        return e10.includes("//") ? e10.replace("//", "/") : e10;
      }
      async function sY(e10, t10, r10, n10) {
        if (!(e10 instanceof URL)) throw sj(`"${t10}" must be an instance of URL`, sI);
        on(e10, n10?.[s$] !== true);
        let i10 = r10(new URL(e10.href)), a10 = sV(n10?.headers);
        return a10.set("accept", "application/json"), (n10?.[sD] || fetch)(i10.href, { body: void 0, headers: Object.fromEntries(a10.entries()), method: "GET", redirect: "manual", signal: sG(i10, n10?.signal) });
      }
      async function sZ(e10, t10) {
        return sY(e10, "issuerIdentifier", (e11) => {
          switch (t10?.algorithm) {
            case void 0:
            case "oidc":
              e11.pathname = sX(`${e11.pathname}/.well-known/openid-configuration`);
              break;
            case "oauth2":
              !function(e12, t11, r10 = false) {
                "/" === e12.pathname ? e12.pathname = t11 : e12.pathname = sX(`${t11}/${r10 ? e12.pathname : e12.pathname.replace(/(\/)$/, "")}`);
              }(e11, ".well-known/oauth-authorization-server");
              break;
            default:
              throw sj('"options.algorithm" must be "oidc" (default), or "oauth2"', sP);
          }
          return e11;
        }, t10);
      }
      function sQ(e10, t10, r10, n10, i10) {
        try {
          if ("number" != typeof e10 || !Number.isFinite(e10)) throw sj(`${r10} must be a number`, sI, i10);
          if (e10 > 0) return;
          if (t10) {
            if (0 !== e10) throw sj(`${r10} must be a non-negative number`, sP, i10);
            return;
          }
          throw sj(`${r10} must be a positive number`, sP, i10);
        } catch (e11) {
          if (n10) throw sF(e11.message, n10, i10);
          throw e11;
        }
      }
      function s0(e10, t10, r10, n10) {
        try {
          if ("string" != typeof e10) throw sj(`${t10} must be a string`, sI, n10);
          if (0 === e10.length) throw sj(`${t10} must not be empty`, sP, n10);
        } catch (e11) {
          if (r10) throw sF(e11.message, r10, n10);
          throw e11;
        }
      }
      async function s1(e10, t10) {
        if (!(e10 instanceof URL) && e10 !== ln) throw sj('"expectedIssuerIdentifier" must be an instance of URL', sI);
        if (!sO(t10, Response)) throw sj('"response" must be an instance of Response', sI);
        if (200 !== t10.status) throw sF('"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)', oY, t10);
        o3(t10);
        let r10 = await lr(t10);
        if (s0(r10.issuer, '"response" body "issuer" property', oG, { body: r10 }), e10 !== ln && new URL(r10.issuer).href !== e10.href) throw sF('"response" body "issuer" property does not match the expected value', o2, { expected: e10.href, body: r10, attribute: "issuer" });
        return r10;
      }
      function s2(e10) {
        var t10 = e10, r10 = "application/json";
        if (ov(t10) !== r10) throw function(e11, ...t11) {
          let r11 = '"response" content-type must be ';
          if (t11.length > 2) {
            let e12 = t11.pop();
            r11 += `${t11.join(", ")}, or ${e12}`;
          } else 2 === t11.length ? r11 += `${t11[0]} or ${t11[1]}` : r11 += t11[0];
          return sF(r11, oX, e11);
        }(t10, r10);
      }
      function s5() {
        return sq(crypto.getRandomValues(new Uint8Array(32)));
      }
      async function s6(e10) {
        return s0(e10, "codeVerifier"), sq(await crypto.subtle.digest("SHA-256", sW(e10)));
      }
      function s3(e10) {
        let t10 = e10?.[sN];
        return "number" == typeof t10 && Number.isFinite(t10) ? t10 : 0;
      }
      function s4(e10) {
        let t10 = e10?.[sU];
        return "number" == typeof t10 && Number.isFinite(t10) && -1 !== Math.sign(t10) ? t10 : 30;
      }
      function s8() {
        return Math.floor(Date.now() / 1e3);
      }
      function s9(e10) {
        if ("object" != typeof e10 || null === e10) throw sj('"as" must be an object', sI);
        s0(e10.issuer, '"as.issuer"');
      }
      function s7(e10) {
        if ("object" != typeof e10 || null === e10) throw sj('"client" must be an object', sI);
        s0(e10.client_id, '"client.client_id"');
      }
      function oe(e10, t10) {
        let r10 = s8() + s3(t10);
        return { jti: s5(), aud: e10.issuer, exp: r10 + 60, iat: r10, nbf: r10, iss: t10.client_id, sub: t10.client_id };
      }
      async function ot(e10, t10, r10) {
        if (!r10.usages.includes("sign")) throw sj('CryptoKey instances used for signing assertions must include "sign" in their "usages"', sP);
        let n10 = `${sq(sW(JSON.stringify(e10)))}.${sq(sW(JSON.stringify(t10)))}`, i10 = sq(await crypto.subtle.sign(function(e11) {
          switch (e11.algorithm.name) {
            case "ECDSA":
              return { name: e11.algorithm.name, hash: function(e12) {
                let { algorithm: t11 } = e12;
                switch (t11.namedCurve) {
                  case "P-256":
                    return "SHA-256";
                  case "P-384":
                    return "SHA-384";
                  case "P-521":
                    return "SHA-512";
                  default:
                    throw new sK("unsupported ECDSA namedCurve", { cause: e12 });
                }
              }(e11) };
            case "RSA-PSS":
              switch (o4(e11), e11.algorithm.hash.name) {
                case "SHA-256":
                case "SHA-384":
                case "SHA-512":
                  return { name: e11.algorithm.name, saltLength: parseInt(e11.algorithm.hash.name.slice(-3), 10) >> 3 };
                default:
                  throw new sK("unsupported RSA-PSS hash name", { cause: e11 });
              }
            case "RSASSA-PKCS1-v1_5":
              return o4(e11), e11.algorithm.name;
            case "ML-DSA-44":
            case "ML-DSA-65":
            case "ML-DSA-87":
            case "Ed25519":
              return e11.algorithm.name;
          }
          throw new sK("unsupported CryptoKey algorithm name", { cause: e11 });
        }(r10), r10, sW(n10)));
        return `${n10}.${i10}`;
      }
      let or = URL.parse ? (e10, t10) => URL.parse(e10, t10) : (e10, t10) => {
        try {
          return new URL(e10, t10);
        } catch {
          return null;
        }
      };
      function on(e10, t10) {
        if (t10 && "https:" !== e10.protocol) throw sF("only requests to HTTPS are allowed", oZ, e10);
        if ("https:" !== e10.protocol && "http:" !== e10.protocol) throw sF("only HTTP and HTTPS requests are allowed", oQ, e10);
      }
      function oi(e10, t10, r10, n10) {
        let i10;
        if ("string" != typeof e10 || !(i10 = or(e10))) throw sF(`authorization server metadata does not contain a valid ${r10 ? `"as.mtls_endpoint_aliases.${t10}"` : `"as.${t10}"`}`, void 0 === e10 ? o5 : o6, { attribute: r10 ? `mtls_endpoint_aliases.${t10}` : t10 });
        return on(i10, n10), i10;
      }
      function oa(e10, t10, r10, n10) {
        return r10 && e10.mtls_endpoint_aliases && t10 in e10.mtls_endpoint_aliases ? oi(e10.mtls_endpoint_aliases[t10], t10, r10, n10) : oi(e10[t10], t10, r10, n10);
      }
      class os extends Error {
        cause;
        code;
        error;
        status;
        error_description;
        response;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, this.code = oK, this.cause = t10.cause, this.error = t10.cause.error, this.status = t10.response.status, this.error_description = t10.cause.error_description, Object.defineProperty(this, "response", { enumerable: false, value: t10.response }), Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class oo extends Error {
        cause;
        code;
        error;
        error_description;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, this.code = oF, this.cause = t10.cause, this.error = t10.cause.get("error"), this.error_description = t10.cause.get("error_description") ?? void 0, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class ol extends Error {
        cause;
        code;
        response;
        status;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, this.code = oq, this.cause = t10.cause, this.status = t10.response.status, this.response = t10.response, Object.defineProperty(this, "response", { enumerable: false }), Error.captureStackTrace?.(this, this.constructor);
        }
      }
      let oc = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+", ou = RegExp("^[,\\s]*(" + oc + ")"), oh = RegExp("^[,\\s]*(" + oc + ')\\s*=\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"[,\\s]*(.*)'), od = RegExp("^[,\\s]*" + ("(" + oc + ")\\s*=\\s*(") + oc + ")[,\\s]*(.*)"), op = RegExp("^([a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2})(?:$|[,\\s])(.*)");
      async function of(e10) {
        if (e10.status > 399 && e10.status < 500) {
          o3(e10), s2(e10);
          try {
            let t10 = await e10.clone().json();
            if (sz(t10) && "string" == typeof t10.error && t10.error.length) return t10;
          } catch {
          }
        }
      }
      async function og(e10, t10, r10) {
        if (e10.status !== t10) {
          let t11;
          if (oR(e10), t11 = await of(e10)) throw await e10.body?.cancel(), new os("server responded with an error in the response body", { cause: t11, response: e10 });
          throw sF(`"response" is not a conform ${r10} response (unexpected HTTP status code)`, oY, e10);
        }
      }
      function om(e10) {
        if (!oj.has(e10)) throw sj('"options.DPoP" is not a valid DPoPHandle', sP);
      }
      async function oy(e10, t10, r10, n10, i10, a10) {
        if (s0(e10, '"accessToken"'), !(r10 instanceof URL)) throw sj('"url" must be an instance of URL', sI);
        on(r10, a10?.[s$] !== true), n10 = sV(n10), a10?.DPoP && (om(a10.DPoP), await a10.DPoP.addProof(r10, n10, t10.toUpperCase(), e10)), n10.set("authorization", `${n10.has("dpop") ? "DPoP" : "Bearer"} ${e10}`);
        let s10 = await (a10?.[sD] || fetch)(r10.href, { duplex: sO(i10, ReadableStream) ? "half" : void 0, body: i10, headers: Object.fromEntries(n10.entries()), method: t10, redirect: "manual", signal: sG(r10, a10?.signal) });
        return a10?.DPoP?.cacheNonce(s10, r10), s10;
      }
      async function ob(e10, t10, r10, n10) {
        s9(e10), s7(t10);
        let i10 = oa(e10, "userinfo_endpoint", t10.use_mtls_endpoint_aliases, n10?.[s$] !== true), a10 = sV(n10?.headers);
        return t10.userinfo_signed_response_alg ? a10.set("accept", "application/jwt") : (a10.set("accept", "application/json"), a10.append("accept", "application/jwt")), oy(r10, "GET", i10, a10, null, { ...n10, [sN]: s3(t10) });
      }
      let ow = Symbol();
      function ov(e10) {
        return e10.headers.get("content-type")?.split(";")[0];
      }
      async function o_(e10, t10, r10, n10, i10) {
        let a10;
        if (s9(e10), s7(t10), !sO(n10, Response)) throw sj('"response" must be an instance of Response', sI);
        if (oR(n10), 200 !== n10.status) throw sF('"response" is not a conform UserInfo Endpoint response (unexpected HTTP status code)', oY, n10);
        if (o3(n10), "application/jwt" === ov(n10)) {
          let { claims: r11, jwt: s10 } = await o8(await n10.text(), o9.bind(void 0, t10.userinfo_signed_response_alg, e10.userinfo_signing_alg_values_supported, void 0), s3(t10), s4(t10), i10?.[sM]).then(oC.bind(void 0, t10.client_id)).then(oP.bind(void 0, e10));
          oS.set(n10, s10), a10 = r11;
        } else {
          if (t10.userinfo_signed_response_alg) throw sF("JWT UserInfo Response expected", oz, n10);
          a10 = await lr(n10);
        }
        if (s0(a10.sub, '"response" body "sub" property', oG, { body: a10 }), r10 === ow) ;
        else if (s0(r10, '"expectedSubject"'), a10.sub !== r10) throw sF('unexpected "response" body "sub" property value', o2, { expected: r10, body: a10, attribute: "sub" });
        return a10;
      }
      async function ox(e10, t10, r10, n10, i10, a10, s10) {
        return await r10(e10, t10, i10, a10), a10.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"), (s10?.[sD] || fetch)(n10.href, { body: i10, headers: Object.fromEntries(a10.entries()), method: "POST", redirect: "manual", signal: sG(n10, s10?.signal) });
      }
      async function oE(e10, t10, r10, n10, i10, a10) {
        let s10 = oa(e10, "token_endpoint", t10.use_mtls_endpoint_aliases, a10?.[s$] !== true);
        i10.set("grant_type", n10);
        let o10 = sV(a10?.headers);
        o10.set("accept", "application/json"), a10?.DPoP !== void 0 && (om(a10.DPoP), await a10.DPoP.addProof(s10, o10, "POST"));
        let l10 = await ox(e10, t10, r10, s10, i10, o10, a10);
        return a10?.DPoP?.cacheNonce(l10, s10), l10;
      }
      let ok = /* @__PURE__ */ new WeakMap(), oS = /* @__PURE__ */ new WeakMap();
      function oT(e10) {
        if (!e10.id_token) return;
        let t10 = ok.get(e10);
        if (!t10) throw sj('"ref" was already garbage collected or did not resolve from the proper sources', sP);
        return t10;
      }
      async function oA(e10, t10, r10, n10, i10, a10) {
        if (s9(e10), s7(t10), !sO(r10, Response)) throw sj('"response" must be an instance of Response', sI);
        await og(r10, 200, "Token Endpoint"), o3(r10);
        let s10 = await lr(r10);
        if (s0(s10.access_token, '"response" body "access_token" property', oG, { body: s10 }), s0(s10.token_type, '"response" body "token_type" property', oG, { body: s10 }), s10.token_type = s10.token_type.toLowerCase(), void 0 !== s10.expires_in) {
          let e11 = "number" != typeof s10.expires_in ? parseFloat(s10.expires_in) : s10.expires_in;
          sQ(e11, true, '"response" body "expires_in" property', oG, { body: s10 }), s10.expires_in = e11;
        }
        if (void 0 !== s10.refresh_token && s0(s10.refresh_token, '"response" body "refresh_token" property', oG, { body: s10 }), void 0 !== s10.scope && "string" != typeof s10.scope) throw sF('"response" body "scope" property must be a string', oG, { body: s10 });
        if (void 0 !== s10.id_token) {
          s0(s10.id_token, '"response" body "id_token" property', oG, { body: s10 });
          let a11 = ["aud", "exp", "iat", "iss", "sub"];
          true === t10.require_auth_time && a11.push("auth_time"), void 0 !== t10.default_max_age && (sQ(t10.default_max_age, true, '"client.default_max_age"'), a11.push("auth_time")), n10?.length && a11.push(...n10);
          let { claims: o10, jwt: l10 } = await o8(s10.id_token, o9.bind(void 0, t10.id_token_signed_response_alg, e10.id_token_signing_alg_values_supported, "RS256"), s3(t10), s4(t10), i10).then(oD.bind(void 0, a11)).then(oI.bind(void 0, e10)).then(oO.bind(void 0, t10.client_id));
          if (Array.isArray(o10.aud) && 1 !== o10.aud.length) {
            if (void 0 === o10.azp) throw sF('ID Token "aud" (audience) claim includes additional untrusted audiences', o1, { claims: o10, claim: "aud" });
            if (o10.azp !== t10.client_id) throw sF('unexpected ID Token "azp" (authorized party) claim value', o1, { expected: t10.client_id, claims: o10, claim: "azp" });
          }
          void 0 !== o10.auth_time && sQ(o10.auth_time, true, 'ID Token "auth_time" (authentication time)', oG, { claims: o10 }), oS.set(r10, l10), ok.set(s10, o10);
        }
        if (a10?.[s10.token_type] !== void 0) a10[s10.token_type](r10, s10);
        else if ("dpop" !== s10.token_type && "bearer" !== s10.token_type) throw new sK("unsupported `token_type` value", { cause: { body: s10 } });
        return s10;
      }
      function oR(e10) {
        let t10;
        if (t10 = function(e11) {
          if (!sO(e11, Response)) throw sj('"response" must be an instance of Response', sI);
          let t11 = e11.headers.get("www-authenticate");
          if (null === t11) return;
          let r10 = [], n10 = t11;
          for (; n10; ) {
            let e12, t12 = n10.match(ou), i10 = t12?.["1"].toLowerCase();
            if (!i10) return;
            let a10 = n10.substring(t12[0].length);
            if (a10 && !a10.match(/^[\s,]/)) return;
            let s10 = a10.match(/^\s+(.*)$/), o10 = !!s10;
            n10 = s10 ? s10[1] : void 0;
            let l10 = {};
            if (o10) for (; n10; ) {
              let r11, i11;
              if (t12 = n10.match(oh)) {
                if ([, r11, i11, n10] = t12, i11.includes("\\")) try {
                  i11 = JSON.parse(`"${i11}"`);
                } catch {
                }
                l10[r11.toLowerCase()] = i11;
                continue;
              }
              if (t12 = n10.match(od)) {
                [, r11, i11, n10] = t12, l10[r11.toLowerCase()] = i11;
                continue;
              }
              if (t12 = n10.match(op)) {
                if (Object.keys(l10).length) break;
                [, e12, n10] = t12;
                break;
              }
              return;
            }
            else n10 = a10 || void 0;
            let c10 = { scheme: i10, parameters: l10 };
            e12 && (c10.token68 = e12), r10.push(c10);
          }
          if (r10.length) return r10;
        }(e10)) throw new ol("server responded with a challenge in the WWW-Authenticate HTTP Header", { cause: t10, response: e10 });
      }
      function oC(e10, t10) {
        return void 0 !== t10.claims.aud ? oO(e10, t10) : t10;
      }
      function oO(e10, t10) {
        if (Array.isArray(t10.claims.aud)) {
          if (!t10.claims.aud.includes(e10)) throw sF('unexpected JWT "aud" (audience) claim value', o1, { expected: e10, claims: t10.claims, claim: "aud" });
        } else if (t10.claims.aud !== e10) throw sF('unexpected JWT "aud" (audience) claim value', o1, { expected: e10, claims: t10.claims, claim: "aud" });
        return t10;
      }
      function oP(e10, t10) {
        return void 0 !== t10.claims.iss ? oI(e10, t10) : t10;
      }
      function oI(e10, t10) {
        let r10 = e10[li]?.(t10) ?? e10.issuer;
        if (t10.claims.iss !== r10) throw sF('unexpected JWT "iss" (issuer) claim value', o1, { expected: r10, claims: t10.claims, claim: "iss" });
        return t10;
      }
      let oj = /* @__PURE__ */ new WeakSet(), o$ = Symbol();
      async function oN(e10, t10, r10, n10, i10, a10, s10) {
        if (s9(e10), s7(t10), !oj.has(n10)) throw sj('"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()', sP);
        s0(i10, '"redirectUri"');
        let o10 = o7(n10, "code");
        if (!o10) throw sF('no authorization code in "callbackParameters"', oG);
        let l10 = new URLSearchParams(s10?.additionalParameters);
        return l10.set("redirect_uri", i10), l10.set("code", o10), a10 !== o$ && (s0(a10, '"codeVerifier"'), l10.set("code_verifier", a10)), oE(e10, t10, r10, "authorization_code", l10, s10);
      }
      let oU = { aud: "audience", c_hash: "code hash", client_id: "client id", exp: "expiration time", iat: "issued at", iss: "issuer", jti: "jwt id", nonce: "nonce", s_hash: "state hash", sub: "subject", ath: "access token hash", htm: "http method", htu: "http uri", cnf: "confirmation", auth_time: "authentication time" };
      function oD(e10, t10) {
        for (let r10 of e10) if (void 0 === t10.claims[r10]) throw sF(`JWT "${r10}" (${oU[r10]}) claim missing`, oG, { claims: t10.claims });
        return t10;
      }
      let oL = Symbol(), oM = Symbol();
      async function oH(e10, t10, r10, n10) {
        return "string" == typeof n10?.expectedNonce || "number" == typeof n10?.maxAge || n10?.requireIdToken ? oB(e10, t10, r10, n10.expectedNonce, n10.maxAge, n10[sM], n10.recognizedTokenTypes) : oW(e10, t10, r10, n10?.[sM], n10?.recognizedTokenTypes);
      }
      async function oB(e10, t10, r10, n10, i10, a10, s10) {
        let o10 = [];
        switch (n10) {
          case void 0:
            n10 = oL;
            break;
          case oL:
            break;
          default:
            s0(n10, '"expectedNonce" argument'), o10.push("nonce");
        }
        switch (i10 ??= t10.default_max_age) {
          case void 0:
            i10 = oM;
            break;
          case oM:
            break;
          default:
            sQ(i10, true, '"maxAge" argument'), o10.push("auth_time");
        }
        let l10 = await oA(e10, t10, r10, o10, a10, s10);
        s0(l10.id_token, '"response" body "id_token" property', oG, { body: l10 });
        let c10 = oT(l10);
        if (i10 !== oM) {
          let e11 = s8() + s3(t10), r11 = s4(t10);
          if (c10.auth_time + i10 < e11 - r11) throw sF("too much time has elapsed since the last End-User authentication", o0, { claims: c10, now: e11, tolerance: r11, claim: "auth_time" });
        }
        if (n10 === oL) {
          if (void 0 !== c10.nonce) throw sF('unexpected ID Token "nonce" claim value', o1, { expected: void 0, claims: c10, claim: "nonce" });
        } else if (c10.nonce !== n10) throw sF('unexpected ID Token "nonce" claim value', o1, { expected: n10, claims: c10, claim: "nonce" });
        return l10;
      }
      async function oW(e10, t10, r10, n10, i10) {
        let a10 = await oA(e10, t10, r10, void 0, n10, i10), s10 = oT(a10);
        if (s10) {
          if (void 0 !== t10.default_max_age) {
            sQ(t10.default_max_age, true, '"client.default_max_age"');
            let e11 = s8() + s3(t10), r11 = s4(t10);
            if (s10.auth_time + t10.default_max_age < e11 - r11) throw sF("too much time has elapsed since the last End-User authentication", o0, { claims: s10, now: e11, tolerance: r11, claim: "auth_time" });
          }
          if (void 0 !== s10.nonce) throw sF('unexpected ID Token "nonce" claim value', o1, { expected: void 0, claims: s10, claim: "nonce" });
        }
        return a10;
      }
      let oq = "OAUTH_WWW_AUTHENTICATE_CHALLENGE", oK = "OAUTH_RESPONSE_BODY_ERROR", oJ = "OAUTH_UNSUPPORTED_OPERATION", oF = "OAUTH_AUTHORIZATION_RESPONSE_ERROR", oz = "OAUTH_JWT_USERINFO_EXPECTED", oV = "OAUTH_PARSE_ERROR", oG = "OAUTH_INVALID_RESPONSE", oX = "OAUTH_RESPONSE_IS_NOT_JSON", oY = "OAUTH_RESPONSE_IS_NOT_CONFORM", oZ = "OAUTH_HTTP_REQUEST_FORBIDDEN", oQ = "OAUTH_REQUEST_PROTOCOL_FORBIDDEN", o0 = "OAUTH_JWT_TIMESTAMP_CHECK_FAILED", o1 = "OAUTH_JWT_CLAIM_COMPARISON_FAILED", o2 = "OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED", o5 = "OAUTH_MISSING_SERVER_METADATA", o6 = "OAUTH_INVALID_SERVER_METADATA";
      function o3(e10) {
        if (e10.bodyUsed) throw sj('"response" body has been used already', sP);
      }
      function o4(e10) {
        let { algorithm: t10 } = e10;
        if ("number" != typeof t10.modulusLength || t10.modulusLength < 2048) throw new sK(`unsupported ${t10.name} modulusLength`, { cause: e10 });
      }
      async function o8(e10, t10, r10, n10, i10) {
        let a10, s10, { 0: o10, 1: l10, length: c10 } = e10.split(".");
        if (5 === c10) if (void 0 !== i10) e10 = await i10(e10), { 0: o10, 1: l10, length: c10 } = e10.split(".");
        else throw new sK("JWE decryption is not configured", { cause: e10 });
        if (3 !== c10) throw sF("Invalid JWT", oG, e10);
        try {
          a10 = JSON.parse(sW(sq(o10)));
        } catch (e11) {
          throw sF("failed to parse JWT Header body as base64url encoded JSON", oV, e11);
        }
        if (!sz(a10)) throw sF("JWT Header must be a top level object", oG, e10);
        if (t10(a10), void 0 !== a10.crit) throw new sK('no JWT "crit" header parameter extensions are supported', { cause: { header: a10 } });
        try {
          s10 = JSON.parse(sW(sq(l10)));
        } catch (e11) {
          throw sF("failed to parse JWT Payload body as base64url encoded JSON", oV, e11);
        }
        if (!sz(s10)) throw sF("JWT Payload must be a top level object", oG, e10);
        let u10 = s8() + r10;
        if (void 0 !== s10.exp) {
          if ("number" != typeof s10.exp) throw sF('unexpected JWT "exp" (expiration time) claim type', oG, { claims: s10 });
          if (s10.exp <= u10 - n10) throw sF('unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp', o0, { claims: s10, now: u10, tolerance: n10, claim: "exp" });
        }
        if (void 0 !== s10.iat && "number" != typeof s10.iat) throw sF('unexpected JWT "iat" (issued at) claim type', oG, { claims: s10 });
        if (void 0 !== s10.iss && "string" != typeof s10.iss) throw sF('unexpected JWT "iss" (issuer) claim type', oG, { claims: s10 });
        if (void 0 !== s10.nbf) {
          if ("number" != typeof s10.nbf) throw sF('unexpected JWT "nbf" (not before) claim type', oG, { claims: s10 });
          if (s10.nbf > u10 + n10) throw sF('unexpected JWT "nbf" (not before) claim value', o0, { claims: s10, now: u10, tolerance: n10, claim: "nbf" });
        }
        if (void 0 !== s10.aud && "string" != typeof s10.aud && !Array.isArray(s10.aud)) throw sF('unexpected JWT "aud" (audience) claim type', oG, { claims: s10 });
        return { header: a10, claims: s10, jwt: e10 };
      }
      function o9(e10, t10, r10, n10) {
        if (void 0 !== e10) {
          if ("string" == typeof e10 ? n10.alg !== e10 : !e10.includes(n10.alg)) throw sF('unexpected JWT "alg" header parameter', oG, { header: n10, expected: e10, reason: "client configuration" });
          return;
        }
        if (Array.isArray(t10)) {
          if (!t10.includes(n10.alg)) throw sF('unexpected JWT "alg" header parameter', oG, { header: n10, expected: t10, reason: "authorization server metadata" });
          return;
        }
        if (void 0 !== r10) {
          if ("string" == typeof r10 ? n10.alg !== r10 : "function" == typeof r10 ? !r10(n10.alg) : !r10.includes(n10.alg)) throw sF('unexpected JWT "alg" header parameter', oG, { header: n10, expected: r10, reason: "default value" });
          return;
        }
        throw sF('missing client or server configuration to verify used JWT "alg" header parameter', void 0, { client: e10, issuer: t10, fallback: r10 });
      }
      function o7(e10, t10) {
        let { 0: r10, length: n10 } = e10.getAll(t10);
        if (n10 > 1) throw sF(`"${t10}" parameter must be provided only once`, oG);
        return r10;
      }
      let le = Symbol(), lt = Symbol();
      async function lr(e10, t10 = s2) {
        let r10;
        try {
          r10 = await e10.json();
        } catch (r11) {
          throw t10(e10), sF('failed to parse "response" body as JSON', oV, r11);
        }
        if (!sz(r10)) throw sF('"response" body must be a top level object', oG, { body: r10 });
        return r10;
      }
      let ln = Symbol(), li = Symbol();
      async function la(e10, t10, r10) {
        let { cookies: n10, logger: i10 } = r10, a10 = n10[e10], s10 = /* @__PURE__ */ new Date();
        s10.setTime(s10.getTime() + 9e5), i10.debug(`CREATE_${e10.toUpperCase()}`, { name: a10.name, payload: t10, COOKIE_TTL: 900, expires: s10 });
        let o10 = await iF({ ...r10.jwt, maxAge: 900, token: { value: t10 }, salt: a10.name }), l10 = { ...a10.options, expires: s10 };
        return { name: a10.name, value: o10, options: l10 };
      }
      async function ls(e10, t10, r10) {
        try {
          let { logger: n10, cookies: i10, jwt: a10 } = r10;
          if (n10.debug(`PARSE_${e10.toUpperCase()}`, { cookie: t10 }), !t10) throw new rk(`${e10} cookie was missing`);
          let s10 = await iz({ ...a10, token: t10, salt: i10[e10].name });
          if (s10?.value) return s10.value;
          throw Error("Invalid cookie");
        } catch (t11) {
          throw new rk(`${e10} value could not be parsed`, { cause: t11 });
        }
      }
      function lo(e10, t10, r10) {
        let { logger: n10, cookies: i10 } = t10, a10 = i10[e10];
        n10.debug(`CLEAR_${e10.toUpperCase()}`, { cookie: a10 }), r10.push({ name: a10.name, value: "", options: { ...i10[e10].options, maxAge: 0 } });
      }
      function ll(e10, t10) {
        return async function(r10, n10, i10) {
          let { provider: a10, logger: s10 } = i10;
          if (!a10?.checks?.includes(e10)) return;
          let o10 = r10?.[i10.cookies[t10].name];
          s10.debug(`USE_${t10.toUpperCase()}`, { value: o10 });
          let l10 = await ls(t10, o10, i10);
          return lo(t10, i10, n10), l10;
        };
      }
      let lc = { async create(e10) {
        let t10 = s5(), r10 = await s6(t10);
        return { cookie: await la("pkceCodeVerifier", t10, e10), value: r10 };
      }, use: ll("pkce", "pkceCodeVerifier") }, lu = "encodedState", lh = { async create(e10, t10) {
        let { provider: r10 } = e10;
        if (!r10.checks.includes("state")) {
          if (t10) throw new rk("State data was provided but the provider is not configured to use state");
          return;
        }
        let n10 = { origin: t10, random: s5() }, i10 = await iF({ secret: e10.jwt.secret, token: n10, salt: lu, maxAge: 900 });
        return { cookie: await la("state", i10, e10), value: i10 };
      }, use: ll("state", "state"), async decode(e10, t10) {
        try {
          t10.logger.debug("DECODE_STATE", { state: e10 });
          let r10 = await iz({ secret: t10.jwt.secret, token: e10, salt: lu });
          if (r10) return r10;
          throw Error("Invalid state");
        } catch (e11) {
          throw new rk("State could not be decoded", { cause: e11 });
        }
      } }, ld = { async create(e10) {
        if (!e10.provider.checks.includes("nonce")) return;
        let t10 = s5();
        return { cookie: await la("nonce", t10, e10), value: t10 };
      }, use: ll("nonce", "nonce") }, lp = "encodedWebauthnChallenge", lf = { create: async (e10, t10, r10) => ({ cookie: await la("webauthnChallenge", await iF({ secret: e10.jwt.secret, token: { challenge: t10, registerData: r10 }, salt: lp, maxAge: 900 }), e10) }), async use(e10, t10, r10) {
        let n10 = t10?.[e10.cookies.webauthnChallenge.name], i10 = await ls("webauthnChallenge", n10, e10), a10 = await iz({ secret: e10.jwt.secret, token: i10, salt: lp });
        if (lo("webauthnChallenge", e10, r10), !a10) throw new rk("WebAuthn challenge was missing");
        return a10;
      } };
      function lg(e10) {
        return encodeURIComponent(e10).replace(/%20/g, "+");
      }
      async function lm(e10, t10, r10) {
        var n10, i10;
        let a10, s10, o10, l10, c10, { logger: u10, provider: h10 } = r10, { token: d2, userinfo: p2 } = h10;
        if (d2?.url && "authjs.dev" !== d2.url.host || p2?.url && "authjs.dev" !== p2.url.host) a10 = { issuer: h10.issuer ?? "https://authjs.dev", token_endpoint: d2?.url.toString(), userinfo_endpoint: p2?.url.toString() };
        else {
          let e11 = new URL(h10.issuer), t11 = await sZ(e11, { [s$]: true, [sD]: h10[ai] });
          if (!(a10 = await s1(e11, t11)).token_endpoint) throw TypeError("TODO: Authorization server did not provide a token endpoint.");
          if (!a10.userinfo_endpoint) throw TypeError("TODO: Authorization server did not provide a userinfo endpoint.");
        }
        let f2 = { client_id: h10.clientId, ...h10.client };
        switch (f2.token_endpoint_auth_method) {
          case void 0:
          case "client_secret_basic":
            s10 = (e11, t11, r11, n11) => {
              var i11, a11;
              let s11, o11, l11;
              n11.set("authorization", (i11 = h10.clientId, a11 = h10.clientSecret, s11 = lg(i11), o11 = lg(a11), l11 = btoa(`${s11}:${o11}`), `Basic ${l11}`));
            };
            break;
          case "client_secret_post":
            s0(n10 = h10.clientSecret, '"clientSecret"'), s10 = (e11, t11, r11, i11) => {
              r11.set("client_id", t11.client_id), r11.set("client_secret", n10);
            };
            break;
          case "client_secret_jwt":
            s0(i10 = h10.clientSecret, '"clientSecret"'), c10 = void 0, s10 = async (e11, t11, r11, n11) => {
              l10 ||= await crypto.subtle.importKey("raw", sW(i10), { hash: "SHA-256", name: "HMAC" }, false, ["sign"]);
              let a11 = { alg: "HS256" }, s11 = oe(e11, t11);
              c10?.(a11, s11);
              let o11 = `${sq(sW(JSON.stringify(a11)))}.${sq(sW(JSON.stringify(s11)))}`, u11 = await crypto.subtle.sign(l10.algorithm, l10, sW(o11));
              r11.set("client_id", t11.client_id), r11.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), r11.set("client_assertion", `${o11}.${sq(new Uint8Array(u11))}`);
            };
            break;
          case "private_key_jwt":
            s10 = function(e11, t11) {
              let { key: r11, kid: n11 } = e11 instanceof CryptoKey ? { key: e11 } : e11?.key instanceof CryptoKey ? (void 0 !== e11.kid && s0(e11.kid, '"kid"'), { key: e11.key, kid: e11.kid }) : {};
              var i11 = '"clientPrivateKey.key"';
              if (!(r11 instanceof CryptoKey)) throw sj(`${i11} must be a CryptoKey`, sI);
              if ("private" !== r11.type) throw sj(`${i11} must be a private CryptoKey`, sP);
              return async (e12, i12, a11, s11) => {
                let o11 = { alg: function(e13) {
                  switch (e13.algorithm.name) {
                    case "RSA-PSS":
                      switch (e13.algorithm.hash.name) {
                        case "SHA-256":
                          return "PS256";
                        case "SHA-384":
                          return "PS384";
                        case "SHA-512":
                          return "PS512";
                        default:
                          throw new sK("unsupported RsaHashedKeyAlgorithm hash name", { cause: e13 });
                      }
                    case "RSASSA-PKCS1-v1_5":
                      switch (e13.algorithm.hash.name) {
                        case "SHA-256":
                          return "RS256";
                        case "SHA-384":
                          return "RS384";
                        case "SHA-512":
                          return "RS512";
                        default:
                          throw new sK("unsupported RsaHashedKeyAlgorithm hash name", { cause: e13 });
                      }
                    case "ECDSA":
                      switch (e13.algorithm.namedCurve) {
                        case "P-256":
                          return "ES256";
                        case "P-384":
                          return "ES384";
                        case "P-521":
                          return "ES512";
                        default:
                          throw new sK("unsupported EcKeyAlgorithm namedCurve", { cause: e13 });
                      }
                    case "Ed25519":
                    case "ML-DSA-44":
                    case "ML-DSA-65":
                    case "ML-DSA-87":
                      return e13.algorithm.name;
                    case "EdDSA":
                      return "Ed25519";
                    default:
                      throw new sK("unsupported CryptoKey algorithm name", { cause: e13 });
                  }
                }(r11), kid: n11 }, l11 = oe(e12, i12);
                t11?.[sL]?.(o11, l11), a11.set("client_id", i12.client_id), a11.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), a11.set("client_assertion", await ot(o11, l11, r11));
              };
            }(h10.token.clientPrivateKey, { [sL](e11, t11) {
              t11.aud = [a10.issuer, a10.token_endpoint];
            } });
            break;
          case "none":
            s10 = (e11, t11, r11, n11) => {
              r11.set("client_id", t11.client_id);
            };
            break;
          default:
            throw Error("unsupported client authentication method");
        }
        let g2 = [], m2 = await lh.use(t10, g2, r10);
        try {
          o10 = function(e11, t11, r11, n11) {
            var i11;
            if (s9(e11), s7(t11), r11 instanceof URL && (r11 = r11.searchParams), !(r11 instanceof URLSearchParams)) throw sj('"parameters" must be an instance of URLSearchParams, or URL', sI);
            if (o7(r11, "response")) throw sF('"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()', oG, { parameters: r11 });
            let a11 = o7(r11, "iss"), s11 = o7(r11, "state");
            if (!a11 && e11.authorization_response_iss_parameter_supported) throw sF('response parameter "iss" (issuer) missing', oG, { parameters: r11 });
            if (a11 && a11 !== e11.issuer) throw sF('unexpected "iss" (issuer) response parameter value', oG, { expected: e11.issuer, parameters: r11 });
            switch (n11) {
              case void 0:
              case lt:
                if (void 0 !== s11) throw sF('unexpected "state" response parameter encountered', oG, { expected: void 0, parameters: r11 });
                break;
              case le:
                break;
              default:
                if (s0(n11, '"expectedState" argument'), s11 !== n11) throw sF(void 0 === s11 ? 'response parameter "state" missing' : 'unexpected "state" response parameter value', oG, { expected: n11, parameters: r11 });
            }
            if (o7(r11, "error")) throw new oo("authorization response from the server is an error", { cause: r11 });
            let o11 = o7(r11, "id_token"), l11 = o7(r11, "token");
            if (void 0 !== o11 || void 0 !== l11) throw new sK("implicit and hybrid flows are not supported");
            return i11 = new URLSearchParams(r11), oj.add(i11), i11;
          }(a10, f2, new URLSearchParams(e10), h10.checks.includes("state") ? m2 : le);
        } catch (e11) {
          if (e11 instanceof oo) {
            let t11 = { providerId: h10.id, ...Object.fromEntries(e11.cause.entries()) };
            throw u10.debug("OAuthCallbackError", t11), new rP("OAuth Provider returned an error", t11);
          }
          throw e11;
        }
        let y2 = await lc.use(t10, g2, r10), b2 = h10.callbackUrl;
        !r10.isOnRedirectProxy && h10.redirectProxyUrl && (b2 = h10.redirectProxyUrl);
        let w2 = await oN(a10, f2, s10, o10, b2, y2 ?? "decoy", { [s$]: true, [sD]: (...e11) => (h10.checks.includes("pkce") || e11[1].body.delete("code_verifier"), (h10[ai] ?? fetch)(...e11)) });
        h10.token?.conform && (w2 = await h10.token.conform(w2.clone()) ?? w2);
        let v2 = {}, _2 = "oidc" === h10.type;
        if (h10[aa]) switch (h10.id) {
          case "microsoft-entra-id":
          case "azure-ad": {
            let e11 = await w2.clone().json();
            if (e11.error) {
              let t12 = { providerId: h10.id, ...e11 };
              throw new rP(`OAuth Provider returned an error: ${e11.error}`, t12);
            }
            let { tid: t11 } = function(e12) {
              let t12, r11;
              if ("string" != typeof e12) throw new nw("JWTs must use Compact JWS serialization, JWT must be a string");
              let { 1: n11, length: i11 } = e12.split(".");
              if (5 === i11) throw new nw("Only JWTs using Compact JWS serialization can be decoded");
              if (3 !== i11) throw new nw("Invalid JWT");
              if (!n11) throw new nw("JWTs must contain a payload");
              try {
                t12 = nt(n11);
              } catch {
                throw new nw("Failed to base64url decode the payload");
              }
              try {
                r11 = JSON.parse(r3.decode(t12));
              } catch {
                throw new nw("Failed to parse the decoded payload as JSON");
              }
              if (!n2(r11)) throw new nw("Invalid JWT Claims Set");
              return r11;
            }(e11.id_token);
            if ("string" == typeof t11) {
              let e12 = a10.issuer?.match(/microsoftonline\.com\/(\w+)\/v2\.0/)?.[1] ?? "common", r11 = new URL(a10.issuer.replace(e12, t11)), n11 = await sZ(r11, { [sD]: h10[ai] });
              a10 = await s1(r11, n11);
            }
          }
        }
        let x2 = await oH(a10, f2, w2, { expectedNonce: await ld.use(t10, g2, r10), requireIdToken: _2 });
        if (_2) {
          let t11 = oT(x2);
          if (v2 = t11, h10[aa] && "apple" === h10.id) try {
            v2.user = JSON.parse(e10?.user);
          } catch {
          }
          if (false === h10.idToken) {
            let e11 = await ob(a10, f2, x2.access_token, { [sD]: h10[ai], [s$]: true });
            v2 = await o_(a10, f2, t11.sub, e11);
          }
        } else if (p2?.request) {
          let e11 = await p2.request({ tokens: x2, provider: h10 });
          e11 instanceof Object && (v2 = e11);
        } else if (p2?.url) {
          let e11 = await ob(a10, f2, x2.access_token, { [sD]: h10[ai], [s$]: true });
          v2 = await e11.json();
        } else throw TypeError("No userinfo endpoint configured");
        return x2.expires_in && (x2.expires_at = Math.floor(Date.now() / 1e3) + Number(x2.expires_in)), { ...await ly(v2, h10, x2, u10), profile: v2, cookies: g2 };
      }
      async function ly(e10, t10, r10, n10) {
        try {
          let n11 = await t10.profile(e10, r10);
          return { user: { ...n11, id: crypto.randomUUID(), email: n11.email?.toLowerCase() }, account: { ...r10, provider: t10.id, type: t10.type, providerAccountId: n11.id ?? crypto.randomUUID() } };
        } catch (r11) {
          n10.debug("getProfile error details", e10), n10.error(new rI(r11, { provider: t10.id }));
        }
      }
      async function lb(e10, t10, r10, n10) {
        let i10 = await lE(e10, t10, r10), { cookie: a10 } = await lf.create(e10, i10.challenge, r10);
        return { status: 200, cookies: [...n10 ?? [], a10], body: { action: "register", options: i10 }, headers: { "Content-Type": "application/json" } };
      }
      async function lw(e10, t10, r10, n10) {
        let i10 = await lx(e10, t10, r10), { cookie: a10 } = await lf.create(e10, i10.challenge);
        return { status: 200, cookies: [...n10 ?? [], a10], body: { action: "authenticate", options: i10 }, headers: { "Content-Type": "application/json" } };
      }
      async function lv(e10, t10, r10) {
        let n10, { adapter: i10, provider: a10 } = e10, s10 = t10.body && "string" == typeof t10.body.data ? JSON.parse(t10.body.data) : void 0;
        if (!s10 || "object" != typeof s10 || !("id" in s10) || "string" != typeof s10.id) throw new rf("Invalid WebAuthn Authentication response");
        let o10 = lT(lS(s10.id)), l10 = await i10.getAuthenticator(o10);
        if (!l10) throw new rf(`WebAuthn authenticator not found in database: ${JSON.stringify({ credentialID: o10 })}`);
        let { challenge: c10 } = await lf.use(e10, t10.cookies, r10);
        try {
          var u10;
          let r11 = a10.getRelayingParty(e10, t10);
          n10 = await a10.simpleWebAuthn.verifyAuthenticationResponse({ ...a10.verifyAuthenticationOptions, expectedChallenge: c10, response: s10, authenticator: { ...u10 = l10, credentialDeviceType: u10.credentialDeviceType, transports: lA(u10.transports), credentialID: lS(u10.credentialID), credentialPublicKey: lS(u10.credentialPublicKey) }, expectedOrigin: r11.origin, expectedRPID: r11.id });
        } catch (e11) {
          throw new rK(e11);
        }
        let { verified: h10, authenticationInfo: d2 } = n10;
        if (!h10) throw new rK("WebAuthn authentication response could not be verified");
        try {
          let { newCounter: e11 } = d2;
          await i10.updateAuthenticatorCounter(l10.credentialID, e11);
        } catch (e11) {
          throw new rm(`Failed to update authenticator counter. This may cause future authentication attempts to fail. ${JSON.stringify({ credentialID: o10, oldCounter: l10.counter, newCounter: d2.newCounter })}`, e11);
        }
        let p2 = await i10.getAccount(l10.providerAccountId, a10.id);
        if (!p2) throw new rf(`WebAuthn account not found in database: ${JSON.stringify({ credentialID: o10, providerAccountId: l10.providerAccountId })}`);
        let f2 = await i10.getUser(p2.userId);
        if (!f2) throw new rf(`WebAuthn user not found in database: ${JSON.stringify({ credentialID: o10, providerAccountId: l10.providerAccountId, userID: p2.userId })}`);
        return { account: p2, user: f2 };
      }
      async function l_(e10, t10, r10) {
        var n10;
        let i10, { provider: a10 } = e10, s10 = t10.body && "string" == typeof t10.body.data ? JSON.parse(t10.body.data) : void 0;
        if (!s10 || "object" != typeof s10 || !("id" in s10) || "string" != typeof s10.id) throw new rf("Invalid WebAuthn Registration response");
        let { challenge: o10, registerData: l10 } = await lf.use(e10, t10.cookies, r10);
        if (!l10) throw new rf("Missing user registration data in WebAuthn challenge cookie");
        try {
          let r11 = a10.getRelayingParty(e10, t10);
          i10 = await a10.simpleWebAuthn.verifyRegistrationResponse({ ...a10.verifyRegistrationOptions, expectedChallenge: o10, response: s10, expectedOrigin: r11.origin, expectedRPID: r11.id });
        } catch (e11) {
          throw new rK(e11);
        }
        if (!i10.verified || !i10.registrationInfo) throw new rK("WebAuthn registration response could not be verified");
        let c10 = { providerAccountId: lT(i10.registrationInfo.credentialID), provider: e10.provider.id, type: a10.type }, u10 = { providerAccountId: c10.providerAccountId, counter: i10.registrationInfo.counter, credentialID: lT(i10.registrationInfo.credentialID), credentialPublicKey: lT(i10.registrationInfo.credentialPublicKey), credentialBackedUp: i10.registrationInfo.credentialBackedUp, credentialDeviceType: i10.registrationInfo.credentialDeviceType, transports: (n10 = s10.response.transports, n10?.join(",")) };
        return { user: l10, account: c10, authenticator: u10 };
      }
      async function lx(e10, t10, r10) {
        let { provider: n10, adapter: i10 } = e10, a10 = r10 && r10.id ? await i10.listAuthenticatorsByUserId(r10.id) : null, s10 = n10.getRelayingParty(e10, t10);
        return await n10.simpleWebAuthn.generateAuthenticationOptions({ ...n10.authenticationOptions, rpID: s10.id, allowCredentials: a10?.map((e11) => ({ id: lS(e11.credentialID), type: "public-key", transports: lA(e11.transports) })) });
      }
      async function lE(e10, t10, r10) {
        let { provider: n10, adapter: i10 } = e10, a10 = r10.id ? await i10.listAuthenticatorsByUserId(r10.id) : null, s10 = i8(32), o10 = n10.getRelayingParty(e10, t10);
        return await n10.simpleWebAuthn.generateRegistrationOptions({ ...n10.registrationOptions, userID: s10, userName: r10.email, userDisplayName: r10.name ?? void 0, rpID: o10.id, rpName: o10.name, excludeCredentials: a10?.map((e11) => ({ id: lS(e11.credentialID), type: "public-key", transports: lA(e11.transports) })) });
      }
      function lk(e10) {
        let { provider: t10, adapter: r10 } = e10;
        if (!r10) throw new rT("An adapter is required for the WebAuthn provider");
        if (!t10 || "webauthn" !== t10.type) throw new rD("Provider must be WebAuthn");
        return { ...e10, provider: t10, adapter: r10 };
      }
      function lS(e10) {
        return new Uint8Array(tr.Buffer.from(e10, "base64"));
      }
      function lT(e10) {
        return tr.Buffer.from(e10).toString("base64");
      }
      function lA(e10) {
        return e10 ? e10.split(",") : void 0;
      }
      async function lR(e10, t10, r10, n10) {
        if (!t10.provider) throw new rD("Callback route called without provider");
        let { query: i10, body: a10, method: s10, headers: o10 } = e10, { provider: l10, adapter: c10, url: u10, callbackUrl: h10, pages: d2, jwt: p2, events: f2, callbacks: g2, session: { strategy: m2, maxAge: y2 }, logger: b2 } = t10, w2 = "jwt" === m2;
        try {
          if ("oauth" === l10.type || "oidc" === l10.type) {
            let s11, o11 = l10.authorization?.url.searchParams.get("response_mode") === "form_post" ? a10 : i10;
            if (t10.isOnRedirectProxy && o11?.state) {
              let e11 = await lh.decode(o11.state, t10);
              if (e11?.origin && new URL(e11.origin).origin !== t10.url.origin) {
                let t11 = `${e11.origin}?${new URLSearchParams(o11)}`;
                return b2.debug("Proxy redirecting to", t11), { redirect: t11, cookies: n10 };
              }
            }
            let m3 = await lm(o11, e10.cookies, t10);
            m3.cookies.length && n10.push(...m3.cookies), b2.debug("authorization result", m3);
            let { user: v2, account: _2, profile: x2 } = m3;
            if (!v2 || !_2 || !x2) return { redirect: `${u10}/signin`, cookies: n10 };
            if (c10) {
              let { getUserByAccount: e11 } = c10;
              s11 = await e11({ providerAccountId: _2.providerAccountId, provider: l10.id });
            }
            let E2 = await lC({ user: s11 ?? v2, account: _2, profile: x2 }, t10);
            if (E2) return { redirect: E2, cookies: n10 };
            let { user: k2, session: S2, isNewUser: T2 } = await sC(r10.value, v2, _2, t10);
            if (w2) {
              let e11 = { name: k2.name, email: k2.email, picture: k2.image, sub: k2.id?.toString() }, i11 = await g2.jwt({ token: e11, user: k2, account: _2, profile: x2, isNewUser: T2, trigger: T2 ? "signUp" : "signIn" });
              if (null === i11) n10.push(...r10.clean());
              else {
                let e12 = t10.cookies.sessionToken.name, a11 = await p2.encode({ ...p2, token: i11, salt: e12 }), s12 = /* @__PURE__ */ new Date();
                s12.setTime(s12.getTime() + 1e3 * y2);
                let o12 = r10.chunk(a11, { expires: s12 });
                n10.push(...o12);
              }
            } else n10.push({ name: t10.cookies.sessionToken.name, value: S2.sessionToken, options: { ...t10.cookies.sessionToken.options, expires: S2.expires } });
            if (await f2.signIn?.({ user: k2, account: _2, profile: x2, isNewUser: T2 }), T2 && d2.newUser) return { redirect: `${d2.newUser}${d2.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: h10 })}`, cookies: n10 };
            return { redirect: h10, cookies: n10 };
          }
          if ("email" === l10.type) {
            let e11 = i10?.token, a11 = i10?.email;
            if (!e11) {
              let t11 = TypeError("Missing token. The sign-in URL was manually opened without token or the link was not sent correctly in the email.", { cause: { hasToken: !!e11 } });
              throw t11.name = "Configuration", t11;
            }
            let s11 = l10.secret ?? t10.secret, o11 = await c10.useVerificationToken({ identifier: a11, token: await i4(`${e11}${s11}`) }), u11 = !!o11, m3 = u11 && o11.expires.valueOf() < Date.now();
            if (!u11 || m3 || a11 && o11.identifier !== a11) throw new rM({ hasInvite: u11, expired: m3 });
            let { identifier: b3 } = o11, v2 = await c10.getUserByEmail(b3) ?? { id: crypto.randomUUID(), email: b3, emailVerified: null }, _2 = { providerAccountId: v2.email, userId: v2.id, type: "email", provider: l10.id }, x2 = await lC({ user: v2, account: _2 }, t10);
            if (x2) return { redirect: x2, cookies: n10 };
            let { user: E2, session: k2, isNewUser: S2 } = await sC(r10.value, v2, _2, t10);
            if (w2) {
              let e12 = { name: E2.name, email: E2.email, picture: E2.image, sub: E2.id?.toString() }, i11 = await g2.jwt({ token: e12, user: E2, account: _2, isNewUser: S2, trigger: S2 ? "signUp" : "signIn" });
              if (null === i11) n10.push(...r10.clean());
              else {
                let e13 = t10.cookies.sessionToken.name, a12 = await p2.encode({ ...p2, token: i11, salt: e13 }), s12 = /* @__PURE__ */ new Date();
                s12.setTime(s12.getTime() + 1e3 * y2);
                let o12 = r10.chunk(a12, { expires: s12 });
                n10.push(...o12);
              }
            } else n10.push({ name: t10.cookies.sessionToken.name, value: k2.sessionToken, options: { ...t10.cookies.sessionToken.options, expires: k2.expires } });
            if (await f2.signIn?.({ user: E2, account: _2, isNewUser: S2 }), S2 && d2.newUser) return { redirect: `${d2.newUser}${d2.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: h10 })}`, cookies: n10 };
            return { redirect: h10, cookies: n10 };
          }
          if ("credentials" === l10.type && "POST" === s10) {
            let e11 = a10 ?? {};
            Object.entries(i10 ?? {}).forEach(([e12, t11]) => u10.searchParams.set(e12, t11));
            let c11 = await l10.authorize(e11, new Request(u10, { headers: o10, method: s10, body: JSON.stringify(a10) }));
            if (c11) c11.id = c11.id?.toString() ?? crypto.randomUUID();
            else throw new rx();
            let d3 = { providerAccountId: c11.id, type: "credentials", provider: l10.id }, m3 = await lC({ user: c11, account: d3, credentials: e11 }, t10);
            if (m3) return { redirect: m3, cookies: n10 };
            let b3 = { name: c11.name, email: c11.email, picture: c11.image, sub: c11.id }, w3 = await g2.jwt({ token: b3, user: c11, account: d3, isNewUser: false, trigger: "signIn" });
            if (null === w3) n10.push(...r10.clean());
            else {
              let e12 = t10.cookies.sessionToken.name, i11 = await p2.encode({ ...p2, token: w3, salt: e12 }), a11 = /* @__PURE__ */ new Date();
              a11.setTime(a11.getTime() + 1e3 * y2);
              let s11 = r10.chunk(i11, { expires: a11 });
              n10.push(...s11);
            }
            return await f2.signIn?.({ user: c11, account: d3 }), { redirect: h10, cookies: n10 };
          } else if ("webauthn" === l10.type && "POST" === s10) {
            let i11, a11, s11, o11 = e10.body?.action;
            if ("string" != typeof o11 || "authenticate" !== o11 && "register" !== o11) throw new rf("Invalid action parameter");
            let l11 = lk(t10);
            switch (o11) {
              case "authenticate": {
                let t11 = await lv(l11, e10, n10);
                i11 = t11.user, a11 = t11.account;
                break;
              }
              case "register": {
                let r11 = await l_(t10, e10, n10);
                i11 = r11.user, a11 = r11.account, s11 = r11.authenticator;
              }
            }
            await lC({ user: i11, account: a11 }, t10);
            let { user: c11, isNewUser: u11, session: m3, account: b3 } = await sC(r10.value, i11, a11, t10);
            if (!b3) throw new rf("Error creating or finding account");
            if (s11 && c11.id && await l11.adapter.createAuthenticator({ ...s11, userId: c11.id }), w2) {
              let e11 = { name: c11.name, email: c11.email, picture: c11.image, sub: c11.id?.toString() }, i12 = await g2.jwt({ token: e11, user: c11, account: b3, isNewUser: u11, trigger: u11 ? "signUp" : "signIn" });
              if (null === i12) n10.push(...r10.clean());
              else {
                let e12 = t10.cookies.sessionToken.name, a12 = await p2.encode({ ...p2, token: i12, salt: e12 }), s12 = /* @__PURE__ */ new Date();
                s12.setTime(s12.getTime() + 1e3 * y2);
                let o12 = r10.chunk(a12, { expires: s12 });
                n10.push(...o12);
              }
            } else n10.push({ name: t10.cookies.sessionToken.name, value: m3.sessionToken, options: { ...t10.cookies.sessionToken.options, expires: m3.expires } });
            if (await f2.signIn?.({ user: c11, account: b3, isNewUser: u11 }), u11 && d2.newUser) return { redirect: `${d2.newUser}${d2.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: h10 })}`, cookies: n10 };
            return { redirect: h10, cookies: n10 };
          }
          throw new rD(`Callback for provider type (${l10.type}) is not supported`);
        } catch (t11) {
          if (t11 instanceof rf) throw t11;
          let e11 = new rb(t11, { provider: l10.id });
          throw b2.debug("callback route error details", { method: s10, query: i10, body: a10 }), e11;
        }
      }
      async function lC(e10, t10) {
        let r10, { signIn: n10, redirect: i10 } = t10.callbacks;
        try {
          r10 = await n10(e10);
        } catch (e11) {
          if (e11 instanceof rf) throw e11;
          throw new ry(e11);
        }
        if (!r10) throw new ry("AccessDenied");
        if ("string" == typeof r10) return await i10({ url: r10, baseUrl: t10.url.origin });
      }
      async function lO(e10, t10, r10, n10, i10) {
        let { adapter: a10, jwt: s10, events: o10, callbacks: l10, logger: c10, session: { strategy: u10, maxAge: h10 } } = e10, d2 = { body: null, headers: { "Content-Type": "application/json", ...!n10 && { "Cache-Control": "private, no-cache, no-store", Expires: "0", Pragma: "no-cache" } }, cookies: r10 }, p2 = t10.value;
        if (!p2) return d2;
        if ("jwt" === u10) {
          try {
            let r11 = e10.cookies.sessionToken.name, a11 = await s10.decode({ ...s10, token: p2, salt: r11 });
            if (!a11) throw Error("Invalid JWT");
            let c11 = await l10.jwt({ token: a11, ...n10 && { trigger: "update" }, session: i10 }), u11 = sR(h10);
            if (null !== c11) {
              let e11 = { user: { name: c11.name, email: c11.email, image: c11.picture }, expires: u11.toISOString() }, n11 = await l10.session({ session: e11, token: c11 });
              d2.body = n11;
              let i11 = await s10.encode({ ...s10, token: c11, salt: r11 }), a12 = t10.chunk(i11, { expires: u11 });
              d2.cookies?.push(...a12), await o10.session?.({ session: n11, token: c11 });
            } else d2.cookies?.push(...t10.clean());
          } catch (e11) {
            c10.error(new rS(e11)), d2.cookies?.push(...t10.clean());
          }
          return d2;
        }
        try {
          let { getSessionAndUser: r11, deleteSession: s11, updateSession: c11 } = a10, u11 = await r11(p2);
          if (u11 && u11.session.expires.valueOf() < Date.now() && (await s11(p2), u11 = null), u11) {
            let { user: t11, session: r12 } = u11, a11 = e10.session.updateAge, s12 = r12.expires.valueOf() - 1e3 * h10 + 1e3 * a11, f2 = sR(h10);
            s12 <= Date.now() && await c11({ sessionToken: p2, expires: f2 });
            let g2 = await l10.session({ session: { ...r12, user: t11 }, user: t11, newSession: i10, ...n10 ? { trigger: "update" } : {} });
            d2.body = g2, d2.cookies?.push({ name: e10.cookies.sessionToken.name, value: p2, options: { ...e10.cookies.sessionToken.options, expires: f2 } }), await o10.session?.({ session: g2 });
          } else p2 && d2.cookies?.push(...t10.clean());
        } catch (e11) {
          c10.error(new rj(e11));
        }
        return d2;
      }
      async function lP(e10, t10) {
        let r10, n10, { logger: i10, provider: a10 } = t10, s10 = a10.authorization?.url;
        if (!s10 || "authjs.dev" === s10.host) {
          let e11 = new URL(a10.issuer), t11 = await sZ(e11, { [sD]: a10[ai], [s$]: true }), r11 = await s1(e11, t11).catch((t12) => {
            if (!(t12 instanceof TypeError) || "Invalid URL" !== t12.message) throw t12;
            throw TypeError(`Discovery request responded with an invalid issuer. expected: ${e11}`);
          });
          if (!r11.authorization_endpoint) throw TypeError("Authorization server did not provide an authorization endpoint.");
          s10 = new URL(r11.authorization_endpoint);
        }
        let o10 = s10.searchParams, l10 = a10.callbackUrl;
        !t10.isOnRedirectProxy && a10.redirectProxyUrl && (l10 = a10.redirectProxyUrl, n10 = a10.callbackUrl, i10.debug("using redirect proxy", { redirect_uri: l10, data: n10 }));
        let c10 = Object.assign({ response_type: "code", client_id: a10.clientId, redirect_uri: l10, ...a10.authorization?.params }, Object.fromEntries(a10.authorization?.url.searchParams ?? []), e10);
        for (let e11 in c10) o10.set(e11, c10[e11]);
        let u10 = [];
        a10.authorization?.url.searchParams.get("response_mode") === "form_post" && (t10.cookies.state.options.sameSite = "none", t10.cookies.state.options.secure = true, t10.cookies.nonce.options.sameSite = "none", t10.cookies.nonce.options.secure = true);
        let h10 = await lh.create(t10, n10);
        if (h10 && (o10.set("state", h10.value), u10.push(h10.cookie)), a10.checks?.includes("pkce")) if (r10 && !r10.code_challenge_methods_supported?.includes("S256")) "oidc" === a10.type && (a10.checks = ["nonce"]);
        else {
          let { value: e11, cookie: r11 } = await lc.create(t10);
          o10.set("code_challenge", e11), o10.set("code_challenge_method", "S256"), u10.push(r11);
        }
        let d2 = await ld.create(t10);
        return d2 && (o10.set("nonce", d2.value), u10.push(d2.cookie)), "oidc" !== a10.type || s10.searchParams.has("scope") || s10.searchParams.set("scope", "openid profile email"), i10.debug("authorization url is ready", { url: s10, cookies: u10, provider: a10 }), { redirect: s10.toString(), cookies: u10 };
      }
      async function lI(e10, t10) {
        let r10, { body: n10 } = e10, { provider: i10, callbacks: a10, adapter: s10 } = t10, o10 = (i10.normalizeIdentifier ?? function(e11) {
          if (!e11) throw Error("Missing email from request body.");
          let t11 = e11.toLowerCase().trim();
          if (t11.includes('"')) throw Error("Invalid email address format.");
          let [r11, n11] = t11.split("@");
          if (!r11 || !n11 || 2 !== t11.split("@").length || !(n11 = n11.split(",")[0])) throw Error("Invalid email address format.");
          return `${r11}@${n11}`;
        })(n10?.email), l10 = { id: crypto.randomUUID(), email: o10, emailVerified: null }, c10 = await s10.getUserByEmail(o10) ?? l10, u10 = { providerAccountId: o10, userId: c10.id, type: "email", provider: i10.id };
        try {
          r10 = await a10.signIn({ user: c10, account: u10, email: { verificationRequest: true } });
        } catch (e11) {
          throw new ry(e11);
        }
        if (!r10) throw new ry("AccessDenied");
        if ("string" == typeof r10) return { redirect: await a10.redirect({ url: r10, baseUrl: t10.url.origin }) };
        let { callbackUrl: h10, theme: d2 } = t10, p2 = await i10.generateVerificationToken?.() ?? i8(32), f2 = new Date(Date.now() + (i10.maxAge ?? 86400) * 1e3), g2 = i10.secret ?? t10.secret, m2 = new URL(t10.basePath, t10.url.origin), y2 = i10.sendVerificationRequest({ identifier: o10, token: p2, expires: f2, url: `${m2}/callback/${i10.id}?${new URLSearchParams({ callbackUrl: h10, token: p2, email: o10 })}`, provider: i10, theme: d2, request: new Request(e10.url, { headers: e10.headers, method: e10.method, body: "POST" === e10.method ? JSON.stringify(e10.body ?? {}) : void 0 }) }), b2 = s10.createVerificationToken?.({ identifier: o10, token: await i4(`${p2}${g2}`), expires: f2 });
        return await Promise.all([y2, b2]), { redirect: `${m2}/verify-request?${new URLSearchParams({ provider: i10.id, type: i10.type })}` };
      }
      async function lj(e10, t10, r10) {
        let n10 = `${r10.url.origin}${r10.basePath}/signin`;
        if (!r10.provider) return { redirect: n10, cookies: t10 };
        switch (r10.provider.type) {
          case "oauth":
          case "oidc": {
            let { redirect: n11, cookies: i10 } = await lP(e10.query, r10);
            return i10 && t10.push(...i10), { redirect: n11, cookies: t10 };
          }
          case "email":
            return { ...await lI(e10, r10), cookies: t10 };
          default:
            return { redirect: n10, cookies: t10 };
        }
      }
      async function l$(e10, t10, r10) {
        let { jwt: n10, events: i10, callbackUrl: a10, logger: s10, session: o10 } = r10, l10 = t10.value;
        if (!l10) return { redirect: a10, cookies: e10 };
        try {
          if ("jwt" === o10.strategy) {
            let e11 = r10.cookies.sessionToken.name, t11 = await n10.decode({ ...n10, token: l10, salt: e11 });
            await i10.signOut?.({ token: t11 });
          } else {
            let e11 = await r10.adapter?.deleteSession(l10);
            await i10.signOut?.({ session: e11 });
          }
        } catch (e11) {
          s10.error(new r$(e11));
        }
        return e10.push(...t10.clean()), { redirect: a10, cookies: e10 };
      }
      async function lN(e10, t10) {
        let { adapter: r10, jwt: n10, session: { strategy: i10 } } = e10, a10 = t10.value;
        if (!a10) return null;
        if ("jwt" === i10) {
          let t11 = e10.cookies.sessionToken.name, r11 = await n10.decode({ ...n10, token: a10, salt: t11 });
          if (r11 && r11.sub) return { id: r11.sub, name: r11.name, email: r11.email, image: r11.picture };
        } else {
          let e11 = await r10?.getSessionAndUser(a10);
          if (e11) return e11.user;
        }
        return null;
      }
      async function lU(e10, t10, r10, n10) {
        let i10 = lk(t10), { provider: a10 } = i10, { action: s10 } = e10.query ?? {};
        if ("register" !== s10 && "authenticate" !== s10 && void 0 !== s10) return { status: 400, body: { error: "Invalid action" }, cookies: n10, headers: { "Content-Type": "application/json" } };
        let o10 = await lN(t10, r10), l10 = o10 ? { user: o10, exists: true } : await a10.getUserInfo(t10, e10), c10 = l10?.user;
        switch (function(e11, t11, r11) {
          let { user: n11, exists: i11 = false } = r11 ?? {};
          switch (e11) {
            case "authenticate":
              return "authenticate";
            case "register":
              if (n11 && t11 === i11) return "register";
              break;
            case void 0:
              if (!t11) if (!n11) return "authenticate";
              else if (i11) return "authenticate";
              else return "register";
          }
          return null;
        }(s10, !!o10, l10)) {
          case "authenticate":
            return lw(i10, e10, c10, n10);
          case "register":
            if ("string" == typeof c10?.email) return lb(i10, e10, c10, n10);
            break;
          default:
            return { status: 400, body: { error: "Invalid request" }, cookies: n10, headers: { "Content-Type": "application/json" } };
        }
      }
      async function lD(e10, t10) {
        let { action: r10, providerId: n10, error: i10, method: a10 } = e10, s10 = t10.skipCSRFCheck === ar, { options: o10, cookies: l10 } = await ah({ authOptions: t10, action: r10, providerId: n10, url: e10.url, callbackUrl: e10.body?.callbackUrl ?? e10.query?.callbackUrl, csrfToken: e10.body?.csrfToken, cookies: e10.cookies, isPost: "POST" === a10, csrfDisabled: s10 }), c10 = new rp(o10.cookies.sessionToken, e10.cookies, o10.logger);
        if ("GET" === a10) {
          let t11 = sA({ ...o10, query: e10.query, cookies: l10 });
          switch (r10) {
            case "callback":
              return await lR(e10, o10, c10, l10);
            case "csrf":
              return t11.csrf(s10, o10, l10);
            case "error":
              return t11.error(i10);
            case "providers":
              return t11.providers(o10.providers);
            case "session":
              return await lO(o10, c10, l10);
            case "signin":
              return t11.signin(n10, i10);
            case "signout":
              return t11.signout();
            case "verify-request":
              return t11.verifyRequest();
            case "webauthn-options":
              return await lU(e10, o10, c10, l10);
          }
        } else {
          let { csrfTokenVerified: t11 } = o10;
          switch (r10) {
            case "callback":
              return "credentials" === o10.provider.type && i7(r10, t11), await lR(e10, o10, c10, l10);
            case "session":
              return i7(r10, t11), await lO(o10, c10, l10, true, e10.body?.data);
            case "signin":
              return i7(r10, t11), await lj(e10, l10, o10);
            case "signout":
              return i7(r10, t11), await l$(l10, c10, o10);
          }
        }
        throw new rN(`Cannot handle action: ${r10}`);
      }
      function lL(e10, t10, r10, n10, i10) {
        let a10, s10 = i10?.basePath, o10 = n10.AUTH_URL ?? n10.NEXTAUTH_URL;
        if (o10) a10 = new URL(o10), s10 && "/" !== s10 && "/" !== a10.pathname && (a10.pathname !== s10 && iQ(i10).warn("env-url-basepath-mismatch"), a10.pathname = "/");
        else {
          let e11 = r10.get("x-forwarded-host") ?? r10.get("host"), n11 = r10.get("x-forwarded-proto") ?? t10 ?? "https", i11 = n11.endsWith(":") ? n11 : n11 + ":";
          a10 = new URL(`${i11}//${e11}`);
        }
        let l10 = a10.toString().replace(/\/$/, "");
        if (s10) {
          let t11 = s10?.replace(/(^\/|\/$)/g, "") ?? "";
          return new URL(`${l10}/${t11}/${e10}`);
        }
        return new URL(`${l10}/${e10}`);
      }
      async function lM(e10, t10) {
        let r10 = iQ(t10), n10 = await i6(e10, t10);
        if (!n10) return Response.json("Bad request.", { status: 400 });
        let i10 = function(e11, t11) {
          let { url: r11 } = e11, n11 = [];
          if (!rz && t11.debug && n11.push("debug-enabled"), !t11.trustHost) return new rL(`Host must be trusted. URL was: ${e11.url}`);
          if (!t11.secret?.length) return new rC("Please define a `secret`");
          let i11 = e11.query?.callbackUrl;
          if (i11 && !rV(i11, r11.origin)) return new r_(`Invalid callback URL. Received: ${i11}`);
          let { callbackUrl: a11 } = rd(t11.useSecureCookies ?? "https:" === r11.protocol), s11 = e11.cookies?.[t11.cookies?.callbackUrl?.name ?? a11.name];
          if (s11 && !rV(s11, r11.origin)) return new r_(`Invalid callback URL. Received: ${s11}`);
          let o10 = false;
          for (let e12 of t11.providers) {
            let t12 = "function" == typeof e12 ? e12() : e12;
            if (("oauth" === t12.type || "oidc" === t12.type) && !(t12.issuer ?? t12.options?.issuer)) {
              let e13, { authorization: r12, token: n12, userinfo: i12 } = t12;
              if ("string" == typeof r12 || r12?.url ? "string" == typeof n12 || n12?.url ? "string" == typeof i12 || i12?.url || (e13 = "userinfo") : e13 = "token" : e13 = "authorization", e13) return new rE(`Provider "${t12.id}" is missing both \`issuer\` and \`${e13}\` endpoint config. At least one of them is required`);
            }
            if ("credentials" === t12.type) rG = true;
            else if ("email" === t12.type) rX = true;
            else if ("webauthn" === t12.type) {
              var l10;
              if (rY = true, t12.simpleWebAuthnBrowserVersion && (l10 = t12.simpleWebAuthnBrowserVersion, !/^v\d+(?:\.\d+){0,2}$/.test(l10))) return new rf(`Invalid provider config for "${t12.id}": simpleWebAuthnBrowserVersion "${t12.simpleWebAuthnBrowserVersion}" must be a valid semver string.`);
              if (t12.enableConditionalUI) {
                if (o10) return new rW("Multiple webauthn providers have 'enableConditionalUI' set to True. Only one provider can have this option enabled at a time");
                if (o10 = true, !Object.values(t12.formFields).some((e13) => e13.autocomplete && e13.autocomplete.toString().indexOf("webauthn") > -1)) return new rq(`Provider "${t12.id}" has 'enableConditionalUI' set to True, but none of its formFields have 'webauthn' in their autocomplete param`);
              }
            }
          }
          if (rG) {
            let e12 = t11.session?.strategy === "database", r12 = !t11.providers.some((e13) => "credentials" !== ("function" == typeof e13 ? e13() : e13).type);
            if (e12 && r12) return new rU("Signing in with credentials only supported if JWT strategy is enabled");
            if (t11.providers.some((e13) => {
              let t12 = "function" == typeof e13 ? e13() : e13;
              return "credentials" === t12.type && !t12.authorize;
            })) return new rR("Must define an authorize() handler to use credentials authentication provider");
          }
          let { adapter: c10, session: u10 } = t11, h10 = [];
          if (rX || u10?.strategy === "database" || !u10?.strategy && c10) if (rX) {
            if (!c10) return new rT("Email login requires an adapter");
            h10.push(...rZ);
          } else {
            if (!c10) return new rT("Database session requires an adapter");
            h10.push(...rQ);
          }
          if (rY) {
            if (!t11.experimental?.enableWebAuthn) return new rF("WebAuthn is an experimental feature. To enable it, set `experimental.enableWebAuthn` to `true` in your config");
            if (n11.push("experimental-webauthn"), !c10) return new rT("WebAuthn requires an adapter");
            h10.push(...r0);
          }
          if (c10) {
            let e12 = h10.filter((e13) => !(e13 in c10));
            if (e12.length) return new rA(`Required adapter methods were missing: ${e12.join(", ")}`);
          }
          return rz || (rz = true), n11;
        }(n10, t10);
        if (Array.isArray(i10)) i10.forEach(r10.warn);
        else if (i10) {
          if (r10.error(i10), !(/* @__PURE__ */ new Set(["signin", "signout", "error", "verify-request"])).has(n10.action) || "GET" !== n10.method) return Response.json({ message: "There was a problem with the server configuration. Check the server logs for more information." }, { status: 500 });
          let { pages: e11, theme: a11 } = t10, s11 = e11?.error && n10.url.searchParams.get("callbackUrl")?.startsWith(e11.error);
          if (!e11?.error || s11) return s11 && r10.error(new rw(`The error page ${e11?.error} should not require authentication`)), i3(sA({ theme: a11 }).error("Configuration"));
          let o10 = `${n10.url.origin}${e11.error}?error=Configuration`;
          return Response.redirect(o10);
        }
        let a10 = e10.headers?.has("X-Auth-Return-Redirect"), s10 = t10.raw === an;
        try {
          let e11 = await lD(n10, t10);
          if (s10) return e11;
          let r11 = i3(e11), i11 = r11.headers.get("Location");
          if (!a10 || !i11) return r11;
          return Response.json({ url: i11 }, { headers: r11.headers });
        } catch (h10) {
          r10.error(h10);
          let i11 = h10 instanceof rf;
          if (i11 && s10 && !a10) throw h10;
          if ("POST" === e10.method && "session" === n10.action) return Response.json(null, { status: 400 });
          let o10 = new URLSearchParams({ error: h10 instanceof rf && rB.has(h10.type) ? h10.type : "Configuration" });
          h10 instanceof rx && o10.set("code", h10.code);
          let l10 = i11 && h10.kind || "error", c10 = t10.pages?.[l10] ?? `${t10.basePath}/${l10.toLowerCase()}`, u10 = `${n10.url.origin}${c10}?${o10}`;
          if (a10) return Response.json({ url: u10 });
          return Response.redirect(u10);
        }
      }
      e.i(64445);
      var lH = e.i(63072);
      function lB() {
        let e10 = th.getStore();
        return (null == e10 ? void 0 : e10.rootTaskSpawnPhase) === "action";
      }
      function lW(e10) {
        let t10 = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
        if (!t10) return e10;
        let { origin: r10 } = new URL(t10), { href: n10, origin: i10 } = e10.nextUrl;
        return new ec(n10.replace(i10, r10), e10);
      }
      function lq(e10) {
        try {
          e10.secret ?? (e10.secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
          let t10 = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
          if (!t10) return;
          let { pathname: r10 } = new URL(t10);
          if ("/" === r10) return;
          e10.basePath || (e10.basePath = r10);
        } catch {
        } finally {
          e10.basePath || (e10.basePath = "/api/auth"), function(e11, t10, r10 = false) {
            try {
              let n10 = e11.AUTH_URL;
              n10 && (t10.basePath ? r10 || iQ(t10).warn("env-url-basepath-redundant") : t10.basePath = new URL(n10).pathname);
            } catch {
            } finally {
              t10.basePath ?? (t10.basePath = "/auth");
            }
            if (!t10.secret?.length) {
              t10.secret = [];
              let r11 = e11.AUTH_SECRET;
              for (let n10 of (r11 && t10.secret.push(r11), [1, 2, 3])) {
                let r12 = e11[`AUTH_SECRET_${n10}`];
                r12 && t10.secret.unshift(r12);
              }
            }
            t10.redirectProxyUrl ?? (t10.redirectProxyUrl = e11.AUTH_REDIRECT_PROXY_URL), t10.trustHost ?? (t10.trustHost = !!(e11.AUTH_URL ?? e11.AUTH_TRUST_HOST ?? e11.VERCEL ?? e11.CF_PAGES ?? "production" !== e11.NODE_ENV)), t10.providers = t10.providers.map((t11) => {
              let { id: r11 } = "function" == typeof t11 ? t11({}) : t11, n10 = r11.toUpperCase().replace(/-/g, "_"), i10 = e11[`AUTH_${n10}_ID`], a10 = e11[`AUTH_${n10}_SECRET`], s10 = e11[`AUTH_${n10}_ISSUER`], o10 = e11[`AUTH_${n10}_KEY`], l10 = "function" == typeof t11 ? t11({ clientId: i10, clientSecret: a10, issuer: s10, apiKey: o10 }) : t11;
              return "oauth" === l10.type || "oidc" === l10.type ? (l10.clientId ?? (l10.clientId = i10), l10.clientSecret ?? (l10.clientSecret = a10), l10.issuer ?? (l10.issuer = s10)) : "email" === l10.type && (l10.apiKey ?? (l10.apiKey = o10)), l10;
            });
          }(process.env, e10, true);
        }
      }
      var eE = eE, e7 = e7;
      class lK extends Error {
        constructor(...e10) {
          super(...e10), this.code = "NEXT_STATIC_GEN_BAILOUT";
        }
      }
      var lJ = e.i(51564), lF = e.i(40049);
      let lz = { current: null }, lV = "function" == typeof lF.cache ? lF.cache : (e10) => e10, lG = console.warn;
      function lX(e10) {
        return function(...t10) {
          lG(e10(...t10));
        };
      }
      function lY() {
        let e10 = "cookies", t10 = eE.workAsyncStorageInstance.getStore(), r10 = e7.workUnitAsyncStorageInstance.getStore();
        if (t10) {
          if (r10 && "after" === r10.phase && !lB()) throw Object.defineProperty(Error(`Route ${t10.route} used \`cookies()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`cookies()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", { value: "E843", enumerable: false, configurable: true });
          if (t10.forceStatic) return lQ(eS.seal(new eo.RequestCookies(new Headers({}))));
          if (t10.dynamicShouldError) throw Object.defineProperty(new lK(`Route ${t10.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E849", enumerable: false, configurable: true });
          if (r10) switch (r10.type) {
            case "cache":
              let a10 = Object.defineProperty(Error(`Route ${t10.route} used \`cookies()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E831", enumerable: false, configurable: true });
              throw Error.captureStackTrace(a10, lY), t10.invalidDynamicUsageError ??= a10, a10;
            case "unstable-cache":
              throw Object.defineProperty(Error(`Route ${t10.route} used \`cookies()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E846", enumerable: false, configurable: true });
            case "generate-static-params":
              throw Object.defineProperty(Error(`Route ${t10.route} used \`cookies()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E1123", enumerable: false, configurable: true });
            case "prerender":
              var n10 = t10, i10 = r10;
              let s10 = lZ.get(i10);
              if (s10) return s10;
              let o10 = (0, lJ.makeHangingPromise)(i10.renderSignal, n10.route, "`cookies()`");
              return lZ.set(i10, o10), o10;
            case "prerender-client":
            case "validation-client":
              let l10 = "`cookies`";
              throw Object.defineProperty(new tt.InvariantError(`${l10} must not be used within a Client Component. Next.js should be preventing ${l10} from being included in Client Components statically, but did not in this case.`), "__NEXT_ERROR_CODE", { value: "E1037", enumerable: false, configurable: true });
            case "prerender-ppr":
              return (0, lH.postponeWithTracking)(t10.route, e10, r10.dynamicTracking);
            case "prerender-legacy":
              return (0, lH.throwToInterruptStaticGeneration)(e10, t10, r10);
            case "prerender-runtime":
              return (0, lJ.delayUntilRuntimeStage)(r10, lQ(r10.cookies));
            case "private-cache":
              return lQ(r10.cookies);
            case "request":
              let c10;
              if ((0, lH.trackDynamicDataInDynamicRender)(r10), c10 = eR(r10) ? r10.userspaceMutableCookies : r10.cookies, !r10.asyncApiPromises) return lQ(c10);
              {
                let e11 = (0, e9.isInEarlyRenderStage)(r10);
                if (c10 === r10.mutableCookies) return e11 ? r10.asyncApiPromises.earlyMutableCookies : r10.asyncApiPromises.mutableCookies;
                return e11 ? r10.asyncApiPromises.earlyCookies : r10.asyncApiPromises.cookies;
              }
          }
        }
        (0, e9.throwForMissingRequestStore)(e10);
      }
      lV((e10) => {
        try {
          lG(lz.current);
        } finally {
          lz.current = null;
        }
      }), e.i(38174);
      let lZ = /* @__PURE__ */ new WeakMap();
      function lQ(e10) {
        let t10 = lZ.get(e10);
        if (t10) return t10;
        let r10 = Promise.resolve(e10);
        return lZ.set(e10, r10), r10;
      }
      lX(function(e10, t10) {
        let r10 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r10}used ${t10}. \`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E830", enumerable: false, configurable: true });
      });
      var eE = eE, e7 = e7;
      function l0() {
        let e10 = "headers", t10 = eE.workAsyncStorageInstance.getStore(), r10 = e7.workUnitAsyncStorageInstance.getStore();
        if (t10) {
          if (r10 && "after" === r10.phase && !lB()) throw Object.defineProperty(Error(`Route ${t10.route} used \`headers()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`headers()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", { value: "E839", enumerable: false, configurable: true });
          if (t10.forceStatic) return l2(ex.seal(new Headers({})));
          if (r10) switch (r10.type) {
            case "cache": {
              let e11 = Object.defineProperty(Error(`Route ${t10.route} used \`headers()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E833", enumerable: false, configurable: true });
              throw Error.captureStackTrace(e11, l0), t10.invalidDynamicUsageError ??= e11, e11;
            }
            case "unstable-cache":
              throw Object.defineProperty(Error(`Route ${t10.route} used \`headers()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E838", enumerable: false, configurable: true });
            case "generate-static-params":
              throw Object.defineProperty(Error(`Route ${t10.route} used \`headers()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E1134", enumerable: false, configurable: true });
          }
          if (t10.dynamicShouldError) throw Object.defineProperty(new lK(`Route ${t10.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E828", enumerable: false, configurable: true });
          if (r10) switch (r10.type) {
            case "prerender":
              var n10 = t10, i10 = r10;
              let a10 = l1.get(i10);
              if (a10) return a10;
              let s10 = (0, lJ.makeHangingPromise)(i10.renderSignal, n10.route, "`headers()`");
              return l1.set(i10, s10), s10;
            case "prerender-client":
            case "validation-client":
              let o10 = "`headers`";
              throw Object.defineProperty(new tt.InvariantError(`${o10} must not be used within a client component. Next.js should be preventing ${o10} from being included in client components statically, but did not in this case.`), "__NEXT_ERROR_CODE", { value: "E1017", enumerable: false, configurable: true });
            case "prerender-ppr":
              return (0, lH.postponeWithTracking)(t10.route, e10, r10.dynamicTracking);
            case "prerender-legacy":
              return (0, lH.throwToInterruptStaticGeneration)(e10, t10, r10);
            case "prerender-runtime":
              return (0, lJ.delayUntilRuntimeStage)(r10, l2(r10.headers));
            case "private-cache":
              return l2(r10.headers);
            case "request":
              if ((0, lH.trackDynamicDataInDynamicRender)(r10), r10.asyncApiPromises) return (0, e9.isInEarlyRenderStage)(r10) ? r10.asyncApiPromises.earlyHeaders : r10.asyncApiPromises.headers;
              return l2(r10.headers);
          }
        }
        (0, e9.throwForMissingRequestStore)(e10);
      }
      let l1 = /* @__PURE__ */ new WeakMap();
      function l2(e10) {
        let t10 = l1.get(e10);
        if (t10) return t10;
        let r10 = Promise.resolve(e10);
        return l1.set(e10, r10), r10;
      }
      lX(function(e10, t10) {
        let r10 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r10}used ${t10}. \`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E836", enumerable: false, configurable: true });
      });
      var eE = eE, e7 = e7;
      async function l5(e10, t10) {
        return lM(new Request(lL("session", e10.get("x-forwarded-proto"), e10, process.env, t10), { headers: { cookie: e10.get("cookie") ?? "" } }), { ...t10, callbacks: { ...t10.callbacks, async session(...e11) {
          let r10 = await t10.callbacks?.session?.(...e11) ?? { ...e11[0].session, expires: e11[0].session.expires?.toISOString?.() ?? e11[0].session.expires };
          return { user: e11[0].user ?? e11[0].token, ...r10 };
        } } });
      }
      function l6(e10) {
        return "function" == typeof e10;
      }
      function l3(e10, t10) {
        return "function" == typeof e10 ? async (...r10) => {
          if (!r10.length) {
            let r11 = await l0(), n11 = await e10(void 0);
            return t10?.(n11), l5(r11, n11).then((e11) => e11.json());
          }
          if (r10[0] instanceof Request) {
            let n11 = r10[0], i11 = r10[1], a11 = await e10(n11);
            return t10?.(a11), l4([n11, i11], a11);
          }
          if (l6(r10[0])) {
            let n11 = r10[0];
            return async (...r11) => {
              let i11 = await e10(r11[0]);
              return t10?.(i11), l4(r11, i11, n11);
            };
          }
          let n10 = "req" in r10[0] ? r10[0].req : r10[0], i10 = "res" in r10[0] ? r10[0].res : r10[1], a10 = await e10(n10);
          return t10?.(a10), l5(new Headers(n10.headers), a10).then(async (e11) => {
            let t11 = await e11.json();
            for (let t12 of e11.headers.getSetCookie()) "headers" in i10 ? i10.headers.append("set-cookie", t12) : i10.appendHeader("set-cookie", t12);
            return t11;
          });
        } : (...t11) => {
          if (!t11.length) return Promise.resolve(l0()).then((t12) => l5(t12, e10).then((e11) => e11.json()));
          if (t11[0] instanceof Request) return l4([t11[0], t11[1]], e10);
          if (l6(t11[0])) {
            let r11 = t11[0];
            return async (...t12) => l4(t12, e10, r11).then((e11) => e11);
          }
          let r10 = "req" in t11[0] ? t11[0].req : t11[0], n10 = "res" in t11[0] ? t11[0].res : t11[1];
          return l5(new Headers(r10.headers), e10).then(async (e11) => {
            let t12 = await e11.json();
            for (let t13 of e11.headers.getSetCookie()) "headers" in n10 ? n10.headers.append("set-cookie", t13) : n10.appendHeader("set-cookie", t13);
            return t12;
          });
        };
      }
      async function l4(e10, t10, r10) {
        let n10 = lW(e10[0]), i10 = await l5(n10.headers, t10), a10 = await i10.json(), s10 = true;
        t10.callbacks?.authorized && (s10 = await t10.callbacks.authorized({ request: n10, auth: a10 }));
        let o10 = ef.next?.();
        if (s10 instanceof Response) {
          var l10, c10, u10;
          let e11, r11;
          o10 = s10;
          let i11 = s10.headers.get("Location"), { pathname: a11 } = n10.nextUrl;
          i11 && (l10 = a11, c10 = new URL(i11).pathname, u10 = t10, e11 = c10.replace(`${l10}/`, ""), r11 = Object.values(u10.pages ?? {}), (l8.has(e11) || r11.includes(c10)) && c10 === l10) && (s10 = true);
        } else if (r10) n10.auth = a10, o10 = await r10(n10, e10[1]) ?? ef.next();
        else if (!s10) {
          let e11 = t10.pages?.signIn ?? `${t10.basePath}/signin`;
          if (n10.nextUrl.pathname !== e11) {
            let t11 = n10.nextUrl.clone();
            t11.pathname = e11, t11.searchParams.set("callbackUrl", n10.nextUrl.href), o10 = ef.redirect(t11);
          }
        }
        let h10 = new Response(o10?.body, o10);
        for (let e11 of i10.headers.getSetCookie()) h10.headers.append("set-cookie", e11);
        return h10;
      }
      e.i(18368), /* @__PURE__ */ new WeakMap(), lX(function(e10, t10) {
        let r10 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r10}used ${t10}. \`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E835", enumerable: false, configurable: true });
      });
      let l8 = /* @__PURE__ */ new Set(["providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error"]);
      URLSearchParams;
      var l9 = e.i(16852), l7 = e.i(75982);
      let ce = e.r(91375).actionAsyncStorage;
      function ct(e10, t10) {
        throw function(e11, t11, r10 = l9.RedirectStatusCode.TemporaryRedirect) {
          let n10 = Object.defineProperty(Error(l7.REDIRECT_ERROR_CODE), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          return n10.digest = `${l7.REDIRECT_ERROR_CODE};${t11};${e11};${r10};`, n10;
        }(e10, t10 ??= ce?.getStore()?.isAction ? "push" : "replace", l9.RedirectStatusCode.TemporaryRedirect);
      }
      async function cr(e10, t10 = {}, r10, n10) {
        let i10 = new Headers(await l0()), { redirect: a10 = true, redirectTo: s10, ...o10 } = t10 instanceof FormData ? Object.fromEntries(t10) : t10, l10 = s10?.toString() ?? i10.get("Referer") ?? "/", c10 = lL("signin", i10.get("x-forwarded-proto"), i10, process.env, n10);
        if (!e10) return c10.searchParams.append("callbackUrl", l10), a10 && ct(c10.toString()), c10.toString();
        let u10 = `${c10}/${e10}?${new URLSearchParams(r10)}`, h10 = {};
        for (let t11 of n10.providers) {
          let { options: r11, ...n11 } = "function" == typeof t11 ? t11() : t11, i11 = r11?.id ?? n11.id;
          if (i11 === e10) {
            h10 = { id: i11, type: r11?.type ?? n11.type };
            break;
          }
        }
        if (!h10.id) {
          let e11 = `${c10}?${new URLSearchParams({ callbackUrl: l10 })}`;
          return a10 && ct(e11), e11;
        }
        "credentials" === h10.type && (u10 = u10.replace("signin", "callback")), i10.set("Content-Type", "application/x-www-form-urlencoded");
        let d2 = new Request(u10, { method: "POST", headers: i10, body: new URLSearchParams({ ...o10, callbackUrl: l10 }) }), p2 = await lM(d2, { ...n10, raw: an, skipCSRFCheck: ar }), f2 = await lY();
        for (let e11 of p2?.cookies ?? []) f2.set(e11.name, e11.value, e11.options);
        let g2 = (p2 instanceof Response ? p2.headers.get("Location") : p2.redirect) ?? u10;
        return a10 ? ct(g2) : g2;
      }
      async function cn(e10, t10) {
        let r10 = new Headers(await l0());
        r10.set("Content-Type", "application/x-www-form-urlencoded");
        let n10 = lL("signout", r10.get("x-forwarded-proto"), r10, process.env, t10), i10 = new URLSearchParams({ callbackUrl: e10?.redirectTo ?? r10.get("Referer") ?? "/" }), a10 = new Request(n10, { method: "POST", headers: r10, body: i10 }), s10 = await lM(a10, { ...t10, raw: an, skipCSRFCheck: ar }), o10 = await lY();
        for (let e11 of s10?.cookies ?? []) o10.set(e11.name, e11.value, e11.options);
        return e10?.redirect ?? true ? ct(s10.redirect) : s10;
      }
      async function ci(e10, t10) {
        let r10 = new Headers(await l0());
        r10.set("Content-Type", "application/json");
        let n10 = new Request(lL("session", r10.get("x-forwarded-proto"), r10, process.env, t10), { method: "POST", headers: r10, body: JSON.stringify({ data: e10 }) }), i10 = await lM(n10, { ...t10, raw: an, skipCSRFCheck: ar }), a10 = await lY();
        for (let e11 of i10?.cookies ?? []) a10.set(e11.name, e11.value, e11.options);
        return i10.body;
      }
      e.r(82748).unstable_rethrow;
      class ca extends Error {
        constructor(e10, t10 = "FunctionsError", r10) {
          super(e10), this.name = t10, this.context = r10;
        }
        toJSON() {
          return { name: this.name, message: this.message, context: this.context };
        }
      }
      class cs extends ca {
        constructor(e10) {
          super("Failed to send a request to the Edge Function", "FunctionsFetchError", e10);
        }
      }
      class co extends ca {
        constructor(e10) {
          super("Relay Error invoking the Edge Function", "FunctionsRelayError", e10);
        }
      }
      class cl extends ca {
        constructor(e10) {
          super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e10);
        }
      }
      (z = Q || (Q = {})).Any = "any", z.ApNortheast1 = "ap-northeast-1", z.ApNortheast2 = "ap-northeast-2", z.ApSouth1 = "ap-south-1", z.ApSoutheast1 = "ap-southeast-1", z.ApSoutheast2 = "ap-southeast-2", z.CaCentral1 = "ca-central-1", z.EuCentral1 = "eu-central-1", z.EuWest1 = "eu-west-1", z.EuWest2 = "eu-west-2", z.EuWest3 = "eu-west-3", z.SaEast1 = "sa-east-1", z.UsEast1 = "us-east-1", z.UsWest1 = "us-west-1", z.UsWest2 = "us-west-2";
      function cc(e10, t10) {
        var r10 = {};
        for (var n10 in e10) Object.prototype.hasOwnProperty.call(e10, n10) && 0 > t10.indexOf(n10) && (r10[n10] = e10[n10]);
        if (null != e10 && "function" == typeof Object.getOwnPropertySymbols) for (var i10 = 0, n10 = Object.getOwnPropertySymbols(e10); i10 < n10.length; i10++) 0 > t10.indexOf(n10[i10]) && Object.prototype.propertyIsEnumerable.call(e10, n10[i10]) && (r10[n10[i10]] = e10[n10[i10]]);
        return r10;
      }
      "function" == typeof SuppressedError && SuppressedError;
      class cu {
        constructor(e10, { headers: t10 = {}, customFetch: r10, region: n10 = Q.Any } = {}) {
          this.url = e10, this.headers = t10, this.region = n10, this.fetch = /* @__PURE__ */ ((e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12))(r10);
        }
        setAuth(e10) {
          this.headers.Authorization = `Bearer ${e10}`;
        }
        invoke(e10) {
          var t10, r10, n10, i10;
          return t10 = this, r10 = arguments, n10 = void 0, i10 = function* (e11, t11 = {}) {
            var r11;
            let n11, i11;
            try {
              let a10, { headers: s10, method: o10, body: l10, signal: c10, timeout: u10 } = t11, h10 = {}, { region: d2 } = t11;
              d2 || (d2 = this.region);
              let p2 = new URL(`${this.url}/${e11}`);
              d2 && "any" !== d2 && (h10["x-region"] = d2, p2.searchParams.set("forceFunctionRegion", d2)), l10 && (s10 && !Object.prototype.hasOwnProperty.call(s10, "Content-Type") || !s10) ? "u" > typeof Blob && l10 instanceof Blob || l10 instanceof ArrayBuffer ? (h10["Content-Type"] = "application/octet-stream", a10 = l10) : "string" == typeof l10 ? (h10["Content-Type"] = "text/plain", a10 = l10) : "u" > typeof FormData && l10 instanceof FormData ? a10 = l10 : (h10["Content-Type"] = "application/json", a10 = JSON.stringify(l10)) : a10 = !l10 || "string" == typeof l10 || "u" > typeof Blob && l10 instanceof Blob || l10 instanceof ArrayBuffer || "u" > typeof FormData && l10 instanceof FormData ? l10 : JSON.stringify(l10);
              let f2 = c10;
              u10 && (i11 = new AbortController(), n11 = setTimeout(() => i11.abort(), u10), c10 ? (f2 = i11.signal, c10.addEventListener("abort", () => i11.abort())) : f2 = i11.signal);
              let g2 = yield this.fetch(p2.toString(), { method: o10 || "POST", headers: Object.assign(Object.assign(Object.assign({}, h10), this.headers), s10), body: a10, signal: f2 }).catch((e12) => {
                throw new cs(e12);
              }), m2 = g2.headers.get("x-relay-error");
              if (m2 && "true" === m2) throw new co(g2);
              if (!g2.ok) throw new cl(g2);
              let y2 = (null != (r11 = g2.headers.get("Content-Type")) ? r11 : "text/plain").split(";")[0].trim();
              return { data: "application/json" === y2 ? yield g2.json() : "application/octet-stream" === y2 || "application/pdf" === y2 ? yield g2.blob() : "text/event-stream" === y2 ? g2 : "multipart/form-data" === y2 ? yield g2.formData() : yield g2.text(), error: null, response: g2 };
            } catch (e12) {
              return { data: null, error: e12, response: e12 instanceof cl || e12 instanceof co ? e12.context : void 0 };
            } finally {
              n11 && clearTimeout(n11);
            }
          }, new (n10 || (n10 = Promise))(function(e11, a10) {
            function s10(e12) {
              try {
                l10(i10.next(e12));
              } catch (e13) {
                a10(e13);
              }
            }
            function o10(e12) {
              try {
                l10(i10.throw(e12));
              } catch (e13) {
                a10(e13);
              }
            }
            function l10(t11) {
              var r11;
              t11.done ? e11(t11.value) : ((r11 = t11.value) instanceof n10 ? r11 : new n10(function(e12) {
                e12(r11);
              })).then(s10, o10);
            }
            l10((i10 = i10.apply(t10, r10 || [])).next());
          });
        }
      }
      let ch = (e10) => Math.min(1e3 * 2 ** e10, 3e4), cd = [520, 503], cp = ["GET", "HEAD", "OPTIONS"];
      var cf = class extends Error {
        constructor(e10) {
          super(e10.message), this.name = "PostgrestError", this.details = e10.details, this.hint = e10.hint, this.code = e10.code;
        }
        toJSON() {
          return { name: this.name, message: this.message, details: this.details, hint: this.hint, code: this.code };
        }
      };
      function cg(e10, t10) {
        return new Promise((r10) => {
          if (null == t10 ? void 0 : t10.aborted) return void r10();
          let n10 = setTimeout(() => {
            null == t10 || t10.removeEventListener("abort", i10), r10();
          }, e10);
          function i10() {
            clearTimeout(n10), r10();
          }
          null == t10 || t10.addEventListener("abort", i10);
        });
      }
      var cm = class {
        constructor(e10) {
          var t10, r10, n10, i10, a10;
          this.shouldThrowOnError = false, this.retryEnabled = true, this.method = e10.method, this.url = e10.url, this.headers = new Headers(e10.headers), this.schema = e10.schema, this.body = e10.body, this.shouldThrowOnError = null != (t10 = e10.shouldThrowOnError) && t10, this.signal = e10.signal, this.isMaybeSingle = null != (r10 = e10.isMaybeSingle) && r10, this.shouldStripNulls = null != (n10 = e10.shouldStripNulls) && n10, this.urlLengthLimit = null != (i10 = e10.urlLengthLimit) ? i10 : 8e3, this.retryEnabled = null == (a10 = e10.retry) || a10, e10.fetch ? this.fetch = e10.fetch : this.fetch = fetch;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        stripNulls() {
          if ("text/csv" === this.headers.get("Accept")) throw Error("stripNulls() cannot be used with csv()");
          return this.shouldStripNulls = true, this;
        }
        setHeader(e10, t10) {
          return this.headers = new Headers(this.headers), this.headers.set(e10, t10), this;
        }
        retry(e10) {
          return this.retryEnabled = e10, this;
        }
        then(e10, t10) {
          var r10 = this;
          if (void 0 === this.schema || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), "GET" !== this.method && "HEAD" !== this.method && this.headers.set("Content-Type", "application/json"), this.shouldStripNulls) {
            let e11 = this.headers.get("Accept");
            "application/vnd.pgrst.object+json" === e11 ? this.headers.set("Accept", "application/vnd.pgrst.object+json;nulls=stripped") : e11 && "application/json" !== e11 || this.headers.set("Accept", "application/vnd.pgrst.array+json;nulls=stripped");
          }
          let n10 = this.fetch, i10 = (async () => {
            let e11 = 0;
            for (; ; ) {
              var t11, i11, a10, s10, o10;
              let l10, c10 = {};
              r10.headers.forEach((e12, t12) => {
                c10[t12] = e12;
              }), e11 > 0 && (c10["X-Retry-Count"] = String(e11));
              try {
                l10 = await n10(r10.url.toString(), { method: r10.method, headers: c10, body: JSON.stringify(r10.body, (e12, t12) => "bigint" == typeof t12 ? t12.toString() : t12), signal: r10.signal });
              } catch (t12) {
                if ((null == t12 ? void 0 : t12.name) === "AbortError" || (null == t12 ? void 0 : t12.code) === "ABORT_ERR" || !cp.includes(r10.method)) throw t12;
                if (r10.retryEnabled && e11 < 3) {
                  let t13 = ch(e11);
                  e11++, await cg(t13, r10.signal);
                  continue;
                }
                throw t12;
              }
              if (t11 = r10.method, i11 = l10.status, a10 = e11, r10.retryEnabled && !(a10 >= 3) && cp.includes(t11) && cd.includes(i11) && 1) {
                let t12 = null != (s10 = null == (o10 = l10.headers) ? void 0 : o10.get("Retry-After")) ? s10 : null, n11 = null !== t12 ? 1e3 * Math.max(0, parseInt(t12, 10) || 0) : ch(e11);
                await l10.text(), e11++, await cg(n11, r10.signal);
                continue;
              }
              return await r10.processResponse(l10);
            }
          })();
          return this.shouldThrowOnError || (i10 = i10.catch((e11) => {
            var t11, r11, n11, i11, a10, s10;
            let o10 = "", l10 = "", c10 = "", u10 = null == e11 ? void 0 : e11.cause;
            if (u10) {
              let t12 = null != (r11 = null == u10 ? void 0 : u10.message) ? r11 : "", s11 = null != (n11 = null == u10 ? void 0 : u10.code) ? n11 : "";
              o10 = `${null != (i11 = null == e11 ? void 0 : e11.name) ? i11 : "FetchError"}: ${null == e11 ? void 0 : e11.message}

Caused by: ${null != (a10 = null == u10 ? void 0 : u10.name) ? a10 : "Error"}: ${t12}`, s11 && (o10 += ` (${s11})`), (null == u10 ? void 0 : u10.stack) && (o10 += `
${u10.stack}`);
            } else o10 = null != (s10 = null == e11 ? void 0 : e11.stack) ? s10 : "";
            let h10 = this.url.toString().length;
            return (null == e11 ? void 0 : e11.name) === "AbortError" || (null == e11 ? void 0 : e11.code) === "ABORT_ERR" ? (c10 = "", l10 = "Request was aborted (timeout or manual cancellation)", h10 > this.urlLengthLimit && (l10 += `. Note: Your request URL is ${h10} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)) : ((null == u10 ? void 0 : u10.name) === "HeadersOverflowError" || (null == u10 ? void 0 : u10.code) === "UND_ERR_HEADERS_OVERFLOW") && (c10 = "", l10 = "HTTP headers exceeded server limits (typically 16KB)", h10 > this.urlLengthLimit && (l10 += `. Your request URL is ${h10} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)), { success: false, error: { message: `${null != (t11 = null == e11 ? void 0 : e11.name) ? t11 : "FetchError"}: ${null == e11 ? void 0 : e11.message}`, details: o10, hint: l10, code: c10 }, data: null, count: null, status: 0, statusText: "" };
          })), i10.then(e10, t10);
        }
        async processResponse(e10) {
          var t10, r10, n10;
          let i10 = null, a10 = null, s10 = null, o10 = e10.status, l10 = e10.statusText;
          if (e10.ok) {
            if ("HEAD" !== this.method) {
              let t11 = await e10.text();
              if ("" === t11) ;
              else if ("text/csv" === this.headers.get("Accept")) a10 = t11;
              else if (this.headers.get("Accept") && (null == (n10 = this.headers.get("Accept")) ? void 0 : n10.includes("application/vnd.pgrst.plan+text"))) a10 = t11;
              else try {
                a10 = JSON.parse(t11);
              } catch (e11) {
                if (i10 = { message: t11 }, a10 = null, this.shouldThrowOnError) throw new cf({ message: t11, details: "", hint: "", code: "" });
              }
            }
            let c10 = null == (t10 = this.headers.get("Prefer")) ? void 0 : t10.match(/count=(exact|planned|estimated)/), u10 = null == (r10 = e10.headers.get("content-range")) ? void 0 : r10.split("/");
            c10 && u10 && u10.length > 1 && (s10 = parseInt(u10[1])), this.isMaybeSingle && Array.isArray(a10) && (a10.length > 1 ? (i10 = { code: "PGRST116", details: `Results contain ${a10.length} rows, application/vnd.pgrst.object+json requires 1 row`, hint: null, message: "JSON object requested, multiple (or no) rows returned" }, a10 = null, s10 = null, o10 = 406, l10 = "Not Acceptable") : a10 = 1 === a10.length ? a10[0] : null);
          } else {
            let t11 = await e10.text();
            try {
              i10 = JSON.parse(t11), Array.isArray(i10) && 404 === e10.status && (a10 = [], i10 = null, o10 = 200, l10 = "OK");
            } catch (r11) {
              404 === e10.status && "" === t11 ? (o10 = 204, l10 = "No Content") : i10 = { message: t11 };
            }
            if (i10 && this.shouldThrowOnError) throw new cf(i10);
          }
          return { success: null === i10, error: i10, data: a10, count: s10, status: o10, statusText: l10 };
        }
        returns() {
          return this;
        }
        overrideTypes() {
          return this;
        }
      }, cy = class extends cm {
        throwOnError() {
          return super.throwOnError();
        }
        select(e10) {
          let t10 = false, r10 = (null != e10 ? e10 : "*").split("").map((e11) => /\s/.test(e11) && !t10 ? "" : ('"' === e11 && (t10 = !t10), e11)).join("");
          return this.url.searchParams.set("select", r10), this.headers.append("Prefer", "return=representation"), this;
        }
        order(e10, { ascending: t10 = true, nullsFirst: r10, foreignTable: n10, referencedTable: i10 = n10 } = {}) {
          let a10 = i10 ? `${i10}.order` : "order", s10 = this.url.searchParams.get(a10);
          return this.url.searchParams.set(a10, `${s10 ? `${s10},` : ""}${e10}.${t10 ? "asc" : "desc"}${void 0 === r10 ? "" : r10 ? ".nullsfirst" : ".nullslast"}`), this;
        }
        limit(e10, { foreignTable: t10, referencedTable: r10 = t10 } = {}) {
          let n10 = void 0 === r10 ? "limit" : `${r10}.limit`;
          return this.url.searchParams.set(n10, `${e10}`), this;
        }
        range(e10, t10, { foreignTable: r10, referencedTable: n10 = r10 } = {}) {
          let i10 = void 0 === n10 ? "offset" : `${n10}.offset`, a10 = void 0 === n10 ? "limit" : `${n10}.limit`;
          return this.url.searchParams.set(i10, `${e10}`), this.url.searchParams.set(a10, `${t10 - e10 + 1}`), this;
        }
        abortSignal(e10) {
          return this.signal = e10, this;
        }
        single() {
          return this.headers.set("Accept", "application/vnd.pgrst.object+json"), this;
        }
        maybeSingle() {
          return this.isMaybeSingle = true, this;
        }
        csv() {
          return this.headers.set("Accept", "text/csv"), this;
        }
        geojson() {
          return this.headers.set("Accept", "application/geo+json"), this;
        }
        explain({ analyze: e10 = false, verbose: t10 = false, settings: r10 = false, buffers: n10 = false, wal: i10 = false, format: a10 = "text" } = {}) {
          var s10;
          let o10 = [e10 ? "analyze" : null, t10 ? "verbose" : null, r10 ? "settings" : null, n10 ? "buffers" : null, i10 ? "wal" : null].filter(Boolean).join("|"), l10 = null != (s10 = this.headers.get("Accept")) ? s10 : "application/json";
          return this.headers.set("Accept", `application/vnd.pgrst.plan+${a10}; for="${l10}"; options=${o10};`), this;
        }
        rollback() {
          return this.headers.append("Prefer", "tx=rollback"), this;
        }
        returns() {
          return this;
        }
        maxAffected(e10) {
          return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${e10}`), this;
        }
      };
      let cb = RegExp("[,()]");
      var cw = class extends cy {
        throwOnError() {
          return super.throwOnError();
        }
        eq(e10, t10) {
          return this.url.searchParams.append(e10, `eq.${t10}`), this;
        }
        neq(e10, t10) {
          return this.url.searchParams.append(e10, `neq.${t10}`), this;
        }
        gt(e10, t10) {
          return this.url.searchParams.append(e10, `gt.${t10}`), this;
        }
        gte(e10, t10) {
          return this.url.searchParams.append(e10, `gte.${t10}`), this;
        }
        lt(e10, t10) {
          return this.url.searchParams.append(e10, `lt.${t10}`), this;
        }
        lte(e10, t10) {
          return this.url.searchParams.append(e10, `lte.${t10}`), this;
        }
        like(e10, t10) {
          return this.url.searchParams.append(e10, `like.${t10}`), this;
        }
        likeAllOf(e10, t10) {
          return this.url.searchParams.append(e10, `like(all).{${t10.join(",")}}`), this;
        }
        likeAnyOf(e10, t10) {
          return this.url.searchParams.append(e10, `like(any).{${t10.join(",")}}`), this;
        }
        ilike(e10, t10) {
          return this.url.searchParams.append(e10, `ilike.${t10}`), this;
        }
        ilikeAllOf(e10, t10) {
          return this.url.searchParams.append(e10, `ilike(all).{${t10.join(",")}}`), this;
        }
        ilikeAnyOf(e10, t10) {
          return this.url.searchParams.append(e10, `ilike(any).{${t10.join(",")}}`), this;
        }
        regexMatch(e10, t10) {
          return this.url.searchParams.append(e10, `match.${t10}`), this;
        }
        regexIMatch(e10, t10) {
          return this.url.searchParams.append(e10, `imatch.${t10}`), this;
        }
        is(e10, t10) {
          return this.url.searchParams.append(e10, `is.${t10}`), this;
        }
        isDistinct(e10, t10) {
          return this.url.searchParams.append(e10, `isdistinct.${t10}`), this;
        }
        in(e10, t10) {
          let r10 = Array.from(new Set(t10)).map((e11) => "string" == typeof e11 && cb.test(e11) ? `"${e11}"` : `${e11}`).join(",");
          return this.url.searchParams.append(e10, `in.(${r10})`), this;
        }
        notIn(e10, t10) {
          let r10 = Array.from(new Set(t10)).map((e11) => "string" == typeof e11 && cb.test(e11) ? `"${e11}"` : `${e11}`).join(",");
          return this.url.searchParams.append(e10, `not.in.(${r10})`), this;
        }
        contains(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `cs.${t10}`) : Array.isArray(t10) ? this.url.searchParams.append(e10, `cs.{${t10.join(",")}}`) : this.url.searchParams.append(e10, `cs.${JSON.stringify(t10)}`), this;
        }
        containedBy(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `cd.${t10}`) : Array.isArray(t10) ? this.url.searchParams.append(e10, `cd.{${t10.join(",")}}`) : this.url.searchParams.append(e10, `cd.${JSON.stringify(t10)}`), this;
        }
        rangeGt(e10, t10) {
          return this.url.searchParams.append(e10, `sr.${t10}`), this;
        }
        rangeGte(e10, t10) {
          return this.url.searchParams.append(e10, `nxl.${t10}`), this;
        }
        rangeLt(e10, t10) {
          return this.url.searchParams.append(e10, `sl.${t10}`), this;
        }
        rangeLte(e10, t10) {
          return this.url.searchParams.append(e10, `nxr.${t10}`), this;
        }
        rangeAdjacent(e10, t10) {
          return this.url.searchParams.append(e10, `adj.${t10}`), this;
        }
        overlaps(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `ov.${t10}`) : this.url.searchParams.append(e10, `ov.{${t10.join(",")}}`), this;
        }
        textSearch(e10, t10, { config: r10, type: n10 } = {}) {
          let i10 = "";
          "plain" === n10 ? i10 = "pl" : "phrase" === n10 ? i10 = "ph" : "websearch" === n10 && (i10 = "w");
          let a10 = void 0 === r10 ? "" : `(${r10})`;
          return this.url.searchParams.append(e10, `${i10}fts${a10}.${t10}`), this;
        }
        match(e10) {
          return Object.entries(e10).filter(([e11, t10]) => void 0 !== t10).forEach(([e11, t10]) => {
            this.url.searchParams.append(e11, `eq.${t10}`);
          }), this;
        }
        not(e10, t10, r10) {
          return this.url.searchParams.append(e10, `not.${t10}.${r10}`), this;
        }
        or(e10, { foreignTable: t10, referencedTable: r10 = t10 } = {}) {
          let n10 = r10 ? `${r10}.or` : "or";
          return this.url.searchParams.append(n10, `(${e10})`), this;
        }
        filter(e10, t10, r10) {
          return this.url.searchParams.append(e10, `${t10}.${r10}`), this;
        }
      }, cv = class {
        constructor(e10, { headers: t10 = {}, schema: r10, fetch: n10, urlLengthLimit: i10 = 8e3, retry: a10 }) {
          this.url = e10, this.headers = new Headers(t10), this.schema = r10, this.fetch = n10, this.urlLengthLimit = i10, this.retry = a10;
        }
        cloneRequestState() {
          return { url: new URL(this.url.toString()), headers: new Headers(this.headers) };
        }
        select(e10, t10) {
          let { head: r10 = false, count: n10 } = null != t10 ? t10 : {}, i10 = false, a10 = (null != e10 ? e10 : "*").split("").map((e11) => /\s/.test(e11) && !i10 ? "" : ('"' === e11 && (i10 = !i10), e11)).join(""), { url: s10, headers: o10 } = this.cloneRequestState();
          return s10.searchParams.set("select", a10), n10 && o10.append("Prefer", `count=${n10}`), new cw({ method: r10 ? "HEAD" : "GET", url: s10, headers: o10, schema: this.schema, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        insert(e10, { count: t10, defaultToNull: r10 = true } = {}) {
          var n10;
          let { url: i10, headers: a10 } = this.cloneRequestState();
          if (t10 && a10.append("Prefer", `count=${t10}`), r10 || a10.append("Prefer", "missing=default"), Array.isArray(e10)) {
            let t11 = e10.reduce((e11, t12) => e11.concat(Object.keys(t12)), []);
            if (t11.length > 0) {
              let e11 = [...new Set(t11)].map((e12) => `"${e12}"`);
              i10.searchParams.set("columns", e11.join(","));
            }
          }
          return new cw({ method: "POST", url: i10, headers: a10, schema: this.schema, body: e10, fetch: null != (n10 = this.fetch) ? n10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        upsert(e10, { onConflict: t10, ignoreDuplicates: r10 = false, count: n10, defaultToNull: i10 = true } = {}) {
          var a10;
          let { url: s10, headers: o10 } = this.cloneRequestState();
          if (o10.append("Prefer", `resolution=${r10 ? "ignore" : "merge"}-duplicates`), void 0 !== t10 && s10.searchParams.set("on_conflict", t10), n10 && o10.append("Prefer", `count=${n10}`), i10 || o10.append("Prefer", "missing=default"), Array.isArray(e10)) {
            let t11 = e10.reduce((e11, t12) => e11.concat(Object.keys(t12)), []);
            if (t11.length > 0) {
              let e11 = [...new Set(t11)].map((e12) => `"${e12}"`);
              s10.searchParams.set("columns", e11.join(","));
            }
          }
          return new cw({ method: "POST", url: s10, headers: o10, schema: this.schema, body: e10, fetch: null != (a10 = this.fetch) ? a10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        update(e10, { count: t10 } = {}) {
          var r10;
          let { url: n10, headers: i10 } = this.cloneRequestState();
          return t10 && i10.append("Prefer", `count=${t10}`), new cw({ method: "PATCH", url: n10, headers: i10, schema: this.schema, body: e10, fetch: null != (r10 = this.fetch) ? r10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        delete({ count: e10 } = {}) {
          var t10;
          let { url: r10, headers: n10 } = this.cloneRequestState();
          return e10 && n10.append("Prefer", `count=${e10}`), new cw({ method: "DELETE", url: r10, headers: n10, schema: this.schema, fetch: null != (t10 = this.fetch) ? t10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
      };
      function c_(e10) {
        return (c_ = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function cx(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var n10 = Object.getOwnPropertySymbols(e10);
          t10 && (n10 = n10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, n10);
        }
        return r10;
      }
      function cE(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? cx(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var n10;
              (n10 = function(e12, t13) {
                if ("object" != c_(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var n11 = r12.call(e12, t13 || "default");
                  if ("object" != c_(n11)) return n11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == c_(n10) ? n10 : n10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : cx(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      var ck = class e10 {
        constructor(e11, { headers: t10 = {}, schema: r10, fetch: n10, timeout: i10, urlLengthLimit: a10 = 8e3, retry: s10 } = {}) {
          this.url = e11, this.headers = new Headers(t10), this.schemaName = r10, this.urlLengthLimit = a10;
          const o10 = null != n10 ? n10 : globalThis.fetch;
          void 0 !== i10 && i10 > 0 ? this.fetch = (e12, t11) => {
            let r11 = new AbortController(), n11 = setTimeout(() => r11.abort(), i10), a11 = null == t11 ? void 0 : t11.signal;
            if (a11) {
              if (a11.aborted) return clearTimeout(n11), o10(e12, t11);
              let i11 = () => {
                clearTimeout(n11), r11.abort();
              };
              return a11.addEventListener("abort", i11, { once: true }), o10(e12, cE(cE({}, t11), {}, { signal: r11.signal })).finally(() => {
                clearTimeout(n11), a11.removeEventListener("abort", i11);
              });
            }
            return o10(e12, cE(cE({}, t11), {}, { signal: r11.signal })).finally(() => clearTimeout(n11));
          } : this.fetch = o10, this.retry = s10;
        }
        from(e11) {
          if (!e11 || "string" != typeof e11 || "" === e11.trim()) throw Error("Invalid relation name: relation must be a non-empty string.");
          return new cv(new URL(`${this.url}/${e11}`), { headers: new Headers(this.headers), schema: this.schemaName, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        schema(t10) {
          return new e10(this.url, { headers: this.headers, schema: t10, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        rpc(e11, t10 = {}, { head: r10 = false, get: n10 = false, count: i10 } = {}) {
          var a10;
          let s10, o10, l10 = new URL(`${this.url}/rpc/${e11}`), c10 = (e12) => null !== e12 && "object" == typeof e12 && (!Array.isArray(e12) || e12.some(c10)), u10 = r10 && Object.values(t10).some(c10);
          u10 ? (s10 = "POST", o10 = t10) : r10 || n10 ? (s10 = r10 ? "HEAD" : "GET", Object.entries(t10).filter(([e12, t11]) => void 0 !== t11).map(([e12, t11]) => [e12, Array.isArray(t11) ? `{${t11.join(",")}}` : `${t11}`]).forEach(([e12, t11]) => {
            l10.searchParams.append(e12, t11);
          })) : (s10 = "POST", o10 = t10);
          let h10 = new Headers(this.headers);
          return u10 ? h10.set("Prefer", i10 ? `count=${i10},return=minimal` : "return=minimal") : i10 && h10.set("Prefer", `count=${i10}`), new cw({ method: s10, url: l10, headers: h10, schema: this.schemaName, body: o10, fetch: null != (a10 = this.fetch) ? a10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
      };
      let cS = class {
        static detectEnvironment() {
          var t10;
          if ("u" > typeof WebSocket) return { type: "native", wsConstructor: WebSocket };
          let r10 = globalThis;
          if ("u" > typeof globalThis && void 0 !== r10.WebSocket) return { type: "native", wsConstructor: r10.WebSocket };
          let n10 = e.g;
          if (n10 && void 0 !== n10.WebSocket) return { type: "native", wsConstructor: n10.WebSocket };
          if ("u" > typeof globalThis && void 0 !== r10.WebSocketPair && void 0 === globalThis.WebSocket) return { type: "cloudflare", error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.", workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime." };
          if ("u" > typeof globalThis && r10.EdgeRuntime || "u" > typeof navigator && (null == (t10 = navigator.userAgent) ? void 0 : t10.includes("Vercel-Edge"))) return { type: "unsupported", error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.", workaround: "Use serverless functions or a different deployment target for WebSocket functionality." };
          let i10 = globalThis.process;
          if (i10) {
            let e10 = i10.versions;
            if (e10 && e10.node) {
              let t11 = parseInt(e10.node.replace(/^v/, "").split(".")[0]);
              return t11 >= 22 ? void 0 !== globalThis.WebSocket ? { type: "native", wsConstructor: globalThis.WebSocket } : { type: "unsupported", error: `Node.js ${t11} detected but native WebSocket not found.`, workaround: "Provide a WebSocket implementation via the transport option." } : { type: "unsupported", error: `Node.js ${t11} detected without native WebSocket support.`, workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })' };
            }
          }
          return { type: "unsupported", error: "Unknown JavaScript runtime without WebSocket support.", workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation." };
        }
        static getWebSocketConstructor() {
          let e10 = this.detectEnvironment();
          if (e10.wsConstructor) return e10.wsConstructor;
          let t10 = e10.error || "WebSocket not supported in this environment.";
          throw e10.workaround && (t10 += `

Suggested solution: ${e10.workaround}`), Error(t10);
        }
        static isWebSocketSupported() {
          try {
            let e10 = this.detectEnvironment();
            return "native" === e10.type || "ws" === e10.type;
          } catch (e10) {
            return false;
          }
        }
      }, cT = "2.0.0", cA = "errored", cR = "joined", cC = { close: "phx_close", error: "phx_error", join: "phx_join", reply: "phx_reply", leave: "phx_leave", access_token: "access_token" };
      class cO {
        constructor(e10) {
          this.HEADER_LENGTH = 1, this.USER_BROADCAST_PUSH_META_LENGTH = 6, this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 }, this.BINARY_ENCODING = 0, this.JSON_ENCODING = 1, this.BROADCAST_EVENT = "broadcast", this.allowedMetadataKeys = [], this.allowedMetadataKeys = null != e10 ? e10 : [];
        }
        encode(e10, t10) {
          return e10.event !== this.BROADCAST_EVENT || e10.payload instanceof ArrayBuffer || "string" != typeof e10.payload.event ? t10(JSON.stringify([e10.join_ref, e10.ref, e10.topic, e10.event, e10.payload])) : t10(this._binaryEncodeUserBroadcastPush(e10));
        }
        _binaryEncodeUserBroadcastPush(e10) {
          var t10;
          return this._isArrayBuffer(null == (t10 = e10.payload) ? void 0 : t10.payload) ? this._encodeBinaryUserBroadcastPush(e10) : this._encodeJsonUserBroadcastPush(e10);
        }
        _encodeBinaryUserBroadcastPush(e10) {
          var t10, r10;
          let n10 = null != (r10 = null == (t10 = e10.payload) ? void 0 : t10.payload) ? r10 : new ArrayBuffer(0);
          return this._encodeUserBroadcastPush(e10, this.BINARY_ENCODING, n10);
        }
        _encodeJsonUserBroadcastPush(e10) {
          var t10, r10;
          let n10 = null != (r10 = null == (t10 = e10.payload) ? void 0 : t10.payload) ? r10 : {}, i10 = new TextEncoder().encode(JSON.stringify(n10)).buffer;
          return this._encodeUserBroadcastPush(e10, this.JSON_ENCODING, i10);
        }
        _encodeUserBroadcastPush(e10, t10, r10) {
          let n10 = e10.topic, i10 = null != (p2 = e10.ref) ? p2 : "", a10 = null != (f2 = e10.join_ref) ? f2 : "", s10 = e10.payload.event, o10 = this.allowedMetadataKeys ? this._pick(e10.payload, this.allowedMetadataKeys) : {}, l10 = 0 === Object.keys(o10).length ? "" : JSON.stringify(o10);
          if (a10.length > 255) throw Error(`joinRef length ${a10.length} exceeds maximum of 255`);
          if (i10.length > 255) throw Error(`ref length ${i10.length} exceeds maximum of 255`);
          if (n10.length > 255) throw Error(`topic length ${n10.length} exceeds maximum of 255`);
          if (s10.length > 255) throw Error(`userEvent length ${s10.length} exceeds maximum of 255`);
          if (l10.length > 255) throw Error(`metadata length ${l10.length} exceeds maximum of 255`);
          let c10 = this.USER_BROADCAST_PUSH_META_LENGTH + a10.length + i10.length + n10.length + s10.length + l10.length, u10 = new ArrayBuffer(this.HEADER_LENGTH + c10), h10 = new DataView(u10), d2 = 0;
          h10.setUint8(d2++, this.KINDS.userBroadcastPush), h10.setUint8(d2++, a10.length), h10.setUint8(d2++, i10.length), h10.setUint8(d2++, n10.length), h10.setUint8(d2++, s10.length), h10.setUint8(d2++, l10.length), h10.setUint8(d2++, t10), Array.from(a10, (e11) => h10.setUint8(d2++, e11.charCodeAt(0))), Array.from(i10, (e11) => h10.setUint8(d2++, e11.charCodeAt(0))), Array.from(n10, (e11) => h10.setUint8(d2++, e11.charCodeAt(0))), Array.from(s10, (e11) => h10.setUint8(d2++, e11.charCodeAt(0))), Array.from(l10, (e11) => h10.setUint8(d2++, e11.charCodeAt(0)));
          var p2, f2, g2 = new Uint8Array(u10.byteLength + r10.byteLength);
          return g2.set(new Uint8Array(u10), 0), g2.set(new Uint8Array(r10), u10.byteLength), g2.buffer;
        }
        decode(e10, t10) {
          if (this._isArrayBuffer(e10)) return t10(this._binaryDecode(e10));
          if ("string" == typeof e10) {
            let [r10, n10, i10, a10, s10] = JSON.parse(e10);
            return t10({ join_ref: r10, ref: n10, topic: i10, event: a10, payload: s10 });
          }
          return t10({});
        }
        _binaryDecode(e10) {
          let t10 = new DataView(e10), r10 = t10.getUint8(0), n10 = new TextDecoder();
          if (r10 === this.KINDS.userBroadcast) return this._decodeUserBroadcast(e10, t10, n10);
        }
        _decodeUserBroadcast(e10, t10, r10) {
          let n10 = t10.getUint8(1), i10 = t10.getUint8(2), a10 = t10.getUint8(3), s10 = t10.getUint8(4), o10 = this.HEADER_LENGTH + 4, l10 = r10.decode(e10.slice(o10, o10 + n10));
          o10 += n10;
          let c10 = r10.decode(e10.slice(o10, o10 + i10));
          o10 += i10;
          let u10 = r10.decode(e10.slice(o10, o10 + a10));
          o10 += a10;
          let h10 = e10.slice(o10, e10.byteLength), d2 = s10 === this.JSON_ENCODING ? JSON.parse(r10.decode(h10)) : h10, p2 = { type: this.BROADCAST_EVENT, event: c10, payload: d2 };
          return a10 > 0 && (p2.meta = JSON.parse(u10)), { join_ref: null, ref: null, topic: l10, event: this.BROADCAST_EVENT, payload: p2 };
        }
        _isArrayBuffer(e10) {
          var t10;
          return e10 instanceof ArrayBuffer || (null == (t10 = null == e10 ? void 0 : e10.constructor) ? void 0 : t10.name) === "ArrayBuffer";
        }
        _pick(e10, t10) {
          return e10 && "object" == typeof e10 ? Object.fromEntries(Object.entries(e10).filter(([e11]) => t10.includes(e11))) : {};
        }
      }
      (V = ee || (ee = {})).abstime = "abstime", V.bool = "bool", V.date = "date", V.daterange = "daterange", V.float4 = "float4", V.float8 = "float8", V.int2 = "int2", V.int4 = "int4", V.int4range = "int4range", V.int8 = "int8", V.int8range = "int8range", V.json = "json", V.jsonb = "jsonb", V.money = "money", V.numeric = "numeric", V.oid = "oid", V.reltime = "reltime", V.text = "text", V.time = "time", V.timestamp = "timestamp", V.timestamptz = "timestamptz", V.timetz = "timetz", V.tsrange = "tsrange", V.tstzrange = "tstzrange";
      let cP = (e10, t10, r10 = {}) => {
        var n10;
        let i10 = null != (n10 = r10.skipTypes) ? n10 : [];
        return t10 ? Object.keys(t10).reduce((r11, n11) => (r11[n11] = cI(n11, e10, t10, i10), r11), {}) : {};
      }, cI = (e10, t10, r10, n10) => {
        let i10 = t10.find((t11) => t11.name === e10), a10 = null == i10 ? void 0 : i10.type, s10 = r10[e10];
        return a10 && !n10.includes(a10) ? cj(a10, s10) : c$(s10);
      }, cj = (e10, t10) => {
        if ("_" === e10.charAt(0)) return cL(t10, e10.slice(1, e10.length));
        switch (e10) {
          case ee.bool:
            return cN(t10);
          case ee.float4:
          case ee.float8:
          case ee.int2:
          case ee.int4:
          case ee.int8:
          case ee.numeric:
          case ee.oid:
            return cU(t10);
          case ee.json:
          case ee.jsonb:
            return cD(t10);
          case ee.timestamp:
            return cM(t10);
          case ee.abstime:
          case ee.date:
          case ee.daterange:
          case ee.int4range:
          case ee.int8range:
          case ee.money:
          case ee.reltime:
          case ee.text:
          case ee.time:
          case ee.timestamptz:
          case ee.timetz:
          case ee.tsrange:
          case ee.tstzrange:
          default:
            return c$(t10);
        }
      }, c$ = (e10) => e10, cN = (e10) => {
        switch (e10) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return e10;
        }
      }, cU = (e10) => {
        if ("string" == typeof e10) {
          let t10 = parseFloat(e10);
          if (!Number.isNaN(t10)) return t10;
        }
        return e10;
      }, cD = (e10) => {
        if ("string" == typeof e10) try {
          return JSON.parse(e10);
        } catch (e11) {
        }
        return e10;
      }, cL = (e10, t10) => {
        if ("string" != typeof e10) return e10;
        let r10 = e10.length - 1, n10 = e10[r10];
        if ("{" === e10[0] && "}" === n10) {
          let n11, i10 = e10.slice(1, r10);
          try {
            n11 = JSON.parse("[" + i10 + "]");
          } catch (e11) {
            n11 = i10 ? i10.split(",") : [];
          }
          return n11.map((e11) => cj(t10, e11));
        }
        return e10;
      }, cM = (e10) => "string" == typeof e10 ? e10.replace(" ", "T") : e10, cH = (e10) => {
        let t10 = new URL(e10);
        return t10.protocol = t10.protocol.replace(/^ws/i, "http"), t10.pathname = t10.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, ""), "" === t10.pathname || "/" === t10.pathname ? t10.pathname = "/api/broadcast" : t10.pathname = t10.pathname + "/api/broadcast", t10.href;
      };
      var cB = (e10) => "function" == typeof e10 ? e10 : function() {
        return e10;
      }, cW = ("u" > typeof self ? self : null) || globalThis, cq = "closed", cK = "errored", cJ = "joined", cF = "joining", cz = "leaving", cV = "phx_close", cG = "phx_error", cX = "phx_reply", cY = "phx_leave", cZ = "websocket", cQ = "base64url.bearer.phx.", c0 = class {
        constructor(e10, t10, r10, n10) {
          this.channel = e10, this.event = t10, this.payload = r10 || function() {
            return {};
          }, this.receivedResp = null, this.timeout = n10, this.timeoutTimer = null, this.recHooks = [], this.sent = false, this.ref = void 0;
        }
        resend(e10) {
          this.timeout = e10, this.reset(), this.send();
        }
        send() {
          this.hasReceived("timeout") || (this.startTimeout(), this.sent = true, this.channel.socket.push({ topic: this.channel.topic, event: this.event, payload: this.payload(), ref: this.ref, join_ref: this.channel.joinRef() }));
        }
        receive(e10, t10) {
          return this.hasReceived(e10) && t10(this.receivedResp.response), this.recHooks.push({ status: e10, callback: t10 }), this;
        }
        reset() {
          this.cancelRefEvent(), this.ref = null, this.refEvent = null, this.receivedResp = null, this.sent = false;
        }
        destroy() {
          this.cancelRefEvent(), this.cancelTimeout();
        }
        matchReceive({ status: e10, response: t10, _ref: r10 }) {
          this.recHooks.filter((t11) => t11.status === e10).forEach((e11) => e11.callback(t10));
        }
        cancelRefEvent() {
          this.refEvent && this.channel.off(this.refEvent);
        }
        cancelTimeout() {
          clearTimeout(this.timeoutTimer), this.timeoutTimer = null;
        }
        startTimeout() {
          this.timeoutTimer && this.cancelTimeout(), this.ref = this.channel.socket.makeRef(), this.refEvent = this.channel.replyEventName(this.ref), this.channel.on(this.refEvent, (e10) => {
            this.cancelRefEvent(), this.cancelTimeout(), this.receivedResp = e10, this.matchReceive(e10);
          }), this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout);
        }
        hasReceived(e10) {
          return this.receivedResp && this.receivedResp.status === e10;
        }
        trigger(e10, t10) {
          this.channel.trigger(this.refEvent, { status: e10, response: t10 });
        }
      }, c1 = class {
        constructor(e10, t10) {
          this.callback = e10, this.timerCalc = t10, this.timer = void 0, this.tries = 0;
        }
        reset() {
          this.tries = 0, clearTimeout(this.timer);
        }
        scheduleTimeout() {
          clearTimeout(this.timer), this.timer = setTimeout(() => {
            this.tries = this.tries + 1, this.callback();
          }, this.timerCalc(this.tries + 1));
        }
      }, c2 = class {
        constructor(e10, t10, r10) {
          this.state = cq, this.topic = e10, this.params = cB(t10 || {}), this.socket = r10, this.bindings = [], this.bindingRef = 0, this.timeout = this.socket.timeout, this.joinedOnce = false, this.joinPush = new c0(this, "phx_join", this.params, this.timeout), this.pushBuffer = [], this.stateChangeRefs = [], this.rejoinTimer = new c1(() => {
            this.socket.isConnected() && this.rejoin();
          }, this.socket.rejoinAfterMs), this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset())), this.stateChangeRefs.push(this.socket.onOpen(() => {
            this.rejoinTimer.reset(), this.isErrored() && this.rejoin();
          })), this.joinPush.receive("ok", () => {
            this.state = cJ, this.rejoinTimer.reset(), this.pushBuffer.forEach((e11) => e11.send()), this.pushBuffer = [];
          }), this.joinPush.receive("error", (e11) => {
            this.state = cK, this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, e11), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.onClose(() => {
            this.rejoinTimer.reset(), this.socket.hasLogger() && this.socket.log("channel", `close ${this.topic}`), this.state = cq, this.socket.remove(this);
          }), this.onError((e11) => {
            this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, e11), this.isJoining() && this.joinPush.reset(), this.state = cK, this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.joinPush.receive("timeout", () => {
            this.socket.hasLogger() && this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), new c0(this, cY, cB({}), this.timeout).send(), this.state = cK, this.joinPush.reset(), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.on(cX, (e11, t11) => {
            this.trigger(this.replyEventName(t11), e11);
          });
        }
        join(e10 = this.timeout) {
          if (!this.joinedOnce) return this.timeout = e10, this.joinedOnce = true, this.rejoin(), this.joinPush;
          throw Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
        }
        teardown() {
          this.pushBuffer.forEach((e10) => e10.destroy()), this.pushBuffer = [], this.rejoinTimer.reset(), this.joinPush.destroy(), this.state = cq, this.bindings = [];
        }
        onClose(e10) {
          this.on(cV, e10);
        }
        onError(e10) {
          return this.on(cG, (t10) => e10(t10));
        }
        on(e10, t10) {
          let r10 = this.bindingRef++;
          return this.bindings.push({ event: e10, ref: r10, callback: t10 }), r10;
        }
        off(e10, t10) {
          this.bindings = this.bindings.filter((r10) => r10.event !== e10 || void 0 !== t10 && t10 !== r10.ref);
        }
        canPush() {
          return this.socket.isConnected() && this.isJoined();
        }
        push(e10, t10, r10 = this.timeout) {
          if (t10 = t10 || {}, !this.joinedOnce) throw Error(`tried to push '${e10}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
          let n10 = new c0(this, e10, function() {
            return t10;
          }, r10);
          return this.canPush() ? n10.send() : (n10.startTimeout(), this.pushBuffer.push(n10)), n10;
        }
        leave(e10 = this.timeout) {
          this.rejoinTimer.reset(), this.joinPush.cancelTimeout(), this.state = cz;
          let t10 = () => {
            this.socket.hasLogger() && this.socket.log("channel", `leave ${this.topic}`), this.trigger(cV, "leave");
          }, r10 = new c0(this, cY, cB({}), e10);
          return r10.receive("ok", () => t10()).receive("timeout", () => t10()), r10.send(), this.canPush() || r10.trigger("ok", {}), r10;
        }
        onMessage(e10, t10, r10) {
          return t10;
        }
        filterBindings(e10, t10, r10) {
          return true;
        }
        isMember(e10, t10, r10, n10) {
          return this.topic === e10 && (!n10 || n10 === this.joinRef() || (this.socket.hasLogger() && this.socket.log("channel", "dropping outdated message", { topic: e10, event: t10, payload: r10, joinRef: n10 }), false));
        }
        joinRef() {
          return this.joinPush.ref;
        }
        rejoin(e10 = this.timeout) {
          this.isLeaving() || (this.socket.leaveOpenTopic(this.topic), this.state = cF, this.joinPush.resend(e10));
        }
        trigger(e10, t10, r10, n10) {
          let i10 = this.onMessage(e10, t10, r10, n10);
          if (t10 && !i10) throw Error("channel onMessage callbacks must return the payload, modified or unmodified");
          let a10 = this.bindings.filter((n11) => n11.event === e10 && this.filterBindings(n11, t10, r10));
          for (let e11 = 0; e11 < a10.length; e11++) a10[e11].callback(i10, r10, n10 || this.joinRef());
        }
        replyEventName(e10) {
          return `chan_reply_${e10}`;
        }
        isClosed() {
          return this.state === cq;
        }
        isErrored() {
          return this.state === cK;
        }
        isJoined() {
          return this.state === cJ;
        }
        isJoining() {
          return this.state === cF;
        }
        isLeaving() {
          return this.state === cz;
        }
      }, c5 = class {
        static request(e10, t10, r10, n10, i10, a10, s10) {
          if (cW.XDomainRequest) {
            let r11 = new cW.XDomainRequest();
            return this.xdomainRequest(r11, e10, t10, n10, i10, a10, s10);
          }
          if (cW.XMLHttpRequest) {
            let o10 = new cW.XMLHttpRequest();
            return this.xhrRequest(o10, e10, t10, r10, n10, i10, a10, s10);
          }
          if (cW.fetch && cW.AbortController) return this.fetchRequest(e10, t10, r10, n10, i10, a10, s10);
          throw Error("No suitable XMLHttpRequest implementation found");
        }
        static fetchRequest(e10, t10, r10, n10, i10, a10, s10) {
          let o10 = { method: e10, headers: r10, body: n10 }, l10 = null;
          return i10 && (l10 = new AbortController(), setTimeout(() => l10.abort(), i10), o10.signal = l10.signal), cW.fetch(t10, o10).then((e11) => e11.text()).then((e11) => this.parseJSON(e11)).then((e11) => s10 && s10(e11)).catch((e11) => {
            "AbortError" === e11.name && a10 ? a10() : s10 && s10(null);
          }), l10;
        }
        static xdomainRequest(e10, t10, r10, n10, i10, a10, s10) {
          return e10.timeout = i10, e10.open(t10, r10), e10.onload = () => {
            let t11 = this.parseJSON(e10.responseText);
            s10 && s10(t11);
          }, a10 && (e10.ontimeout = a10), e10.onprogress = () => {
          }, e10.send(n10), e10;
        }
        static xhrRequest(e10, t10, r10, n10, i10, a10, s10, o10) {
          for (let [i11, s11] of (e10.open(t10, r10, true), e10.timeout = a10, Object.entries(n10))) e10.setRequestHeader(i11, s11);
          return e10.onerror = () => o10 && o10(null), e10.onreadystatechange = () => {
            4 === e10.readyState && o10 && o10(this.parseJSON(e10.responseText));
          }, s10 && (e10.ontimeout = s10), e10.send(i10), e10;
        }
        static parseJSON(e10) {
          if (!e10 || "" === e10) return null;
          try {
            return JSON.parse(e10);
          } catch {
            return console && console.log("failed to parse JSON response", e10), null;
          }
        }
        static serialize(e10, t10) {
          let r10 = [];
          for (var n10 in e10) {
            if (!Object.prototype.hasOwnProperty.call(e10, n10)) continue;
            let i10 = t10 ? `${t10}[${n10}]` : n10, a10 = e10[n10];
            "object" == typeof a10 ? r10.push(this.serialize(a10, i10)) : r10.push(encodeURIComponent(i10) + "=" + encodeURIComponent(a10));
          }
          return r10.join("&");
        }
        static appendParams(e10, t10) {
          if (0 === Object.keys(t10).length) return e10;
          let r10 = e10.match(/\?/) ? "&" : "?";
          return `${e10}${r10}${this.serialize(t10)}`;
        }
      }, c6 = class {
        constructor(e10, t10) {
          t10 && 2 === t10.length && t10[1].startsWith(cQ) && (this.authToken = atob(t10[1].slice(cQ.length))), this.endPoint = null, this.token = null, this.skipHeartbeat = true, this.reqs = /* @__PURE__ */ new Set(), this.awaitingBatchAck = false, this.currentBatch = null, this.currentBatchTimer = null, this.batchBuffer = [], this.onopen = function() {
          }, this.onerror = function() {
          }, this.onmessage = function() {
          }, this.onclose = function() {
          }, this.pollEndpoint = this.normalizeEndpoint(e10), this.readyState = 0, setTimeout(() => this.poll(), 0);
        }
        normalizeEndpoint(e10) {
          return e10.replace("ws://", "http://").replace("wss://", "https://").replace(RegExp("(.*)/" + cZ), "$1/longpoll");
        }
        endpointURL() {
          return c5.appendParams(this.pollEndpoint, { token: this.token });
        }
        closeAndRetry(e10, t10, r10) {
          this.close(e10, t10, r10), this.readyState = 0;
        }
        ontimeout() {
          this.onerror("timeout"), this.closeAndRetry(1005, "timeout", false);
        }
        isActive() {
          return 1 === this.readyState || 0 === this.readyState;
        }
        poll() {
          let e10 = { Accept: "application/json" };
          this.authToken && (e10["X-Phoenix-AuthToken"] = this.authToken), this.ajax("GET", e10, null, () => this.ontimeout(), (e11) => {
            if (e11) {
              var { status: t10, token: r10, messages: n10 } = e11;
              if (410 === t10 && null !== this.token) {
                this.onerror(410), this.closeAndRetry(3410, "session_gone", false);
                return;
              }
              this.token = r10;
            } else t10 = 0;
            switch (t10) {
              case 200:
                n10.forEach((e12) => {
                  setTimeout(() => this.onmessage({ data: e12 }), 0);
                }), this.poll();
                break;
              case 204:
                this.poll();
                break;
              case 410:
                this.readyState = 1, this.onopen({}), this.poll();
                break;
              case 403:
                this.onerror(403), this.close(1008, "forbidden", false);
                break;
              case 0:
              case 500:
                this.onerror(500), this.closeAndRetry(1011, "internal server error", 500);
                break;
              default:
                throw Error(`unhandled poll status ${t10}`);
            }
          });
        }
        send(e10) {
          "string" != typeof e10 && (e10 = ((e11) => {
            let t10 = "", r10 = new Uint8Array(e11), n10 = r10.byteLength;
            for (let e12 = 0; e12 < n10; e12++) t10 += String.fromCharCode(r10[e12]);
            return btoa(t10);
          })(e10)), this.currentBatch ? this.currentBatch.push(e10) : this.awaitingBatchAck ? this.batchBuffer.push(e10) : (this.currentBatch = [e10], this.currentBatchTimer = setTimeout(() => {
            this.batchSend(this.currentBatch), this.currentBatch = null;
          }, 0));
        }
        batchSend(e10) {
          this.awaitingBatchAck = true, this.ajax("POST", { "Content-Type": "application/x-ndjson" }, e10.join("\n"), () => this.onerror("timeout"), (e11) => {
            this.awaitingBatchAck = false, e11 && 200 === e11.status ? this.batchBuffer.length > 0 && (this.batchSend(this.batchBuffer), this.batchBuffer = []) : (this.onerror(e11 && e11.status), this.closeAndRetry(1011, "internal server error", false));
          });
        }
        close(e10, t10, r10) {
          for (let e11 of this.reqs) e11.abort();
          this.readyState = 3;
          let n10 = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code: e10, reason: t10, wasClean: r10 });
          this.batchBuffer = [], clearTimeout(this.currentBatchTimer), this.currentBatchTimer = null, "u" > typeof CloseEvent ? this.onclose(new CloseEvent("close", n10)) : this.onclose(n10);
        }
        ajax(e10, t10, r10, n10, i10) {
          let a10, s10 = () => {
            this.reqs.delete(a10), n10();
          };
          a10 = c5.request(e10, this.endpointURL(), t10, r10, this.timeout, s10, (e11) => {
            this.reqs.delete(a10), this.isActive() && i10(e11);
          }), this.reqs.add(a10);
        }
      }, c3 = class e10 {
        constructor(t10, r10 = {}) {
          let n10 = r10.events || { state: "presence_state", diff: "presence_diff" };
          this.state = {}, this.pendingDiffs = [], this.channel = t10, this.joinRef = null, this.caller = { onJoin: function() {
          }, onLeave: function() {
          }, onSync: function() {
          } }, this.channel.on(n10.state, (t11) => {
            let { onJoin: r11, onLeave: n11, onSync: i10 } = this.caller;
            this.joinRef = this.channel.joinRef(), this.state = e10.syncState(this.state, t11, r11, n11), this.pendingDiffs.forEach((t12) => {
              this.state = e10.syncDiff(this.state, t12, r11, n11);
            }), this.pendingDiffs = [], i10();
          }), this.channel.on(n10.diff, (t11) => {
            let { onJoin: r11, onLeave: n11, onSync: i10 } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(t11) : (this.state = e10.syncDiff(this.state, t11, r11, n11), i10());
          });
        }
        onJoin(e11) {
          this.caller.onJoin = e11;
        }
        onLeave(e11) {
          this.caller.onLeave = e11;
        }
        onSync(e11) {
          this.caller.onSync = e11;
        }
        list(t10) {
          return e10.list(this.state, t10);
        }
        inPendingSyncState() {
          return !this.joinRef || this.joinRef !== this.channel.joinRef();
        }
        static syncState(e11, t10, r10, n10) {
          let i10 = this.clone(e11), a10 = {}, s10 = {};
          return this.map(i10, (e12, r11) => {
            t10[e12] || (s10[e12] = r11);
          }), this.map(t10, (e12, t11) => {
            let r11 = i10[e12];
            if (r11) {
              let n11 = t11.metas.map((e13) => e13.phx_ref), i11 = r11.metas.map((e13) => e13.phx_ref), o10 = t11.metas.filter((e13) => 0 > i11.indexOf(e13.phx_ref)), l10 = r11.metas.filter((e13) => 0 > n11.indexOf(e13.phx_ref));
              o10.length > 0 && (a10[e12] = t11, a10[e12].metas = o10), l10.length > 0 && (s10[e12] = this.clone(r11), s10[e12].metas = l10);
            } else a10[e12] = t11;
          }), this.syncDiff(i10, { joins: a10, leaves: s10 }, r10, n10);
        }
        static syncDiff(e11, t10, r10, n10) {
          let { joins: i10, leaves: a10 } = this.clone(t10);
          return r10 || (r10 = function() {
          }), n10 || (n10 = function() {
          }), this.map(i10, (t11, n11) => {
            let i11 = e11[t11];
            if (e11[t11] = this.clone(n11), i11) {
              let r11 = e11[t11].metas.map((e12) => e12.phx_ref), n12 = i11.metas.filter((e12) => 0 > r11.indexOf(e12.phx_ref));
              e11[t11].metas.unshift(...n12);
            }
            r10(t11, i11, n11);
          }), this.map(a10, (t11, r11) => {
            let i11 = e11[t11];
            if (!i11) return;
            let a11 = r11.metas.map((e12) => e12.phx_ref);
            i11.metas = i11.metas.filter((e12) => 0 > a11.indexOf(e12.phx_ref)), n10(t11, i11, r11), 0 === i11.metas.length && delete e11[t11];
          }), e11;
        }
        static list(e11, t10) {
          return t10 || (t10 = function(e12, t11) {
            return t11;
          }), this.map(e11, (e12, r10) => t10(e12, r10));
        }
        static map(e11, t10) {
          return Object.getOwnPropertyNames(e11).map((r10) => t10(r10, e11[r10]));
        }
        static clone(e11) {
          return JSON.parse(JSON.stringify(e11));
        }
      }, c4 = { HEADER_LENGTH: 1, META_LENGTH: 4, KINDS: { push: 0, reply: 1, broadcast: 2 }, encode(e10, t10) {
        return e10.payload.constructor === ArrayBuffer ? t10(this.binaryEncode(e10)) : t10(JSON.stringify([e10.join_ref, e10.ref, e10.topic, e10.event, e10.payload]));
      }, decode(e10, t10) {
        if (e10.constructor === ArrayBuffer) return t10(this.binaryDecode(e10));
        {
          let [r10, n10, i10, a10, s10] = JSON.parse(e10);
          return t10({ join_ref: r10, ref: n10, topic: i10, event: a10, payload: s10 });
        }
      }, binaryEncode(e10) {
        let { join_ref: t10, ref: r10, event: n10, topic: i10, payload: a10 } = e10, s10 = this.META_LENGTH + t10.length + r10.length + i10.length + n10.length, o10 = new ArrayBuffer(this.HEADER_LENGTH + s10), l10 = new DataView(o10), c10 = 0;
        l10.setUint8(c10++, this.KINDS.push), l10.setUint8(c10++, t10.length), l10.setUint8(c10++, r10.length), l10.setUint8(c10++, i10.length), l10.setUint8(c10++, n10.length), Array.from(t10, (e11) => l10.setUint8(c10++, e11.charCodeAt(0))), Array.from(r10, (e11) => l10.setUint8(c10++, e11.charCodeAt(0))), Array.from(i10, (e11) => l10.setUint8(c10++, e11.charCodeAt(0))), Array.from(n10, (e11) => l10.setUint8(c10++, e11.charCodeAt(0)));
        var u10 = new Uint8Array(o10.byteLength + a10.byteLength);
        return u10.set(new Uint8Array(o10), 0), u10.set(new Uint8Array(a10), o10.byteLength), u10.buffer;
      }, binaryDecode(e10) {
        let t10 = new DataView(e10), r10 = t10.getUint8(0), n10 = new TextDecoder();
        switch (r10) {
          case this.KINDS.push:
            return this.decodePush(e10, t10, n10);
          case this.KINDS.reply:
            return this.decodeReply(e10, t10, n10);
          case this.KINDS.broadcast:
            return this.decodeBroadcast(e10, t10, n10);
        }
      }, decodePush(e10, t10, r10) {
        let n10 = t10.getUint8(1), i10 = t10.getUint8(2), a10 = t10.getUint8(3), s10 = this.HEADER_LENGTH + this.META_LENGTH - 1, o10 = r10.decode(e10.slice(s10, s10 + n10));
        s10 += n10;
        let l10 = r10.decode(e10.slice(s10, s10 + i10));
        s10 += i10;
        let c10 = r10.decode(e10.slice(s10, s10 + a10));
        return s10 += a10, { join_ref: o10, ref: null, topic: l10, event: c10, payload: e10.slice(s10, e10.byteLength) };
      }, decodeReply(e10, t10, r10) {
        let n10 = t10.getUint8(1), i10 = t10.getUint8(2), a10 = t10.getUint8(3), s10 = t10.getUint8(4), o10 = this.HEADER_LENGTH + this.META_LENGTH, l10 = r10.decode(e10.slice(o10, o10 + n10));
        o10 += n10;
        let c10 = r10.decode(e10.slice(o10, o10 + i10));
        o10 += i10;
        let u10 = r10.decode(e10.slice(o10, o10 + a10));
        o10 += a10;
        let h10 = r10.decode(e10.slice(o10, o10 + s10));
        return o10 += s10, { join_ref: l10, ref: c10, topic: u10, event: cX, payload: { status: h10, response: e10.slice(o10, e10.byteLength) } };
      }, decodeBroadcast(e10, t10, r10) {
        let n10 = t10.getUint8(1), i10 = t10.getUint8(2), a10 = this.HEADER_LENGTH + 2, s10 = r10.decode(e10.slice(a10, a10 + n10));
        a10 += n10;
        let o10 = r10.decode(e10.slice(a10, a10 + i10));
        return a10 += i10, { join_ref: null, ref: null, topic: s10, event: o10, payload: e10.slice(a10, e10.byteLength) };
      } }, c8 = class {
        constructor(e10, t10 = {}) {
          this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.channels = [], this.sendBuffer = [], this.ref = 0, this.fallbackRef = null, this.timeout = t10.timeout || 1e4, this.transport = t10.transport || cW.WebSocket || c6, this.conn = void 0, this.primaryPassedHealthCheck = false, this.longPollFallbackMs = t10.longPollFallbackMs, this.fallbackTimer = null;
          let r10 = null;
          try {
            r10 = cW && cW.sessionStorage;
          } catch {
          }
          this.sessionStore = t10.sessionStorage || r10, this.establishedConnections = 0, this.defaultEncoder = c4.encode.bind(c4), this.defaultDecoder = c4.decode.bind(c4), this.closeWasClean = true, this.disconnecting = false, this.binaryType = t10.binaryType || "arraybuffer", this.connectClock = 1, this.pageHidden = false, this.encode = void 0, this.decode = void 0, this.transport !== c6 ? (this.encode = t10.encode || this.defaultEncoder, this.decode = t10.decode || this.defaultDecoder) : (this.encode = this.defaultEncoder, this.decode = this.defaultDecoder), this.heartbeatIntervalMs = t10.heartbeatIntervalMs || 3e4, this.autoSendHeartbeat = t10.autoSendHeartbeat ?? true, this.heartbeatCallback = t10.heartbeatCallback ?? (() => {
          }), this.rejoinAfterMs = (e11) => t10.rejoinAfterMs ? t10.rejoinAfterMs(e11) : [1e3, 2e3, 5e3][e11 - 1] || 1e4, this.reconnectAfterMs = (e11) => t10.reconnectAfterMs ? t10.reconnectAfterMs(e11) : [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][e11 - 1] || 5e3, this.logger = t10.logger || null, !this.logger && t10.debug && (this.logger = (e11, t11, r11) => {
            console.log(`${e11}: ${t11}`, r11);
          }), this.longpollerTimeout = t10.longpollerTimeout || 2e4, this.params = cB(t10.params || {}), this.endPoint = `${e10}/${cZ}`, this.vsn = t10.vsn || "2.0.0", this.heartbeatTimeoutTimer = null, this.heartbeatTimer = null, this.heartbeatSentAt = null, this.pendingHeartbeatRef = null, this.reconnectTimer = new c1(() => {
            if (this.pageHidden) {
              this.log("Not reconnecting as page is hidden!"), this.teardown();
              return;
            }
            this.teardown(async () => {
              t10.beforeReconnect && await t10.beforeReconnect(), this.connect();
            });
          }, this.reconnectAfterMs), this.authToken = t10.authToken;
        }
        getLongPollTransport() {
          return c6;
        }
        replaceTransport(e10) {
          this.connectClock++, this.closeWasClean = true, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.conn && (this.conn.close(), this.conn = null), this.transport = e10;
        }
        protocol() {
          return location.protocol.match(/^https/) ? "wss" : "ws";
        }
        endPointURL() {
          let e10 = c5.appendParams(c5.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
          return "/" !== e10.charAt(0) ? e10 : "/" === e10.charAt(1) ? `${this.protocol()}:${e10}` : `${this.protocol()}://${location.host}${e10}`;
        }
        disconnect(e10, t10, r10) {
          this.connectClock++, this.disconnecting = true, this.closeWasClean = true, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.teardown(() => {
            this.disconnecting = false, e10 && e10();
          }, t10, r10);
        }
        connect(e10) {
          e10 && (console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"), this.params = cB(e10)), (!this.conn || this.disconnecting) && (this.longPollFallbackMs && this.transport !== c6 ? this.connectWithFallback(c6, this.longPollFallbackMs) : this.transportConnect());
        }
        log(e10, t10, r10) {
          this.logger && this.logger(e10, t10, r10);
        }
        hasLogger() {
          return null !== this.logger;
        }
        onOpen(e10) {
          let t10 = this.makeRef();
          return this.stateChangeCallbacks.open.push([t10, e10]), t10;
        }
        onClose(e10) {
          let t10 = this.makeRef();
          return this.stateChangeCallbacks.close.push([t10, e10]), t10;
        }
        onError(e10) {
          let t10 = this.makeRef();
          return this.stateChangeCallbacks.error.push([t10, e10]), t10;
        }
        onMessage(e10) {
          let t10 = this.makeRef();
          return this.stateChangeCallbacks.message.push([t10, e10]), t10;
        }
        onHeartbeat(e10) {
          this.heartbeatCallback = e10;
        }
        ping(e10) {
          if (!this.isConnected()) return false;
          let t10 = this.makeRef(), r10 = Date.now();
          this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: t10 });
          let n10 = this.onMessage((i10) => {
            i10.ref === t10 && (this.off([n10]), e10(Date.now() - r10));
          });
          return true;
        }
        transportName(e10) {
          return e10 === c6 ? "LongPoll" : e10.name;
        }
        transportConnect() {
          let e10;
          this.connectClock++, this.closeWasClean = false, this.authToken && (e10 = ["phoenix", `${cQ}${btoa(this.authToken).replace(/=/g, "")}`]), this.conn = new this.transport(this.endPointURL(), e10), this.conn.binaryType = this.binaryType, this.conn.timeout = this.longpollerTimeout, this.conn.onopen = () => this.onConnOpen(), this.conn.onerror = (e11) => this.onConnError(e11), this.conn.onmessage = (e11) => this.onConnMessage(e11), this.conn.onclose = (e11) => this.onConnClose(e11);
        }
        getSession(e10) {
          return this.sessionStore && this.sessionStore.getItem(e10);
        }
        storeSession(e10, t10) {
          this.sessionStore && this.sessionStore.setItem(e10, t10);
        }
        connectWithFallback(e10, t10 = 2500) {
          let r10, n10;
          clearTimeout(this.fallbackTimer);
          let i10 = false, a10 = true, s10 = this.transportName(e10), o10 = (t11) => {
            this.log("transport", `falling back to ${s10}...`, t11), this.off([r10, n10]), a10 = false, this.replaceTransport(e10), this.transportConnect();
          };
          if (this.getSession(`phx:fallback:${s10}`)) return o10("memorized");
          this.fallbackTimer = setTimeout(o10, t10), n10 = this.onError((e11) => {
            this.log("transport", "error", e11), a10 && !i10 && (clearTimeout(this.fallbackTimer), o10(e11));
          }), this.fallbackRef && this.off([this.fallbackRef]), this.fallbackRef = this.onOpen(() => {
            if (i10 = true, !a10) {
              let t11 = this.transportName(e10);
              return this.primaryPassedHealthCheck || this.storeSession(`phx:fallback:${t11}`, "true"), this.log("transport", `established ${t11} fallback`);
            }
            clearTimeout(this.fallbackTimer), this.fallbackTimer = setTimeout(o10, t10), this.ping((e11) => {
              this.log("transport", "connected to primary after", e11), this.primaryPassedHealthCheck = true, clearTimeout(this.fallbackTimer);
            });
          }), this.transportConnect();
        }
        clearHeartbeats() {
          clearTimeout(this.heartbeatTimer), clearTimeout(this.heartbeatTimeoutTimer);
        }
        onConnOpen() {
          this.hasLogger() && this.log("transport", `connected to ${this.endPointURL()}`), this.closeWasClean = false, this.disconnecting = false, this.establishedConnections++, this.flushSendBuffer(), this.reconnectTimer.reset(), this.autoSendHeartbeat && this.resetHeartbeat(), this.triggerStateCallbacks("open");
        }
        heartbeatTimeout() {
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null, this.heartbeatSentAt = null, this.hasLogger() && this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
            try {
              this.heartbeatCallback("timeout");
            } catch (e10) {
              this.log("error", "error in heartbeat callback", e10);
            }
            this.triggerChanError(Error("heartbeat timeout")), this.closeWasClean = false, this.teardown(() => this.reconnectTimer.scheduleTimeout(), 1e3, "heartbeat timeout");
          }
        }
        resetHeartbeat() {
          this.conn && this.conn.skipHeartbeat || (this.pendingHeartbeatRef = null, this.clearHeartbeats(), this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs));
        }
        teardown(e10, t10, r10) {
          if (!this.conn) return e10 && e10();
          let n10 = this.conn;
          this.waitForBufferDone(n10, () => {
            t10 ? n10.close(t10, r10 || "") : n10.close(), this.waitForSocketClosed(n10, () => {
              this.conn === n10 && (this.conn.onopen = function() {
              }, this.conn.onerror = function() {
              }, this.conn.onmessage = function() {
              }, this.conn.onclose = function() {
              }, this.conn = null), e10 && e10();
            });
          });
        }
        waitForBufferDone(e10, t10, r10 = 1) {
          5 !== r10 && e10.bufferedAmount ? setTimeout(() => {
            this.waitForBufferDone(e10, t10, r10 + 1);
          }, 150 * r10) : t10();
        }
        waitForSocketClosed(e10, t10, r10 = 1) {
          5 === r10 || 3 === e10.readyState ? t10() : setTimeout(() => {
            this.waitForSocketClosed(e10, t10, r10 + 1);
          }, 150 * r10);
        }
        onConnClose(e10) {
          this.conn && (this.conn.onclose = () => {
          }), this.hasLogger() && this.log("transport", "close", e10), this.triggerChanError(e10), this.clearHeartbeats(), this.closeWasClean || this.reconnectTimer.scheduleTimeout(), this.triggerStateCallbacks("close", e10);
        }
        onConnError(e10) {
          this.hasLogger() && this.log("transport", "error", e10);
          let t10 = this.transport, r10 = this.establishedConnections;
          this.triggerStateCallbacks("error", e10, t10, r10), (t10 === this.transport || r10 > 0) && this.triggerChanError(e10);
        }
        triggerChanError(e10) {
          this.channels.forEach((t10) => {
            t10.isErrored() || t10.isLeaving() || t10.isClosed() || t10.trigger(cG, e10);
          });
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case 0:
              return "connecting";
            case 1:
              return "open";
            case 2:
              return "closing";
            default:
              return "closed";
          }
        }
        isConnected() {
          return "open" === this.connectionState();
        }
        remove(e10) {
          this.off(e10.stateChangeRefs), this.channels = this.channels.filter((t10) => t10 !== e10);
        }
        off(e10) {
          for (let t10 in this.stateChangeCallbacks) this.stateChangeCallbacks[t10] = this.stateChangeCallbacks[t10].filter(([t11]) => -1 === e10.indexOf(t11));
        }
        channel(e10, t10 = {}) {
          let r10 = new c2(e10, t10, this);
          return this.channels.push(r10), r10;
        }
        push(e10) {
          if (this.hasLogger()) {
            let { topic: t10, event: r10, payload: n10, ref: i10, join_ref: a10 } = e10;
            this.log("push", `${t10} ${r10} (${a10}, ${i10})`, n10);
          }
          this.isConnected() ? this.encode(e10, (e11) => this.conn.send(e11)) : this.sendBuffer.push(() => this.encode(e10, (e11) => this.conn.send(e11)));
        }
        makeRef() {
          let e10 = this.ref + 1;
          return e10 === this.ref ? this.ref = 0 : this.ref = e10, this.ref.toString();
        }
        sendHeartbeat() {
          if (!this.isConnected()) {
            try {
              this.heartbeatCallback("disconnected");
            } catch (e10) {
              this.log("error", "error in heartbeat callback", e10);
            }
            return;
          }
          if (this.pendingHeartbeatRef) return void this.heartbeatTimeout();
          this.pendingHeartbeatRef = this.makeRef(), this.heartbeatSentAt = Date.now(), this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
          try {
            this.heartbeatCallback("sent");
          } catch (e10) {
            this.log("error", "error in heartbeat callback", e10);
          }
          this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
        }
        flushSendBuffer() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e10) => e10()), this.sendBuffer = []);
        }
        onConnMessage(e10) {
          this.decode(e10.data, (e11) => {
            let { topic: t10, event: r10, payload: n10, ref: i10, join_ref: a10 } = e11;
            if (i10 && i10 === this.pendingHeartbeatRef) {
              let e12 = this.heartbeatSentAt ? Date.now() - this.heartbeatSentAt : void 0;
              this.clearHeartbeats();
              try {
                this.heartbeatCallback("ok" === n10.status ? "ok" : "error", e12);
              } catch (e13) {
                this.log("error", "error in heartbeat callback", e13);
              }
              this.pendingHeartbeatRef = null, this.heartbeatSentAt = null, this.autoSendHeartbeat && (this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs));
            }
            this.hasLogger() && this.log("receive", `${n10.status || ""} ${t10} ${r10} ${i10 && "(" + i10 + ")" || ""}`.trim(), n10);
            for (let e12 = 0; e12 < this.channels.length; e12++) {
              let s10 = this.channels[e12];
              s10.isMember(t10, r10, n10, a10) && s10.trigger(r10, n10, i10, a10);
            }
            this.triggerStateCallbacks("message", e11);
          });
        }
        triggerStateCallbacks(e10, ...t10) {
          try {
            this.stateChangeCallbacks[e10].forEach(([r10, n10]) => {
              try {
                n10(...t10);
              } catch (t11) {
                this.log("error", `error in ${e10} callback`, t11);
              }
            });
          } catch (t11) {
            this.log("error", `error triggering ${e10} callbacks`, t11);
          }
        }
        leaveOpenTopic(e10) {
          let t10 = this.channels.find((t11) => t11.topic === e10 && (t11.isJoined() || t11.isJoining()));
          t10 && (this.hasLogger() && this.log("transport", `leaving duplicate topic "${e10}"`), t10.leave());
        }
      };
      class c9 {
        constructor(e10, t10) {
          const r10 = function(e11) {
            return (null == e11 ? void 0 : e11.events) && { events: e11.events };
          }(t10);
          this.presence = new c3(e10.getChannel(), r10), this.presence.onJoin((t11, r11, n10) => {
            let i10 = c9.onJoinPayload(t11, r11, n10);
            e10.getChannel().trigger("presence", i10);
          }), this.presence.onLeave((t11, r11, n10) => {
            let i10 = c9.onLeavePayload(t11, r11, n10);
            e10.getChannel().trigger("presence", i10);
          }), this.presence.onSync(() => {
            e10.getChannel().trigger("presence", { event: "sync" });
          });
        }
        get state() {
          return c9.transformState(this.presence.state);
        }
        static transformState(e10) {
          return Object.getOwnPropertyNames(e10 = JSON.parse(JSON.stringify(e10))).reduce((t10, r10) => {
            let n10 = e10[r10];
            return t10[r10] = c7(n10), t10;
          }, {});
        }
        static onJoinPayload(e10, t10, r10) {
          return { event: "join", key: e10, currentPresences: ue(t10), newPresences: c7(r10) };
        }
        static onLeavePayload(e10, t10, r10) {
          return { event: "leave", key: e10, currentPresences: ue(t10), leftPresences: c7(r10) };
        }
      }
      function c7(e10) {
        return e10.metas.map((e11) => (e11.presence_ref = e11.phx_ref, delete e11.phx_ref, delete e11.phx_ref_prev, e11));
      }
      function ue(e10) {
        return (null == e10 ? void 0 : e10.metas) ? c7(e10) : [];
      }
      (G = et || (et = {})).SYNC = "sync", G.JOIN = "join", G.LEAVE = "leave";
      class ut {
        get state() {
          return this.presenceAdapter.state;
        }
        constructor(e10, t10) {
          this.channel = e10, this.presenceAdapter = new c9(this.channel.channelAdapter, t10);
        }
      }
      class ur {
        constructor(e10, t10, r10) {
          const n10 = function(e11) {
            return { config: Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, e11.config) };
          }(r10);
          this.channel = e10.getSocket().channel(t10, n10), this.socket = e10;
        }
        get state() {
          return this.channel.state;
        }
        set state(e10) {
          this.channel.state = e10;
        }
        get joinedOnce() {
          return this.channel.joinedOnce;
        }
        get joinPush() {
          return this.channel.joinPush;
        }
        get rejoinTimer() {
          return this.channel.rejoinTimer;
        }
        on(e10, t10) {
          return this.channel.on(e10, t10);
        }
        off(e10, t10) {
          this.channel.off(e10, t10);
        }
        subscribe(e10) {
          return this.channel.join(e10);
        }
        unsubscribe(e10) {
          return this.channel.leave(e10);
        }
        teardown() {
          this.channel.teardown();
        }
        onClose(e10) {
          this.channel.onClose(e10);
        }
        onError(e10) {
          return this.channel.onError(e10);
        }
        push(e10, t10, r10) {
          let n10;
          try {
            n10 = this.channel.push(e10, t10, r10);
          } catch (t11) {
            throw Error(`tried to push '${e10}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`);
          }
          if (this.channel.pushBuffer.length > 100) {
            let e11 = this.channel.pushBuffer.shift();
            e11.cancelTimeout(), this.socket.log("channel", `discarded push due to buffer overflow: ${e11.event}`, e11.payload());
          }
          return n10;
        }
        updateJoinPayload(e10) {
          let t10 = this.channel.joinPush.payload();
          this.channel.joinPush.payload = () => Object.assign(Object.assign({}, t10), e10);
        }
        canPush() {
          return this.socket.isConnected() && this.state === cR;
        }
        isJoined() {
          return this.state === cR;
        }
        isJoining() {
          return "joining" === this.state;
        }
        isClosed() {
          return "closed" === this.state;
        }
        isLeaving() {
          return "leaving" === this.state;
        }
        updateFilterBindings(e10) {
          this.channel.filterBindings = e10;
        }
        updatePayloadTransform(e10) {
          this.channel.onMessage = e10;
        }
        getChannel() {
          return this.channel;
        }
      }
      (X = er || (er = {})).ALL = "*", X.INSERT = "INSERT", X.UPDATE = "UPDATE", X.DELETE = "DELETE", (Y = en || (en = {})).BROADCAST = "broadcast", Y.PRESENCE = "presence", Y.POSTGRES_CHANGES = "postgres_changes", Y.SYSTEM = "system", (Z = ei || (ei = {})).SUBSCRIBED = "SUBSCRIBED", Z.TIMED_OUT = "TIMED_OUT", Z.CLOSED = "CLOSED", Z.CHANNEL_ERROR = "CHANNEL_ERROR";
      class un {
        get state() {
          return this.channelAdapter.state;
        }
        set state(e10) {
          this.channelAdapter.state = e10;
        }
        get joinedOnce() {
          return this.channelAdapter.joinedOnce;
        }
        get timeout() {
          return this.socket.timeout;
        }
        get joinPush() {
          return this.channelAdapter.joinPush;
        }
        get rejoinTimer() {
          return this.channelAdapter.rejoinTimer;
        }
        constructor(e10, t10 = { config: {} }, r10) {
          var n10, i10;
          if (this.topic = e10, this.params = t10, this.socket = r10, this.bindings = {}, this.subTopic = e10.replace(/^realtime:/i, ""), this.params.config = Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, t10.config), this.channelAdapter = new ur(this.socket.socketAdapter, e10, this.params), this.presence = new ut(this), this._onClose(() => {
            this.socket._remove(this);
          }), this._updateFilterTransform(), this.broadcastEndpointURL = cH(this.socket.socketAdapter.endPointURL()), this.private = this.params.config.private || false, !this.private && (null == (i10 = null == (n10 = this.params.config) ? void 0 : n10.broadcast) ? void 0 : i10.replay)) throw Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`);
        }
        subscribe(e10, t10 = this.timeout) {
          var r10, n10, i10;
          if (this.socket.isConnected() || this.socket.connect(), this.channelAdapter.isClosed()) {
            let { config: { broadcast: a10, presence: s10, private: o10 } } = this.params, l10 = null != (n10 = null == (r10 = this.bindings.postgres_changes) ? void 0 : r10.map((e11) => e11.filter)) ? n10 : [], c10 = !!this.bindings[en.PRESENCE] && this.bindings[en.PRESENCE].length > 0 || (null == (i10 = this.params.config.presence) ? void 0 : i10.enabled) === true, u10 = {}, h10 = { broadcast: a10, presence: Object.assign(Object.assign({}, s10), { enabled: c10 }), postgres_changes: l10, private: o10 };
            this.socket.accessTokenValue && (u10.access_token = this.socket.accessTokenValue), this._onError((t11) => {
              null == e10 || e10(ei.CHANNEL_ERROR, function(e11) {
                if (e11 instanceof Error) return e11;
                if ("string" == typeof e11) return Error(e11);
                if (e11 && "object" == typeof e11) {
                  if ("number" == typeof e11.code) {
                    let t12 = "string" == typeof e11.reason && e11.reason ? ` (${e11.reason})` : "";
                    return Error(`socket closed: ${e11.code}${t12}`, { cause: e11 });
                  }
                  return Error("channel error: transport failure", { cause: e11 });
                }
                return Error("channel error: connection lost");
              }(t11));
            }), this._onClose(() => null == e10 ? void 0 : e10(ei.CLOSED)), this.updateJoinPayload(Object.assign({ config: h10 }, u10)), this._updateFilterMessage(), this.channelAdapter.subscribe(t10).receive("ok", async ({ postgres_changes: t11 }) => {
              if (this.socket._isManualToken() || this.socket.setAuth(), void 0 === t11) {
                null == e10 || e10(ei.SUBSCRIBED);
                return;
              }
              this._updatePostgresBindings(t11, e10);
            }).receive("error", (t11) => {
              this.state = cA;
              let r11 = Object.values(t11).join(", ") || "error";
              null == e10 || e10(ei.CHANNEL_ERROR, Error(r11, { cause: t11 }));
            }).receive("timeout", () => {
              null == e10 || e10(ei.TIMED_OUT);
            });
          }
          return this;
        }
        _updatePostgresBindings(e10, t10) {
          var r10;
          let n10 = this.bindings.postgres_changes, i10 = null != (r10 = null == n10 ? void 0 : n10.length) ? r10 : 0, a10 = [];
          for (let r11 = 0; r11 < i10; r11++) {
            let i11 = n10[r11], { filter: { event: s10, schema: o10, table: l10, filter: c10 } } = i11, u10 = e10 && e10[r11];
            if (u10 && u10.event === s10 && un.isFilterValueEqual(u10.schema, o10) && un.isFilterValueEqual(u10.table, l10) && un.isFilterValueEqual(u10.filter, c10)) a10.push(Object.assign(Object.assign({}, i11), { id: u10.id }));
            else {
              this.unsubscribe(), this.state = cA, null == t10 || t10(ei.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = a10, this.state != cA && t10 && t10(ei.SUBSCRIBED);
        }
        presenceState() {
          return this.presence.state;
        }
        async track(e10, t10 = {}) {
          return await this.send({ type: "presence", event: "track", payload: e10 }, t10.timeout || this.timeout);
        }
        async untrack(e10 = {}) {
          return await this.send({ type: "presence", event: "untrack" }, e10);
        }
        on(e10, t10, r10) {
          let n10 = this.channelAdapter.isJoined() || this.channelAdapter.isJoining(), i10 = e10 === en.PRESENCE || e10 === en.POSTGRES_CHANGES;
          if (n10 && i10) throw this.socket.log("channel", `cannot add \`${e10}\` callbacks for ${this.topic} after \`subscribe()\`.`), Error(`cannot add \`${e10}\` callbacks for ${this.topic} after \`subscribe()\`.`);
          return this._on(e10, t10, r10);
        }
        async httpSend(e10, t10, r10 = {}) {
          var n10;
          if (null == t10) return Promise.reject(Error("Payload is required for httpSend()"));
          let i10 = t10 instanceof ArrayBuffer || ArrayBuffer.isView(t10), a10 = { apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": i10 ? "application/octet-stream" : "application/json" };
          this.socket.accessTokenValue && (a10.Authorization = `Bearer ${this.socket.accessTokenValue}`);
          let s10 = new URL(this.broadcastEndpointURL);
          s10.pathname += `/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(e10)}`, this.private && s10.searchParams.set("private", "true");
          let o10 = { method: "POST", headers: a10, body: i10 ? t10 : JSON.stringify(t10) }, l10 = await this._fetchWithTimeout(s10.toString(), o10, null != (n10 = r10.timeout) ? n10 : this.timeout);
          if (202 === l10.status) return { success: true };
          if (404 === l10.status) return Promise.reject(Error("httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md"));
          let c10 = l10.statusText;
          try {
            let e11 = await l10.json();
            c10 = e11.error || e11.message || c10;
          } catch (e11) {
          }
          return Promise.reject(Error(c10));
        }
        async send(e10, t10 = {}) {
          var r10, n10;
          if (this.channelAdapter.canPush() || "broadcast" !== e10.type) return new Promise((r11) => {
            var n11, i10, a10;
            let s10 = this.channelAdapter.push(e10.type, e10, t10.timeout || this.timeout);
            "broadcast" !== e10.type || (null == (a10 = null == (i10 = null == (n11 = this.params) ? void 0 : n11.config) ? void 0 : i10.broadcast) ? void 0 : a10.ack) || r11("ok"), s10.receive("ok", () => r11("ok")), s10.receive("error", () => r11("error")), s10.receive("timeout", () => r11("timed out"));
          });
          {
            console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
            let { event: i10, payload: a10 } = e10, s10 = { apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" };
            this.socket.accessTokenValue && (s10.Authorization = `Bearer ${this.socket.accessTokenValue}`);
            let o10 = { method: "POST", headers: s10, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: i10, payload: a10, private: this.private }] }) };
            try {
              let e11 = await this._fetchWithTimeout(this.broadcastEndpointURL, o10, null != (r10 = t10.timeout) ? r10 : this.timeout);
              return await (null == (n10 = e11.body) ? void 0 : n10.cancel()), e11.ok ? "ok" : "error";
            } catch (e11) {
              if (e11 instanceof Error && "AbortError" === e11.name) return "timed out";
              return "error";
            }
          }
        }
        updateJoinPayload(e10) {
          this.channelAdapter.updateJoinPayload(e10);
        }
        async unsubscribe(e10 = this.timeout) {
          return new Promise((t10) => {
            this.channelAdapter.unsubscribe(e10).receive("ok", () => t10("ok")).receive("timeout", () => t10("timed out")).receive("error", () => t10("error"));
          });
        }
        teardown() {
          this.channelAdapter.teardown();
        }
        async _fetchWithTimeout(e10, t10, r10) {
          let n10 = new AbortController(), i10 = setTimeout(() => n10.abort(), r10), a10 = await this.socket.fetch(e10, Object.assign(Object.assign({}, t10), { signal: n10.signal }));
          return clearTimeout(i10), a10;
        }
        _on(e10, t10, r10) {
          let n10 = e10.toLocaleLowerCase(), i10 = this.channelAdapter.on(e10, r10), a10 = { type: n10, filter: t10, callback: r10, ref: i10 };
          return this.bindings[n10] ? this.bindings[n10].push(a10) : this.bindings[n10] = [a10], this._updateFilterMessage(), this;
        }
        _onClose(e10) {
          this.channelAdapter.onClose(e10);
        }
        _onError(e10) {
          this.channelAdapter.onError(e10);
        }
        _updateFilterMessage() {
          this.channelAdapter.updateFilterBindings((e10, t10, r10) => {
            var n10, i10, a10, s10, o10, l10, c10;
            let u10 = e10.event.toLocaleLowerCase();
            if (this._notThisChannelEvent(u10, r10)) return false;
            let h10 = null == (n10 = this.bindings[u10]) ? void 0 : n10.find((t11) => t11.ref === e10.ref);
            if (!h10) return true;
            if (!["broadcast", "presence", "postgres_changes"].includes(u10)) return h10.type.toLocaleLowerCase() === u10;
            if ("id" in h10) {
              let e11 = h10.id, r11 = null == (i10 = h10.filter) ? void 0 : i10.event;
              return e11 && (null == (a10 = t10.ids) ? void 0 : a10.includes(e11)) && ("*" === r11 || (null == r11 ? void 0 : r11.toLocaleLowerCase()) === (null == (s10 = t10.data) ? void 0 : s10.type.toLocaleLowerCase()));
            }
            {
              let e11 = null == (l10 = null == (o10 = null == h10 ? void 0 : h10.filter) ? void 0 : o10.event) ? void 0 : l10.toLocaleLowerCase();
              return "*" === e11 || e11 === (null == (c10 = null == t10 ? void 0 : t10.event) ? void 0 : c10.toLocaleLowerCase());
            }
          });
        }
        _notThisChannelEvent(e10, t10) {
          let { close: r10, error: n10, leave: i10, join: a10 } = cC;
          return t10 && [r10, n10, i10, a10].includes(e10) && t10 !== this.joinPush.ref;
        }
        _updateFilterTransform() {
          this.channelAdapter.updatePayloadTransform((e10, t10, r10) => {
            if ("object" == typeof t10 && "ids" in t10) {
              let e11 = t10.data, { schema: r11, table: n10, commit_timestamp: i10, type: a10, errors: s10 } = e11;
              return Object.assign(Object.assign({}, { schema: r11, table: n10, commit_timestamp: i10, eventType: a10, new: {}, old: {}, errors: s10 }), this._getPayloadRecords(e11));
            }
            return t10;
          });
        }
        copyBindings(e10) {
          if (this.joinedOnce) throw Error("cannot copy bindings into joined channel");
          for (let t10 in e10.bindings) for (let r10 of e10.bindings[t10]) this._on(r10.type, r10.filter, r10.callback);
        }
        static isFilterValueEqual(e10, t10) {
          return (null != e10 ? e10 : void 0) === (null != t10 ? t10 : void 0);
        }
        _getPayloadRecords(e10) {
          let t10 = { new: {}, old: {} };
          return ("INSERT" === e10.type || "UPDATE" === e10.type) && (t10.new = cP(e10.columns, e10.record)), ("UPDATE" === e10.type || "DELETE" === e10.type) && (t10.old = cP(e10.columns, e10.old_record)), t10;
        }
      }
      class ui {
        constructor(e10, t10) {
          this.socket = new c8(e10, t10);
        }
        get timeout() {
          return this.socket.timeout;
        }
        get endPoint() {
          return this.socket.endPoint;
        }
        get transport() {
          return this.socket.transport;
        }
        get heartbeatIntervalMs() {
          return this.socket.heartbeatIntervalMs;
        }
        get heartbeatCallback() {
          return this.socket.heartbeatCallback;
        }
        set heartbeatCallback(e10) {
          this.socket.heartbeatCallback = e10;
        }
        get heartbeatTimer() {
          return this.socket.heartbeatTimer;
        }
        get pendingHeartbeatRef() {
          return this.socket.pendingHeartbeatRef;
        }
        get reconnectTimer() {
          return this.socket.reconnectTimer;
        }
        get vsn() {
          return this.socket.vsn;
        }
        get encode() {
          return this.socket.encode;
        }
        get decode() {
          return this.socket.decode;
        }
        get reconnectAfterMs() {
          return this.socket.reconnectAfterMs;
        }
        get sendBuffer() {
          return this.socket.sendBuffer;
        }
        get stateChangeCallbacks() {
          return this.socket.stateChangeCallbacks;
        }
        connect() {
          this.socket.connect();
        }
        disconnect(e10, t10, r10, n10 = 1e4) {
          return new Promise((i10) => {
            setTimeout(() => i10("timeout"), n10), this.socket.disconnect(() => {
              e10(), i10("ok");
            }, t10, r10);
          });
        }
        push(e10) {
          this.socket.push(e10);
        }
        log(e10, t10, r10) {
          this.socket.log(e10, t10, r10);
        }
        makeRef() {
          return this.socket.makeRef();
        }
        onOpen(e10) {
          this.socket.onOpen(e10);
        }
        onClose(e10) {
          this.socket.onClose(e10);
        }
        onError(e10) {
          this.socket.onError(e10);
        }
        onMessage(e10) {
          this.socket.onMessage(e10);
        }
        isConnected() {
          return this.socket.isConnected();
        }
        isConnecting() {
          return "connecting" == this.socket.connectionState();
        }
        isDisconnecting() {
          return "closing" == this.socket.connectionState();
        }
        connectionState() {
          return this.socket.connectionState();
        }
        endPointURL() {
          return this.socket.endPointURL();
        }
        sendHeartbeat() {
          this.socket.sendHeartbeat();
        }
        getSocket() {
          return this.socket;
        }
      }
      let ua = [1e3, 2e3, 5e3, 1e4], us = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
      class uo {
        get endPoint() {
          return this.socketAdapter.endPoint;
        }
        get timeout() {
          return this.socketAdapter.timeout;
        }
        get transport() {
          return this.socketAdapter.transport;
        }
        get heartbeatCallback() {
          return this.socketAdapter.heartbeatCallback;
        }
        get heartbeatIntervalMs() {
          return this.socketAdapter.heartbeatIntervalMs;
        }
        get heartbeatTimer() {
          return this.worker ? this._workerHeartbeatTimer : this.socketAdapter.heartbeatTimer;
        }
        get pendingHeartbeatRef() {
          return this.worker ? this._pendingWorkerHeartbeatRef : this.socketAdapter.pendingHeartbeatRef;
        }
        get reconnectTimer() {
          return this.socketAdapter.reconnectTimer;
        }
        get vsn() {
          return this.socketAdapter.vsn;
        }
        get encode() {
          return this.socketAdapter.encode;
        }
        get decode() {
          return this.socketAdapter.decode;
        }
        get reconnectAfterMs() {
          return this.socketAdapter.reconnectAfterMs;
        }
        get sendBuffer() {
          return this.socketAdapter.sendBuffer;
        }
        get stateChangeCallbacks() {
          return this.socketAdapter.stateChangeCallbacks;
        }
        constructor(e10, t10) {
          var r10;
          if (this.channels = [], this.accessTokenValue = null, this.accessToken = null, this.apiKey = null, this.httpEndpoint = "", this.headers = {}, this.params = {}, this.ref = 0, this.serializer = new cO(), this._manuallySetToken = false, this._authPromise = null, this._workerHeartbeatTimer = void 0, this._pendingWorkerHeartbeatRef = null, this._pendingDisconnectTimer = null, this._disconnectOnEmptyChannelsAfterMs = 0, this._resolveFetch = (e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12), !(null == (r10 = null == t10 ? void 0 : t10.params) ? void 0 : r10.apikey)) throw Error("API key is required to connect to Realtime");
          this.apiKey = t10.params.apikey;
          const n10 = this._initializeOptions(t10);
          this.socketAdapter = new ui(e10, n10), this.httpEndpoint = cH(e10), this.fetch = this._resolveFetch(null == t10 ? void 0 : t10.fetch);
        }
        connect() {
          if (!(this.isConnecting() || this.isDisconnecting() || this.isConnected())) {
            this.accessToken && !this._authPromise && this._setAuthSafely("connect"), this._setupConnectionHandlers();
            try {
              this.socketAdapter.connect();
            } catch (t10) {
              let e10 = t10.message;
              if (e10.includes("Node.js")) throw Error(`${e10}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
              throw Error(`WebSocket not available: ${e10}`);
            }
            this._handleNodeJsRaceCondition();
          }
        }
        endpointURL() {
          return this.socketAdapter.endPointURL();
        }
        async disconnect(e10, t10) {
          return (this._cancelPendingDisconnect(), this.isDisconnecting()) ? "ok" : await this.socketAdapter.disconnect(() => {
            clearInterval(this._workerHeartbeatTimer), this._terminateWorker();
          }, e10, t10);
        }
        getChannels() {
          return this.channels;
        }
        async removeChannel(e10) {
          let t10 = await e10.unsubscribe();
          return "ok" === t10 && e10.teardown(), t10;
        }
        async removeAllChannels() {
          let e10 = this.channels.map(async (e11) => {
            let t11 = await e11.unsubscribe();
            return e11.teardown(), t11;
          }), t10 = await Promise.all(e10);
          return await this.disconnect(), t10;
        }
        log(e10, t10, r10) {
          this.socketAdapter.log(e10, t10, r10);
        }
        connectionState() {
          return this.socketAdapter.connectionState() || "closed";
        }
        isConnected() {
          return this.socketAdapter.isConnected();
        }
        isConnecting() {
          return this.socketAdapter.isConnecting();
        }
        isDisconnecting() {
          return this.socketAdapter.isDisconnecting();
        }
        channel(e10, t10 = { config: {} }) {
          let r10 = `realtime:${e10}`, n10 = this.getChannels().find((e11) => e11.topic === r10);
          if (n10) return n10;
          {
            let r11 = new un(`realtime:${e10}`, t10, this);
            return this._cancelPendingDisconnect(), this.channels.push(r11), r11;
          }
        }
        push(e10) {
          this.socketAdapter.push(e10);
        }
        async setAuth(e10 = null) {
          this._authPromise = this._performAuth(e10);
          try {
            await this._authPromise;
          } finally {
            this._authPromise = null;
          }
        }
        _isManualToken() {
          return this._manuallySetToken;
        }
        async sendHeartbeat() {
          this.socketAdapter.sendHeartbeat();
        }
        onHeartbeat(e10) {
          this.socketAdapter.heartbeatCallback = this._wrapHeartbeatCallback(e10);
        }
        _makeRef() {
          return this.socketAdapter.makeRef();
        }
        _remove(e10) {
          this.channels = this.channels.filter((t10) => t10.topic !== e10.topic), 0 === this.channels.length && (this.log("transport", "no channels remaining, scheduling disconnect"), this._schedulePendingDisconnect());
        }
        _schedulePendingDisconnect() {
          if (this._cancelPendingDisconnect(), 0 === this._disconnectOnEmptyChannelsAfterMs) {
            this.log("transport", "disconnecting immediately - no channels"), this.disconnect();
            return;
          }
          this._pendingDisconnectTimer = setTimeout(() => {
            this._pendingDisconnectTimer = null, 0 === this.channels.length && (this.log("transport", "deferred disconnect fired - no channels, disconnecting"), this.disconnect());
          }, this._disconnectOnEmptyChannelsAfterMs), this.log("transport", `deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`);
        }
        _cancelPendingDisconnect() {
          null !== this._pendingDisconnectTimer && (this.log("transport", "pending disconnect cancelled - channel activity detected"), clearTimeout(this._pendingDisconnectTimer), this._pendingDisconnectTimer = null);
        }
        async _performAuth(e10 = null) {
          let t10, r10 = false;
          if (e10) t10 = e10, r10 = true;
          else if (this.accessToken) try {
            t10 = await this.accessToken();
          } catch (e11) {
            this.log("error", "Error fetching access token from callback", e11), t10 = this.accessTokenValue;
          }
          else t10 = this.accessTokenValue;
          r10 ? this._manuallySetToken = true : this.accessToken && (this._manuallySetToken = false), this.accessTokenValue != t10 && (this.accessTokenValue = t10, this.channels.forEach((e11) => {
            let r11 = { access_token: t10, version: "realtime-js/2.108.2" };
            t10 && e11.updateJoinPayload(r11), e11.joinedOnce && e11.channelAdapter.isJoined() && e11.channelAdapter.push(cC.access_token, { access_token: t10 });
          }));
        }
        async _waitForAuthIfNeeded() {
          this._authPromise && await this._authPromise;
        }
        _setAuthSafely(e10 = "general") {
          this._isManualToken() || this.setAuth().catch((t10) => {
            this.log("error", `Error setting auth in ${e10}`, t10);
          });
        }
        _setupConnectionHandlers() {
          this.socketAdapter.onOpen(() => {
            (this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())).catch((e10) => {
              this.log("error", "error waiting for auth on connect", e10);
            }), this.worker && !this.workerRef && this._startWorkerHeartbeat();
          }), this.socketAdapter.onClose(() => {
            this.worker && this.workerRef && this._terminateWorker();
          }), this.socketAdapter.onMessage((e10) => {
            e10.ref && e10.ref === this._pendingWorkerHeartbeatRef && (this._pendingWorkerHeartbeatRef = null);
          });
        }
        _handleNodeJsRaceCondition() {
          this.socketAdapter.isConnected() && this.socketAdapter.getSocket().onConnOpen();
        }
        _wrapHeartbeatCallback(e10) {
          return (t10, r10) => {
            "sent" == t10 && this._setAuthSafely(), e10 && e10(t10, r10);
          };
        }
        _startWorkerHeartbeat() {
          this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
          let e10 = this._workerObjectUrl(this.workerUrl);
          this.workerRef = new Worker(e10), this.workerRef.onerror = (e11) => {
            this.log("worker", "worker error", e11.message), this._terminateWorker(), this.disconnect();
          }, this.workerRef.onmessage = (e11) => {
            "keepAlive" === e11.data.event && this.sendHeartbeat();
          }, this.workerRef.postMessage({ event: "start", interval: this.heartbeatIntervalMs });
        }
        _terminateWorker() {
          this.workerRef && (this.log("worker", "terminating worker"), this.workerRef.terminate(), this.workerRef = void 0);
        }
        _workerObjectUrl(e10) {
          let t10;
          if (e10) t10 = e10;
          else {
            let e11 = new Blob([us], { type: "application/javascript" });
            t10 = URL.createObjectURL(e11);
          }
          return t10;
        }
        _initializeOptions(e10) {
          var t10, r10, n10, i10, a10, s10, o10, l10, c10, u10, h10, d2;
          let p2, f2;
          this.worker = null != (t10 = null == e10 ? void 0 : e10.worker) && t10, this.accessToken = null != (r10 = null == e10 ? void 0 : e10.accessToken) ? r10 : null;
          let g2 = {};
          g2.timeout = null != (n10 = null == e10 ? void 0 : e10.timeout) ? n10 : 1e4, g2.heartbeatIntervalMs = null != (i10 = null == e10 ? void 0 : e10.heartbeatIntervalMs) ? i10 : 25e3, this._disconnectOnEmptyChannelsAfterMs = null != (a10 = null == e10 ? void 0 : e10.disconnectOnEmptyChannelsAfterMs) ? a10 : 2 * (null != (s10 = null == e10 ? void 0 : e10.heartbeatIntervalMs) ? s10 : 25e3), g2.transport = null != (o10 = null == e10 ? void 0 : e10.transport) ? o10 : cS.getWebSocketConstructor(), g2.params = null == e10 ? void 0 : e10.params, g2.logger = null == e10 ? void 0 : e10.logger, g2.heartbeatCallback = this._wrapHeartbeatCallback(null == e10 ? void 0 : e10.heartbeatCallback), g2.sessionStorage = null != (l10 = null == e10 ? void 0 : e10.sessionStorage) ? l10 : function() {
            let e11;
            try {
              if ("u" > typeof globalThis && globalThis.sessionStorage) return globalThis.sessionStorage;
            } catch (e12) {
            }
            return e11 = /* @__PURE__ */ new Map(), { get length() {
              return e11.size;
            }, clear() {
              e11.clear();
            }, getItem: (t11) => e11.has(t11) ? e11.get(t11) : null, key(t11) {
              var r11;
              return null != (r11 = Array.from(e11.keys())[t11]) ? r11 : null;
            }, removeItem(t11) {
              e11.delete(t11);
            }, setItem(t11, r11) {
              e11.set(t11, String(r11));
            } };
          }(), g2.reconnectAfterMs = null != (c10 = null == e10 ? void 0 : e10.reconnectAfterMs) ? c10 : (e11) => ua[e11 - 1] || 1e4;
          let m2 = null != (u10 = null == e10 ? void 0 : e10.vsn) ? u10 : cT;
          switch (m2) {
            case "1.0.0":
              p2 = (e11, t11) => t11(JSON.stringify(e11)), f2 = (e11, t11) => t11(JSON.parse(e11));
              break;
            case cT:
              p2 = this.serializer.encode.bind(this.serializer), f2 = this.serializer.decode.bind(this.serializer);
              break;
            default:
              throw Error(`Unsupported serializer version: ${g2.vsn}`);
          }
          return g2.vsn = m2, g2.encode = null != (h10 = null == e10 ? void 0 : e10.encode) ? h10 : p2, g2.decode = null != (d2 = null == e10 ? void 0 : e10.decode) ? d2 : f2, g2.beforeReconnect = this._reconnectAuth.bind(this), ((null == e10 ? void 0 : e10.logLevel) || (null == e10 ? void 0 : e10.log_level)) && (this.logLevel = e10.logLevel || e10.log_level, g2.params = Object.assign(Object.assign({}, g2.params), { log_level: this.logLevel })), this.worker && (this.workerUrl = null == e10 ? void 0 : e10.workerUrl, g2.autoSendHeartbeat = !this.worker), g2;
        }
        async _reconnectAuth() {
          await this._waitForAuthIfNeeded(), this.isConnected() || this.connect();
        }
      }
      var ul = class extends Error {
        constructor(e10, t10) {
          super(e10), this.name = "IcebergError", this.status = t10.status, this.icebergType = t10.icebergType, this.icebergCode = t10.icebergCode, this.details = t10.details, this.isCommitStateUnknown = "CommitStateUnknownException" === t10.icebergType || [500, 502, 504].includes(t10.status) && t10.icebergType?.includes("CommitState") === true;
        }
        isNotFound() {
          return 404 === this.status;
        }
        isConflict() {
          return 409 === this.status;
        }
        isAuthenticationTimeout() {
          return 419 === this.status;
        }
      };
      async function uc(e10) {
        return e10 && "none" !== e10.type ? "bearer" === e10.type ? { Authorization: `Bearer ${e10.token}` } : "header" === e10.type ? { [e10.name]: e10.value } : "custom" === e10.type ? await e10.getHeaders() : {} : {};
      }
      function uu(e10) {
        return e10.join("");
      }
      var uh = class {
        constructor(e10, t10 = "") {
          this.client = e10, this.prefix = t10;
        }
        async listNamespaces(e10) {
          let t10 = e10 ? { parent: uu(e10.namespace) } : void 0;
          return (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces`, query: t10 })).data.namespaces.map((e11) => ({ namespace: e11 }));
        }
        async createNamespace(e10, t10) {
          let r10 = { namespace: e10.namespace, properties: t10?.properties };
          return (await this.client.request({ method: "POST", path: `${this.prefix}/namespaces`, body: r10 })).data;
        }
        async dropNamespace(e10) {
          await this.client.request({ method: "DELETE", path: `${this.prefix}/namespaces/${uu(e10.namespace)}` });
        }
        async loadNamespaceMetadata(e10) {
          return { properties: (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${uu(e10.namespace)}` })).data.properties };
        }
        async namespaceExists(e10) {
          try {
            return await this.client.request({ method: "HEAD", path: `${this.prefix}/namespaces/${uu(e10.namespace)}` }), true;
          } catch (e11) {
            if (e11 instanceof ul && 404 === e11.status) return false;
            throw e11;
          }
        }
        async createNamespaceIfNotExists(e10, t10) {
          try {
            return await this.createNamespace(e10, t10);
          } catch (e11) {
            if (e11 instanceof ul && 409 === e11.status) return;
            throw e11;
          }
        }
      };
      function ud(e10) {
        return e10.join("");
      }
      var up = class {
        constructor(e10, t10 = "", r10) {
          this.client = e10, this.prefix = t10, this.accessDelegation = r10;
        }
        async listTables(e10) {
          return (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${ud(e10.namespace)}/tables` })).data.identifiers;
        }
        async createTable(e10, t10) {
          let r10 = {};
          return this.accessDelegation && (r10["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({ method: "POST", path: `${this.prefix}/namespaces/${ud(e10.namespace)}/tables`, body: t10, headers: r10 })).data.metadata;
        }
        async updateTable(e10, t10) {
          let r10 = await this.client.request({ method: "POST", path: `${this.prefix}/namespaces/${ud(e10.namespace)}/tables/${e10.name}`, body: t10 });
          return { "metadata-location": r10.data["metadata-location"], metadata: r10.data.metadata };
        }
        async dropTable(e10, t10) {
          await this.client.request({ method: "DELETE", path: `${this.prefix}/namespaces/${ud(e10.namespace)}/tables/${e10.name}`, query: { purgeRequested: String(t10?.purge ?? false) } });
        }
        async loadTable(e10) {
          let t10 = {};
          return this.accessDelegation && (t10["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${ud(e10.namespace)}/tables/${e10.name}`, headers: t10 })).data.metadata;
        }
        async tableExists(e10) {
          let t10 = {};
          this.accessDelegation && (t10["X-Iceberg-Access-Delegation"] = this.accessDelegation);
          try {
            return await this.client.request({ method: "HEAD", path: `${this.prefix}/namespaces/${ud(e10.namespace)}/tables/${e10.name}`, headers: t10 }), true;
          } catch (e11) {
            if (e11 instanceof ul && 404 === e11.status) return false;
            throw e11;
          }
        }
        async createTableIfNotExists(e10, t10) {
          try {
            return await this.createTable(e10, t10);
          } catch (r10) {
            if (r10 instanceof ul && 409 === r10.status) return await this.loadTable({ namespace: e10.namespace, name: t10.name });
            throw r10;
          }
        }
      }, uf = class {
        constructor(e10) {
          let t10 = "v1";
          e10.catalogName && (t10 += `/${e10.catalogName}`);
          const r10 = e10.baseUrl.endsWith("/") ? e10.baseUrl : `${e10.baseUrl}/`;
          this.client = function(e11) {
            let t11 = e11.fetchImpl ?? globalThis.fetch;
            return { async request({ method: r11, path: n10, query: i10, body: a10, headers: s10 }) {
              let o10 = function(e12, t12, r12) {
                let n11 = new URL(t12, e12);
                if (r12) for (let [e13, t13] of Object.entries(r12)) void 0 !== t13 && n11.searchParams.set(e13, t13);
                return n11.toString();
              }(e11.baseUrl, n10, i10), l10 = await uc(e11.auth), c10 = await t11(o10, { method: r11, headers: { ...a10 ? { "Content-Type": "application/json" } : {}, ...l10, ...s10 }, body: a10 ? JSON.stringify(a10) : void 0 }), u10 = await c10.text(), h10 = (c10.headers.get("content-type") || "").includes("application/json"), d2 = h10 && u10 ? JSON.parse(u10) : u10;
              if (!c10.ok) {
                let e12 = h10 ? d2 : void 0, t12 = e12?.error;
                throw new ul(t12?.message ?? `Request failed with status ${c10.status}`, { status: c10.status, icebergType: t12?.type, icebergCode: t12?.code, details: e12 });
              }
              return { status: c10.status, headers: c10.headers, data: d2 };
            } };
          }({ baseUrl: r10, auth: e10.auth, fetchImpl: e10.fetch }), this.accessDelegation = e10.accessDelegation?.join(","), this.namespaceOps = new uh(this.client, t10), this.tableOps = new up(this.client, t10, this.accessDelegation);
        }
        async listNamespaces(e10) {
          return this.namespaceOps.listNamespaces(e10);
        }
        async createNamespace(e10, t10) {
          return this.namespaceOps.createNamespace(e10, t10);
        }
        async dropNamespace(e10) {
          await this.namespaceOps.dropNamespace(e10);
        }
        async loadNamespaceMetadata(e10) {
          return this.namespaceOps.loadNamespaceMetadata(e10);
        }
        async listTables(e10) {
          return this.tableOps.listTables(e10);
        }
        async createTable(e10, t10) {
          return this.tableOps.createTable(e10, t10);
        }
        async updateTable(e10, t10) {
          return this.tableOps.updateTable(e10, t10);
        }
        async dropTable(e10, t10) {
          await this.tableOps.dropTable(e10, t10);
        }
        async loadTable(e10) {
          return this.tableOps.loadTable(e10);
        }
        async namespaceExists(e10) {
          return this.namespaceOps.namespaceExists(e10);
        }
        async tableExists(e10) {
          return this.tableOps.tableExists(e10);
        }
        async createNamespaceIfNotExists(e10, t10) {
          return this.namespaceOps.createNamespaceIfNotExists(e10, t10);
        }
        async createTableIfNotExists(e10, t10) {
          return this.tableOps.createTableIfNotExists(e10, t10);
        }
      };
      function ug(e10) {
        return (ug = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function um(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var n10 = Object.getOwnPropertySymbols(e10);
          t10 && (n10 = n10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, n10);
        }
        return r10;
      }
      function uy(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? um(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var n10;
              (n10 = function(e12, t13) {
                if ("object" != ug(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var n11 = r12.call(e12, t13 || "default");
                  if ("object" != ug(n11)) return n11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == ug(n10) ? n10 : n10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : um(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      var ub = class extends Error {
        constructor(e10, t10 = "storage", r10, n10) {
          super(e10), this.__isStorageError = true, this.namespace = t10, this.name = "vectors" === t10 ? "StorageVectorsError" : "StorageError", this.status = r10, this.statusCode = n10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      };
      function uw(e10) {
        return "object" == typeof e10 && null !== e10 && "__isStorageError" in e10;
      }
      var uv = class extends ub {
        constructor(e10, t10, r10, n10 = "storage") {
          super(e10, n10, t10, r10), this.name = "vectors" === n10 ? "StorageVectorsApiError" : "StorageApiError", this.status = t10, this.statusCode = r10;
        }
        toJSON() {
          return uy({}, super.toJSON());
        }
      }, u_ = class extends ub {
        constructor(e10, t10, r10 = "storage") {
          super(e10, r10), this.name = "vectors" === r10 ? "StorageVectorsUnknownError" : "StorageUnknownError", this.originalError = t10;
        }
      };
      function ux(e10, t10, r10) {
        let n10 = uy({}, e10), i10 = t10.toLowerCase();
        for (let e11 of Object.keys(n10)) e11.toLowerCase() === i10 && delete n10[e11];
        return n10[i10] = r10, n10;
      }
      let uE = (e10) => {
        if (Array.isArray(e10)) return e10.map((e11) => uE(e11));
        if ("function" == typeof e10 || e10 !== Object(e10)) return e10;
        let t10 = {};
        return Object.entries(e10).forEach(([e11, r10]) => {
          t10[e11.replace(/([-_][a-z])/gi, (e12) => e12.toUpperCase().replace(/[-_]/g, ""))] = uE(r10);
        }), t10;
      }, uk = (e10) => {
        if ("object" == typeof e10 && null !== e10) {
          if ("string" == typeof e10.msg) return e10.msg;
          if ("string" == typeof e10.message) return e10.message;
          if ("string" == typeof e10.error_description) return e10.error_description;
          if ("string" == typeof e10.error) return e10.error;
          if ("object" == typeof e10.error && null !== e10.error) {
            let t10 = e10.error;
            if ("string" == typeof t10.message) return t10.message;
          }
        }
        return JSON.stringify(e10);
      }, uS = async (e10, t10, r10, n10) => {
        if (null !== e10 && "object" == typeof e10 && "json" in e10 && "function" == typeof e10.json) {
          let r11 = parseInt(String(e10.status), 10);
          Number.isFinite(r11) || (r11 = 500), e10.json().then((e11) => {
            let i10 = (null == e11 ? void 0 : e11.statusCode) || (null == e11 ? void 0 : e11.code) || r11 + "";
            t10(new uv(uk(e11), r11, i10, n10));
          }).catch(() => {
            let i10 = r11 + "";
            t10(new uv(e10.statusText || `HTTP ${r11} error`, r11, i10, n10));
          });
        } else t10(new u_(uk(e10), e10, n10));
      };
      async function uT(e10, t10, r10, n10, i10, a10, s10) {
        return new Promise((o10, l10) => {
          e10(r10, ((e11, t11, r11, n11) => {
            let i11 = { method: e11, headers: (null == t11 ? void 0 : t11.headers) || {} };
            if ("GET" === e11 || "HEAD" === e11 || !n11) return uy(uy({}, i11), r11);
            if (((e12) => {
              if ("object" != typeof e12 || null === e12) return false;
              let t12 = Object.getPrototypeOf(e12);
              return (null === t12 || t12 === Object.prototype || null === Object.getPrototypeOf(t12)) && !(Symbol.toStringTag in e12) && !(Symbol.iterator in e12);
            })(n11)) {
              var a11;
              let e12, r12 = (null == t11 ? void 0 : t11.headers) || {};
              for (let [t12, n12] of Object.entries(r12)) "content-type" === t12.toLowerCase() && (e12 = n12);
              i11.headers = ux(r12, "Content-Type", null != (a11 = e12) ? a11 : "application/json"), i11.body = JSON.stringify(n11);
            } else i11.body = n11;
            return (null == t11 ? void 0 : t11.duplex) && (i11.duplex = t11.duplex), uy(uy({}, i11), r11);
          })(t10, n10, i10, a10)).then((e11) => {
            if (!e11.ok) throw e11;
            if (null == n10 ? void 0 : n10.noResolveJson) return e11;
            if ("vectors" === s10) {
              let t11 = e11.headers.get("content-type");
              if ("0" === e11.headers.get("content-length") || 204 === e11.status || !t11 || !t11.includes("application/json")) return {};
            }
            return e11.json();
          }).then((e11) => o10(e11)).catch((e11) => uS(e11, l10, n10, s10));
        });
      }
      function uA(e10 = "storage") {
        return { get: async (t10, r10, n10, i10) => uT(t10, "GET", r10, n10, i10, void 0, e10), post: async (t10, r10, n10, i10, a10) => uT(t10, "POST", r10, i10, a10, n10, e10), put: async (t10, r10, n10, i10, a10) => uT(t10, "PUT", r10, i10, a10, n10, e10), head: async (t10, r10, n10, i10) => uT(t10, "HEAD", r10, uy(uy({}, n10), {}, { noResolveJson: true }), i10, void 0, e10), remove: async (t10, r10, n10, i10, a10) => uT(t10, "DELETE", r10, i10, a10, n10, e10) };
      }
      let { get: uR, post: uC, put: uO, head: uP, remove: uI } = uA("storage"), uj = uA("vectors");
      var u$ = class {
        constructor(e10, t10 = {}, r10, n10 = "storage") {
          this.shouldThrowOnError = false, this.url = e10, this.headers = function(e11) {
            let t11 = {};
            for (let [r11, n11] of Object.entries(e11)) t11[r11.toLowerCase()] = n11;
            return t11;
          }(t10), this.fetch = /* @__PURE__ */ ((e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12))(r10), this.namespace = n10;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        setHeader(e10, t10) {
          return this.headers = ux(this.headers, e10, t10), this;
        }
        async handleOperation(e10) {
          try {
            return { data: await e10(), error: null };
          } catch (e11) {
            if (this.shouldThrowOnError) throw e11;
            if (uw(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      };
      o = Symbol.toStringTag;
      var uN = class {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10, this[o] = "StreamDownloadBuilder", this.promise = null;
        }
        then(e10, t10) {
          return this.getPromise().then(e10, t10);
        }
        catch(e10) {
          return this.getPromise().catch(e10);
        }
        finally(e10) {
          return this.getPromise().finally(e10);
        }
        getPromise() {
          return this.promise || (this.promise = this.execute()), this.promise;
        }
        async execute() {
          try {
            return { data: (await this.downloadFn()).body, error: null };
          } catch (e10) {
            if (this.shouldThrowOnError) throw e10;
            if (uw(e10)) return { data: null, error: e10 };
            throw e10;
          }
        }
      };
      l = Symbol.toStringTag;
      var uU = class {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10, this[l] = "BlobDownloadBuilder", this.promise = null;
        }
        asStream() {
          return new uN(this.downloadFn, this.shouldThrowOnError);
        }
        then(e10, t10) {
          return this.getPromise().then(e10, t10);
        }
        catch(e10) {
          return this.getPromise().catch(e10);
        }
        finally(e10) {
          return this.getPromise().finally(e10);
        }
        getPromise() {
          return this.promise || (this.promise = this.execute()), this.promise;
        }
        async execute() {
          try {
            return { data: await (await this.downloadFn()).blob(), error: null };
          } catch (e10) {
            if (this.shouldThrowOnError) throw e10;
            if (uw(e10)) return { data: null, error: e10 };
            throw e10;
          }
        }
      };
      let uD = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }, uL = { cacheControl: "3600", contentType: "text/plain;charset=UTF-8", upsert: false };
      var uM = class extends u$ {
        constructor(e10, t10 = {}, r10, n10) {
          super(e10, t10, n10, "storage"), this.bucketId = r10;
        }
        async uploadOrUpdate(e10, t10, r10, n10) {
          var i10 = this;
          return i10.handleOperation(async () => {
            let a10, s10 = uy(uy({}, uL), n10), o10 = uy(uy({}, i10.headers), "POST" === e10 && { "x-upsert": String(s10.upsert) }), l10 = s10.metadata;
            if ("u" > typeof Blob && r10 instanceof Blob ? ((a10 = new FormData()).append("cacheControl", s10.cacheControl), l10 && a10.append("metadata", i10.encodeMetadata(l10)), a10.append("", r10)) : "u" > typeof FormData && r10 instanceof FormData ? ((a10 = r10).has("cacheControl") || a10.append("cacheControl", s10.cacheControl), l10 && !a10.has("metadata") && a10.append("metadata", i10.encodeMetadata(l10))) : (a10 = r10, o10["cache-control"] = `max-age=${s10.cacheControl}`, o10["content-type"] = s10.contentType, l10 && (o10["x-metadata"] = i10.toBase64(i10.encodeMetadata(l10))), ("u" > typeof ReadableStream && a10 instanceof ReadableStream || a10 && "object" == typeof a10 && "pipe" in a10 && "function" == typeof a10.pipe) && !s10.duplex && (s10.duplex = "half")), null == n10 ? void 0 : n10.headers) for (let [e11, t11] of Object.entries(n10.headers)) o10 = ux(o10, e11, t11);
            let c10 = i10._removeEmptyFolders(t10), u10 = i10._getFinalPath(c10), h10 = await ("PUT" == e10 ? uO : uC)(i10.fetch, `${i10.url}/object/${u10}`, a10, uy({ headers: o10 }, (null == s10 ? void 0 : s10.duplex) ? { duplex: s10.duplex } : {}));
            return { path: c10, id: h10.Id, fullPath: h10.Key };
          });
        }
        async upload(e10, t10, r10) {
          return this.uploadOrUpdate("POST", e10, t10, r10);
        }
        async uploadToSignedUrl(e10, t10, r10, n10) {
          var i10 = this;
          let a10 = i10._removeEmptyFolders(e10), s10 = i10._getFinalPath(a10), o10 = new URL(i10.url + `/object/upload/sign/${s10}`);
          return o10.searchParams.set("token", t10), i10.handleOperation(async () => {
            let e11, t11 = uy(uy({}, uL), n10), s11 = uy(uy({}, i10.headers), { "x-upsert": String(t11.upsert) }), l10 = t11.metadata;
            if ("u" > typeof Blob && r10 instanceof Blob ? ((e11 = new FormData()).append("cacheControl", t11.cacheControl), l10 && e11.append("metadata", i10.encodeMetadata(l10)), e11.append("", r10)) : "u" > typeof FormData && r10 instanceof FormData ? ((e11 = r10).has("cacheControl") || e11.append("cacheControl", t11.cacheControl), l10 && !e11.has("metadata") && e11.append("metadata", i10.encodeMetadata(l10))) : (e11 = r10, s11["cache-control"] = `max-age=${t11.cacheControl}`, s11["content-type"] = t11.contentType, l10 && (s11["x-metadata"] = i10.toBase64(i10.encodeMetadata(l10))), ("u" > typeof ReadableStream && e11 instanceof ReadableStream || e11 && "object" == typeof e11 && "pipe" in e11 && "function" == typeof e11.pipe) && !t11.duplex && (t11.duplex = "half")), null == n10 ? void 0 : n10.headers) for (let [e12, t12] of Object.entries(n10.headers)) s11 = ux(s11, e12, t12);
            return { path: a10, fullPath: (await uO(i10.fetch, o10.toString(), e11, uy({ headers: s11 }, (null == t11 ? void 0 : t11.duplex) ? { duplex: t11.duplex } : {}))).Key };
          });
        }
        async createSignedUploadUrl(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => {
            let n10 = r10._getFinalPath(e10), i10 = uy({}, r10.headers);
            (null == t10 ? void 0 : t10.upsert) && (i10["x-upsert"] = "true");
            let a10 = await uC(r10.fetch, `${r10.url}/object/upload/sign/${n10}`, {}, { headers: i10 }), s10 = new URL(r10.url + a10.url), o10 = s10.searchParams.get("token");
            if (!o10) throw new ub("No token returned by API");
            return { signedUrl: s10.toString(), path: e10, token: o10 };
          });
        }
        async update(e10, t10, r10) {
          return this.uploadOrUpdate("PUT", e10, t10, r10);
        }
        async move(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => await uC(n10.fetch, `${n10.url}/object/move`, { bucketId: n10.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: n10.headers }));
        }
        async copy(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => ({ path: (await uC(n10.fetch, `${n10.url}/object/copy`, { bucketId: n10.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: n10.headers })).Key }));
        }
        async createSignedUrl(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => {
            let i10 = n10._getFinalPath(e10), a10 = "object" == typeof (null == r10 ? void 0 : r10.transform) && null !== r10.transform && Object.keys(r10.transform).length > 0, s10 = await uC(n10.fetch, `${n10.url}/object/sign/${i10}`, uy({ expiresIn: t10 }, a10 ? { transform: r10.transform } : {}), { headers: n10.headers }), o10 = new URLSearchParams();
            (null == r10 ? void 0 : r10.download) && o10.set("download", true === r10.download ? "" : r10.download), (null == r10 ? void 0 : r10.cacheNonce) != null && o10.set("cacheNonce", String(r10.cacheNonce));
            let l10 = o10.toString();
            return { signedUrl: encodeURI(`${n10.url}${s10.signedURL}${l10 ? `&${l10}` : ""}`) };
          });
        }
        async createSignedUrls(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => {
            let i10 = await uC(n10.fetch, `${n10.url}/object/sign/${n10.bucketId}`, { expiresIn: t10, paths: e10 }, { headers: n10.headers }), a10 = new URLSearchParams();
            (null == r10 ? void 0 : r10.download) && a10.set("download", true === r10.download ? "" : r10.download), (null == r10 ? void 0 : r10.cacheNonce) != null && a10.set("cacheNonce", String(r10.cacheNonce));
            let s10 = a10.toString();
            return i10.map((e11) => uy(uy({}, e11), {}, { signedUrl: e11.signedURL ? encodeURI(`${n10.url}${e11.signedURL}${s10 ? `&${s10}` : ""}`) : null }));
          });
        }
        download(e10, t10, r10) {
          let n10 = "object" == typeof (null == t10 ? void 0 : t10.transform) && null !== t10.transform && Object.keys(t10.transform).length > 0 ? "render/image/authenticated" : "object", i10 = new URLSearchParams();
          (null == t10 ? void 0 : t10.transform) && this.applyTransformOptsToQuery(i10, t10.transform), (null == t10 ? void 0 : t10.cacheNonce) != null && i10.set("cacheNonce", String(t10.cacheNonce));
          let a10 = i10.toString(), s10 = this._getFinalPath(e10);
          return new uU(() => uR(this.fetch, `${this.url}/${n10}/${s10}${a10 ? `?${a10}` : ""}`, { headers: this.headers, noResolveJson: true }, r10), this.shouldThrowOnError);
        }
        async info(e10) {
          var t10 = this;
          let r10 = t10._getFinalPath(e10);
          return t10.handleOperation(async () => uE(await uR(t10.fetch, `${t10.url}/object/info/${r10}`, { headers: t10.headers })));
        }
        async exists(e10) {
          var t10;
          let r10 = this._getFinalPath(e10);
          try {
            return await uP(this.fetch, `${this.url}/object/${r10}`, { headers: this.headers }), { data: true, error: null };
          } catch (e11) {
            if (this.shouldThrowOnError) throw e11;
            if (uw(e11)) {
              let r11 = e11 instanceof uv ? e11.status : e11 instanceof u_ ? null == (t10 = e11.originalError) ? void 0 : t10.status : void 0;
              if (void 0 !== r11 && [400, 404].includes(r11)) return { data: false, error: e11 };
            }
            throw e11;
          }
        }
        getPublicUrl(e10, t10) {
          let r10 = this._getFinalPath(e10), n10 = new URLSearchParams();
          (null == t10 ? void 0 : t10.download) && n10.set("download", true === t10.download ? "" : t10.download), (null == t10 ? void 0 : t10.transform) && this.applyTransformOptsToQuery(n10, t10.transform), (null == t10 ? void 0 : t10.cacheNonce) != null && n10.set("cacheNonce", String(t10.cacheNonce));
          let i10 = n10.toString(), a10 = "object" == typeof (null == t10 ? void 0 : t10.transform) && null !== t10.transform && Object.keys(t10.transform).length > 0 ? "render/image" : "object";
          return { data: { publicUrl: encodeURI(`${this.url}/${a10}/public/${r10}`) + (i10 ? `?${i10}` : "") } };
        }
        async remove(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uI(t10.fetch, `${t10.url}/object/${t10.bucketId}`, { prefixes: e10 }, { headers: t10.headers }));
        }
        async list(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => {
            let i10 = uy(uy(uy({}, uD), t10), {}, { prefix: e10 || "" });
            return await uC(n10.fetch, `${n10.url}/object/list/${n10.bucketId}`, i10, { headers: n10.headers }, r10);
          });
        }
        async listV2(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => {
            let n10 = uy({}, e10);
            return await uC(r10.fetch, `${r10.url}/object/list-v2/${r10.bucketId}`, n10, { headers: r10.headers }, t10);
          });
        }
        encodeMetadata(e10) {
          return JSON.stringify(e10);
        }
        toBase64(e10) {
          return void 0 !== tr.Buffer ? tr.Buffer.from(e10).toString("base64") : btoa(e10);
        }
        _getFinalPath(e10) {
          return `${this.bucketId}/${e10.replace(/^\/+/, "")}`;
        }
        _removeEmptyFolders(e10) {
          return e10.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
        applyTransformOptsToQuery(e10, t10) {
          return t10.width && e10.set("width", t10.width.toString()), t10.height && e10.set("height", t10.height.toString()), t10.resize && e10.set("resize", t10.resize), t10.format && e10.set("format", t10.format), t10.quality && e10.set("quality", t10.quality.toString()), e10;
        }
      };
      let uH = { "X-Client-Info": "storage-js/2.108.2" };
      var uB = class extends u$ {
        constructor(e10, t10 = {}, r10, n10) {
          const i10 = new URL(e10);
          (null == n10 ? void 0 : n10.useNewHostname) && /supabase\.(co|in|red)$/.test(i10.hostname) && !i10.hostname.includes("storage.supabase.") && (i10.hostname = i10.hostname.replace("supabase.", "storage.supabase.")), super(i10.href.replace(/\/$/, ""), uy(uy({}, uH), t10), r10, "storage");
        }
        async listBuckets(e10) {
          var t10 = this;
          return t10.handleOperation(async () => {
            let r10 = t10.listBucketOptionsToQueryString(e10);
            return await uR(t10.fetch, `${t10.url}/bucket${r10}`, { headers: t10.headers });
          });
        }
        async getBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uR(t10.fetch, `${t10.url}/bucket/${e10}`, { headers: t10.headers }));
        }
        async createBucket(e10, t10 = { public: false }) {
          var r10 = this;
          return r10.handleOperation(async () => await uC(r10.fetch, `${r10.url}/bucket`, { id: e10, name: e10, type: t10.type, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: r10.headers }));
        }
        async updateBucket(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await uO(r10.fetch, `${r10.url}/bucket/${e10}`, { id: e10, name: e10, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: r10.headers }));
        }
        async emptyBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uC(t10.fetch, `${t10.url}/bucket/${e10}/empty`, {}, { headers: t10.headers }));
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uI(t10.fetch, `${t10.url}/bucket/${e10}`, {}, { headers: t10.headers }));
        }
        listBucketOptionsToQueryString(e10) {
          let t10 = {};
          return e10 && ("limit" in e10 && (t10.limit = String(e10.limit)), "offset" in e10 && (t10.offset = String(e10.offset)), e10.search && (t10.search = e10.search), e10.sortColumn && (t10.sortColumn = e10.sortColumn), e10.sortOrder && (t10.sortOrder = e10.sortOrder)), Object.keys(t10).length > 0 ? "?" + new URLSearchParams(t10).toString() : "";
        }
      }, uW = class extends u$ {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), uy(uy({}, uH), t10), r10, "storage");
        }
        async createBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uC(t10.fetch, `${t10.url}/bucket`, { name: e10 }, { headers: t10.headers }));
        }
        async listBuckets(e10) {
          var t10 = this;
          return t10.handleOperation(async () => {
            let r10 = new URLSearchParams();
            (null == e10 ? void 0 : e10.limit) !== void 0 && r10.set("limit", e10.limit.toString()), (null == e10 ? void 0 : e10.offset) !== void 0 && r10.set("offset", e10.offset.toString()), (null == e10 ? void 0 : e10.sortColumn) && r10.set("sortColumn", e10.sortColumn), (null == e10 ? void 0 : e10.sortOrder) && r10.set("sortOrder", e10.sortOrder), (null == e10 ? void 0 : e10.search) && r10.set("search", e10.search);
            let n10 = r10.toString(), i10 = n10 ? `${t10.url}/bucket?${n10}` : `${t10.url}/bucket`;
            return await uR(t10.fetch, i10, { headers: t10.headers });
          });
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uI(t10.fetch, `${t10.url}/bucket/${e10}`, {}, { headers: t10.headers }));
        }
        from(e10) {
          var t10 = this;
          if (!(!(!e10 || "string" != typeof e10 || 0 === e10.length || e10.length > 100 || e10.trim() !== e10 || e10.includes("/") || e10.includes("\\")) && /^[\w!.\*'() &$@=;:+,?-]+$/.test(e10))) throw new ub("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
          let r10 = new uf({ baseUrl: this.url, catalogName: e10, auth: { type: "custom", getHeaders: async () => t10.headers }, fetch: this.fetch }), n10 = this.shouldThrowOnError;
          return new Proxy(r10, { get(e11, t11) {
            let r11 = e11[t11];
            return "function" != typeof r11 ? r11 : async (...t12) => {
              try {
                return { data: await r11.apply(e11, t12), error: null };
              } catch (e12) {
                if (n10) throw e12;
                return { data: null, error: e12 };
              }
            };
          } });
        }
      }, uq = class extends u$ {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), uy(uy({}, uH), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async createIndex(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/CreateIndex`, e10, { headers: t10.headers }) || {});
        }
        async getIndex(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await uj.post(r10.fetch, `${r10.url}/GetIndex`, { vectorBucketName: e10, indexName: t10 }, { headers: r10.headers }));
        }
        async listIndexes(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/ListIndexes`, e10, { headers: t10.headers }));
        }
        async deleteIndex(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await uj.post(r10.fetch, `${r10.url}/DeleteIndex`, { vectorBucketName: e10, indexName: t10 }, { headers: r10.headers }) || {});
        }
      }, uK = class extends u$ {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), uy(uy({}, uH), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async putVectors(e10) {
          var t10 = this;
          if (e10.vectors.length < 1 || e10.vectors.length > 500) throw Error("Vector batch size must be between 1 and 500 items");
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/PutVectors`, e10, { headers: t10.headers }) || {});
        }
        async getVectors(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/GetVectors`, e10, { headers: t10.headers }));
        }
        async listVectors(e10) {
          var t10 = this;
          if (void 0 !== e10.segmentCount) {
            if (e10.segmentCount < 1 || e10.segmentCount > 16) throw Error("segmentCount must be between 1 and 16");
            if (void 0 !== e10.segmentIndex && (e10.segmentIndex < 0 || e10.segmentIndex >= e10.segmentCount)) throw Error(`segmentIndex must be between 0 and ${e10.segmentCount - 1}`);
          }
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/ListVectors`, e10, { headers: t10.headers }));
        }
        async queryVectors(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/QueryVectors`, e10, { headers: t10.headers }));
        }
        async deleteVectors(e10) {
          var t10 = this;
          if (e10.keys.length < 1 || e10.keys.length > 500) throw Error("Keys batch size must be between 1 and 500 items");
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/DeleteVectors`, e10, { headers: t10.headers }) || {});
        }
      }, uJ = class extends u$ {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), uy(uy({}, uH), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async createBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/CreateVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }) || {});
        }
        async getBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/GetVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }));
        }
        async listBuckets(e10 = {}) {
          var t10 = this;
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/ListVectorBuckets`, e10, { headers: t10.headers }));
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await uj.post(t10.fetch, `${t10.url}/DeleteVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }) || {});
        }
      }, uF = class extends uJ {
        constructor(e10, t10 = {}) {
          super(e10, t10.headers || {}, t10.fetch);
        }
        from(e10) {
          return new uz(this.url, this.headers, e10, this.fetch);
        }
        async createBucket(e10) {
          return super.createBucket.call(this, e10);
        }
        async getBucket(e10) {
          return super.getBucket.call(this, e10);
        }
        async listBuckets(e10 = {}) {
          return super.listBuckets.call(this, e10);
        }
        async deleteBucket(e10) {
          return super.deleteBucket.call(this, e10);
        }
      }, uz = class extends uq {
        constructor(e10, t10, r10, n10) {
          super(e10, t10, n10), this.vectorBucketName = r10;
        }
        async createIndex(e10) {
          return super.createIndex.call(this, uy(uy({}, e10), {}, { vectorBucketName: this.vectorBucketName }));
        }
        async listIndexes(e10 = {}) {
          return super.listIndexes.call(this, uy(uy({}, e10), {}, { vectorBucketName: this.vectorBucketName }));
        }
        async getIndex(e10) {
          return super.getIndex.call(this, this.vectorBucketName, e10);
        }
        async deleteIndex(e10) {
          return super.deleteIndex.call(this, this.vectorBucketName, e10);
        }
        index(e10) {
          return new uV(this.url, this.headers, this.vectorBucketName, e10, this.fetch);
        }
      }, uV = class extends uK {
        constructor(e10, t10, r10, n10, i10) {
          super(e10, t10, i10), this.vectorBucketName = r10, this.indexName = n10;
        }
        async putVectors(e10) {
          return super.putVectors.call(this, uy(uy({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async getVectors(e10) {
          return super.getVectors.call(this, uy(uy({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async listVectors(e10 = {}) {
          return super.listVectors.call(this, uy(uy({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async queryVectors(e10) {
          return super.queryVectors.call(this, uy(uy({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async deleteVectors(e10) {
          return super.deleteVectors.call(this, uy(uy({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
      }, uG = class extends uB {
        constructor(e10, t10 = {}, r10, n10) {
          super(e10, t10, r10, n10);
        }
        from(e10) {
          return new uM(this.url, this.headers, e10, this.fetch);
        }
        get vectors() {
          return new uF(this.url + "/vector", { headers: this.headers, fetch: this.fetch });
        }
        get analytics() {
          return new uW(this.url + "/iceberg", this.headers, this.fetch);
        }
      };
      let uX = "2.108.2", uY = { "X-Client-Info": `gotrue-js/${uX}` }, uZ = "X-Supabase-Api-Version", uQ = { "2024-01-01": { timestamp: Date.parse("2024-01-01T00:00:00.0Z"), name: "2024-01-01" } }, u0 = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
      class u1 extends Error {
        constructor(e10, t10, r10) {
          super(e10), this.__isAuthError = true, this.name = "AuthError", this.status = t10, this.code = r10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, code: this.code };
        }
      }
      function u2(e10) {
        return "object" == typeof e10 && null !== e10 && "__isAuthError" in e10;
      }
      class u5 extends u1 {
        constructor(e10, t10, r10) {
          super(e10, t10, r10), this.name = "AuthApiError", this.status = t10, this.code = r10;
        }
      }
      class u6 extends u1 {
        constructor(e10, t10) {
          super(e10), this.name = "AuthUnknownError", this.originalError = t10;
        }
      }
      class u3 extends u1 {
        constructor(e10, t10, r10, n10) {
          super(e10, r10, n10), this.name = t10, this.status = r10;
        }
      }
      class u4 extends u3 {
        constructor() {
          super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
        }
      }
      function u8(e10) {
        return u2(e10) && "AuthSessionMissingError" === e10.name;
      }
      class u9 extends u3 {
        constructor() {
          super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
        }
      }
      class u7 extends u3 {
        constructor(e10) {
          super(e10, "AuthInvalidCredentialsError", 400, void 0);
        }
      }
      class he extends u3 {
        constructor(e10, t10 = null) {
          super(e10, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
        }
      }
      class ht extends u3 {
        constructor() {
          super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found");
        }
      }
      class hr extends u3 {
        constructor(e10, t10) {
          super(e10, "AuthRetryableFetchError", t10, void 0);
        }
      }
      function hn(e10) {
        return u2(e10) && "AuthRetryableFetchError" === e10.name;
      }
      class hi extends u3 {
        constructor(e10 = "Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)") {
          super(e10, "AuthRefreshDiscardedError", 409, void 0);
        }
      }
      class ha extends u3 {
        constructor(e10, t10, r10) {
          super(e10, "AuthWeakPasswordError", t10, "weak_password"), this.reasons = r10;
        }
        toJSON() {
          return Object.assign(Object.assign({}, super.toJSON()), { reasons: this.reasons });
        }
      }
      class hs extends u3 {
        constructor(e10) {
          super(e10, "AuthInvalidJwtError", 400, "invalid_jwt");
        }
      }
      let ho = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), hl = " 	\n\r=".split(""), hc = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < hl.length; t10 += 1) e10[hl[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < ho.length; t10 += 1) e10[ho[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function hu(e10, t10, r10) {
        if (null !== e10) for (t10.queue = t10.queue << 8 | e10, t10.queuedBits += 8; t10.queuedBits >= 6; ) r10(ho[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
        else if (t10.queuedBits > 0) for (t10.queue = t10.queue << 6 - t10.queuedBits, t10.queuedBits = 6; t10.queuedBits >= 6; ) r10(ho[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
      }
      function hh(e10, t10, r10) {
        let n10 = hc[e10];
        if (n10 > -1) for (t10.queue = t10.queue << 6 | n10, t10.queuedBits += 6; t10.queuedBits >= 8; ) r10(t10.queue >> t10.queuedBits - 8 & 255), t10.queuedBits -= 8;
        else if (-2 === n10) return;
        else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e10)}"`);
      }
      function hd(e10) {
        let t10 = [], r10 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, n10 = { utf8seq: 0, codepoint: 0 }, i10 = { queue: 0, queuedBits: 0 }, a10 = (e11) => {
          !function(e12, t11, r11) {
            if (0 === t11.utf8seq) {
              if (e12 <= 127) return r11(e12);
              for (let r12 = 1; r12 < 6; r12 += 1) if ((e12 >> 7 - r12 & 1) == 0) {
                t11.utf8seq = r12;
                break;
              }
              if (2 === t11.utf8seq) t11.codepoint = 31 & e12;
              else if (3 === t11.utf8seq) t11.codepoint = 15 & e12;
              else if (4 === t11.utf8seq) t11.codepoint = 7 & e12;
              else throw Error("Invalid UTF-8 sequence");
              t11.utf8seq -= 1;
            } else if (t11.utf8seq > 0) {
              if (e12 <= 127) throw Error("Invalid UTF-8 sequence");
              t11.codepoint = t11.codepoint << 6 | 63 & e12, t11.utf8seq -= 1, 0 === t11.utf8seq && r11(t11.codepoint);
            }
          }(e11, n10, r10);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) hh(e10.charCodeAt(t11), i10, a10);
        return t10.join("");
      }
      function hp(e10) {
        let t10 = [], r10 = { queue: 0, queuedBits: 0 }, n10 = (e11) => {
          t10.push(e11);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) hh(e10.charCodeAt(t11), r10, n10);
        return new Uint8Array(t10);
      }
      function hf(e10) {
        let t10 = [], r10 = { queue: 0, queuedBits: 0 }, n10 = (e11) => {
          t10.push(e11);
        };
        return e10.forEach((e11) => hu(e11, r10, n10)), hu(null, r10, n10), t10.join("");
      }
      let hg = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11), hm = async (e10, t10, r10) => {
        await e10.setItem(t10, JSON.stringify(r10));
      }, hy = async (e10, t10) => {
        let r10 = await e10.getItem(t10);
        if (!r10) return null;
        try {
          return JSON.parse(r10);
        } catch (e11) {
          return null;
        }
      }, hb = async (e10, t10) => {
        await e10.removeItem(t10);
      };
      class hw {
        constructor() {
          this.promise = new hw.promiseConstructor((e10, t10) => {
            this.resolve = e10, this.reject = t10;
          });
        }
      }
      function hv(e10) {
        let t10 = e10.split(".");
        if (3 !== t10.length) throw new hs("Invalid JWT structure");
        for (let e11 = 0; e11 < t10.length; e11++) if (!u0.test(t10[e11])) throw new hs("JWT not in base64url format");
        return { header: JSON.parse(hd(t10[0])), payload: JSON.parse(hd(t10[1])), signature: hp(t10[2]), raw: { header: t10[0], payload: t10[1] } };
      }
      async function h_(e10) {
        return await new Promise((t10) => {
          setTimeout(() => t10(null), e10);
        });
      }
      function hx(e10) {
        return ("0" + e10.toString(16)).substr(-2);
      }
      async function hE(e10) {
        let t10 = new TextEncoder().encode(e10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", t10))).map((e11) => String.fromCharCode(e11)).join("");
      }
      async function hk(e10) {
        return "u" > typeof crypto && void 0 !== crypto.subtle && "u" > typeof TextEncoder ? btoa(await hE(e10)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : (console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), e10);
      }
      async function hS(e10, t10, r10 = false) {
        let n10 = function() {
          let e11 = new Uint32Array(56);
          if ("u" < typeof crypto) {
            let e12 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", t11 = e12.length, r11 = "";
            for (let n11 = 0; n11 < 56; n11++) r11 += e12.charAt(Math.floor(Math.random() * t11));
            return r11;
          }
          return crypto.getRandomValues(e11), Array.from(e11, hx).join("");
        }(), i10 = n10;
        r10 && (i10 += "/recovery"), await hm(e10, `${t10}-code-verifier`, i10);
        let a10 = await hk(n10), s10 = n10 === a10 ? "plain" : "s256";
        return [a10, s10];
      }
      hw.promiseConstructor = Promise;
      let hT = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i, hA = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      function hR(e10) {
        if (!hA.test(e10)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
      function hC(e10) {
        if (!e10.passkey) throw Error("@supabase/auth-js: the passkey API is experimental and disabled by default. Enable it by passing `auth: { experimental: { passkey: true } }` to createClient (or to the GoTrueClient constructor).");
      }
      function hO() {
        return new Proxy({}, { get: (e10, t10) => {
          if ("__isUserNotAvailableProxy" === t10) return true;
          if ("symbol" == typeof t10) {
            let e11 = t10.toString();
            if ("Symbol(Symbol.toPrimitive)" === e11 || "Symbol(Symbol.toStringTag)" === e11 || "Symbol(util.inspect.custom)" === e11) return;
          }
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t10}" property of the session object is not supported. Please use getUser() instead.`);
        }, set: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        }, deleteProperty: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        } });
      }
      function hP(e10) {
        return JSON.parse(JSON.stringify(e10));
      }
      let hI = (e10) => {
        if ("object" == typeof e10 && null !== e10) {
          if ("string" == typeof e10.msg) return e10.msg;
          if ("string" == typeof e10.message) return e10.message;
          if ("string" == typeof e10.error_description) return e10.error_description;
          if ("string" == typeof e10.error) return e10.error;
        }
        return JSON.stringify(e10);
      }, hj = [500, 501, 502, 503, 504, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530];
      async function h$(e10) {
        var t10;
        let r10, n10;
        if (!("object" == typeof e10 && null !== e10 && "status" in e10 && "ok" in e10 && "json" in e10 && "function" == typeof e10.json)) throw new hr(hI(e10), 0);
        if (hj.includes(e10.status)) throw new hr(hI(e10), e10.status);
        try {
          r10 = await e10.json();
        } catch (e11) {
          throw new u6(hI(e11), e11);
        }
        let i10 = function(e11) {
          let t11 = e11.headers.get(uZ);
          if (!t11 || !t11.match(hT)) return null;
          try {
            return /* @__PURE__ */ new Date(`${t11}T00:00:00.0Z`);
          } catch (e12) {
            return null;
          }
        }(e10);
        if (i10 && i10.getTime() >= uQ["2024-01-01"].timestamp && "object" == typeof r10 && r10 && "string" == typeof r10.code ? n10 = r10.code : "object" == typeof r10 && r10 && "string" == typeof r10.error_code && (n10 = r10.error_code), n10) {
          if ("weak_password" === n10) throw new ha(hI(r10), e10.status, (null == (t10 = r10.weak_password) ? void 0 : t10.reasons) || []);
          else if ("session_not_found" === n10) throw new u4();
        } else if ("object" == typeof r10 && r10 && "object" == typeof r10.weak_password && r10.weak_password && Array.isArray(r10.weak_password.reasons) && r10.weak_password.reasons.length && r10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true)) throw new ha(hI(r10), e10.status, r10.weak_password.reasons);
        throw new u5(hI(r10), e10.status || 500, n10);
      }
      async function hN(e10, t10, r10, n10) {
        var i10;
        let a10 = Object.assign({}, null == n10 ? void 0 : n10.headers);
        a10[uZ] || (a10[uZ] = uQ["2024-01-01"].name), (null == n10 ? void 0 : n10.jwt) && (a10.Authorization = `Bearer ${n10.jwt}`);
        let s10 = null != (i10 = null == n10 ? void 0 : n10.query) ? i10 : {};
        (null == n10 ? void 0 : n10.redirectTo) && (s10.redirect_to = n10.redirectTo);
        let o10 = Object.keys(s10).length ? "?" + new URLSearchParams(s10).toString() : "", l10 = await hU(e10, t10, r10 + o10, { headers: a10, noResolveJson: null == n10 ? void 0 : n10.noResolveJson }, {}, null == n10 ? void 0 : n10.body);
        return (null == n10 ? void 0 : n10.xform) ? null == n10 ? void 0 : n10.xform(l10) : { data: Object.assign({}, l10), error: null };
      }
      async function hU(e10, t10, r10, n10, i10, a10) {
        let s10, o10, l10 = (o10 = { method: t10, headers: (null == n10 ? void 0 : n10.headers) || {} }, "GET" === t10 ? o10 : (o10.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, null == n10 ? void 0 : n10.headers), o10.body = JSON.stringify(a10), Object.assign(Object.assign({}, o10), i10)));
        try {
          s10 = await e10(r10, Object.assign({}, l10));
        } catch (e11) {
          throw console.error(e11), new hr(hI(e11), 0);
        }
        if (s10.ok || await h$(s10), null == n10 ? void 0 : n10.noResolveJson) return s10;
        try {
          return await s10.json();
        } catch (e11) {
          await h$(e11);
        }
      }
      function hD(e10) {
        var t10, r10, n10;
        let i10 = null;
        (n10 = e10).access_token && n10.refresh_token && n10.expires_in && (i10 = Object.assign({}, e10), e10.expires_at || (i10.expires_at = (r10 = e10.expires_in, Math.round(Date.now() / 1e3) + r10)));
        return { data: { session: i10, user: null != (t10 = e10.user) ? t10 : "string" == typeof (null == e10 ? void 0 : e10.id) ? e10 : null }, error: null };
      }
      function hL(e10) {
        let t10 = hD(e10);
        return !t10.error && e10.weak_password && "object" == typeof e10.weak_password && Array.isArray(e10.weak_password.reasons) && e10.weak_password.reasons.length && e10.weak_password.message && "string" == typeof e10.weak_password.message && e10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true) && (t10.data.weak_password = e10.weak_password), t10;
      }
      function hM(e10) {
        var t10;
        return { data: { user: null != (t10 = e10.user) ? t10 : e10 }, error: null };
      }
      function hH(e10) {
        return { data: e10, error: null };
      }
      function hB(e10) {
        let { action_link: t10, email_otp: r10, hashed_token: n10, redirect_to: i10, verification_type: a10 } = e10;
        return { data: { properties: { action_link: t10, email_otp: r10, hashed_token: n10, redirect_to: i10, verification_type: a10 }, user: Object.assign({}, cc(e10, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])) }, error: null };
      }
      function hW(e10) {
        return e10;
      }
      let hq = ["global", "local", "others"];
      class hK {
        constructor({ url: e10 = "", headers: t10 = {}, fetch: r10, experimental: n10 }) {
          this.url = e10, this.headers = t10, this.fetch = hg(r10), this.experimental = null != n10 ? n10 : {}, this.mfa = { listFactors: this._listFactors.bind(this), deleteFactor: this._deleteFactor.bind(this) }, this.oauth = { listClients: this._listOAuthClients.bind(this), createClient: this._createOAuthClient.bind(this), getClient: this._getOAuthClient.bind(this), updateClient: this._updateOAuthClient.bind(this), deleteClient: this._deleteOAuthClient.bind(this), regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this) }, this.customProviders = { listProviders: this._listCustomProviders.bind(this), createProvider: this._createCustomProvider.bind(this), getProvider: this._getCustomProvider.bind(this), updateProvider: this._updateCustomProvider.bind(this), deleteProvider: this._deleteCustomProvider.bind(this) }, this.passkey = { listPasskeys: this._adminListPasskeys.bind(this), deletePasskey: this._adminDeletePasskey.bind(this) };
        }
        async signOut(e10, t10 = hq[0]) {
          if (0 > hq.indexOf(t10)) throw Error(`@supabase/auth-js: Parameter scope must be one of ${hq.join(", ")}`);
          try {
            return await hN(this.fetch, "POST", `${this.url}/logout?scope=${t10}`, { headers: this.headers, jwt: e10, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async inviteUserByEmail(e10, t10 = {}) {
          try {
            return await hN(this.fetch, "POST", `${this.url}/invite`, { body: { email: e10, data: t10.data }, headers: this.headers, redirectTo: t10.redirectTo, xform: hM });
          } catch (e11) {
            if (u2(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async generateLink(e10) {
          try {
            let { options: t10 } = e10, r10 = cc(e10, ["options"]), n10 = Object.assign(Object.assign({}, r10), t10);
            return "newEmail" in r10 && (n10.new_email = null == r10 ? void 0 : r10.newEmail, delete n10.newEmail), await hN(this.fetch, "POST", `${this.url}/admin/generate_link`, { body: n10, headers: this.headers, xform: hB, redirectTo: null == t10 ? void 0 : t10.redirectTo });
          } catch (e11) {
            if (u2(e11)) return { data: { properties: null, user: null }, error: e11 };
            throw e11;
          }
        }
        async createUser(e10) {
          try {
            return await hN(this.fetch, "POST", `${this.url}/admin/users`, { body: e10, headers: this.headers, xform: hM });
          } catch (e11) {
            if (u2(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async listUsers(e10) {
          var t10, r10, n10, i10, a10, s10, o10;
          try {
            let l10 = { nextPage: null, lastPage: 0, total: 0 }, c10 = await hN(this.fetch, "GET", `${this.url}/admin/users`, { headers: this.headers, noResolveJson: true, query: { page: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.page) ? void 0 : t10.toString()) ? r10 : "", per_page: null != (i10 = null == (n10 = null == e10 ? void 0 : e10.perPage) ? void 0 : n10.toString()) ? i10 : "" }, xform: hW });
            if (c10.error) throw c10.error;
            let u10 = await c10.json(), h10 = null != (a10 = c10.headers.get("x-total-count")) ? a10 : 0, d2 = null != (o10 = null == (s10 = c10.headers.get("link")) ? void 0 : s10.split(",")) ? o10 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l10[`${r11}Page`] = t11;
            }), l10.total = parseInt(h10)), { data: Object.assign(Object.assign({}, u10), l10), error: null };
          } catch (e11) {
            if (u2(e11)) return { data: { users: [] }, error: e11 };
            throw e11;
          }
        }
        async getUserById(e10) {
          hR(e10);
          try {
            return await hN(this.fetch, "GET", `${this.url}/admin/users/${e10}`, { headers: this.headers, xform: hM });
          } catch (e11) {
            if (u2(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async updateUserById(e10, t10) {
          hR(e10);
          try {
            return await hN(this.fetch, "PUT", `${this.url}/admin/users/${e10}`, { body: t10, headers: this.headers, xform: hM });
          } catch (e11) {
            if (u2(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async deleteUser(e10, t10 = false) {
          hR(e10);
          try {
            return await hN(this.fetch, "DELETE", `${this.url}/admin/users/${e10}`, { headers: this.headers, body: { should_soft_delete: t10 }, xform: hM });
          } catch (e11) {
            if (u2(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async _listFactors(e10) {
          hR(e10.userId);
          try {
            let { data: t10, error: r10 } = await hN(this.fetch, "GET", `${this.url}/admin/users/${e10.userId}/factors`, { headers: this.headers, xform: (e11) => ({ data: { factors: e11 }, error: null }) });
            return { data: t10, error: r10 };
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteFactor(e10) {
          hR(e10.userId), hR(e10.id);
          try {
            return { data: await hN(this.fetch, "DELETE", `${this.url}/admin/users/${e10.userId}/factors/${e10.id}`, { headers: this.headers }), error: null };
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _listOAuthClients(e10) {
          var t10, r10, n10, i10, a10, s10, o10;
          try {
            let l10 = { nextPage: null, lastPage: 0, total: 0 }, c10 = await hN(this.fetch, "GET", `${this.url}/admin/oauth/clients`, { headers: this.headers, noResolveJson: true, query: { page: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.page) ? void 0 : t10.toString()) ? r10 : "", per_page: null != (i10 = null == (n10 = null == e10 ? void 0 : e10.perPage) ? void 0 : n10.toString()) ? i10 : "" }, xform: hW });
            if (c10.error) throw c10.error;
            let u10 = await c10.json(), h10 = null != (a10 = c10.headers.get("x-total-count")) ? a10 : 0, d2 = null != (o10 = null == (s10 = c10.headers.get("link")) ? void 0 : s10.split(",")) ? o10 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l10[`${r11}Page`] = t11;
            }), l10.total = parseInt(h10)), { data: Object.assign(Object.assign({}, u10), l10), error: null };
          } catch (e11) {
            if (u2(e11)) return { data: { clients: [] }, error: e11 };
            throw e11;
          }
        }
        async _createOAuthClient(e10) {
          try {
            return await hN(this.fetch, "POST", `${this.url}/admin/oauth/clients`, { body: e10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _getOAuthClient(e10) {
          try {
            return await hN(this.fetch, "GET", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _updateOAuthClient(e10, t10) {
          try {
            return await hN(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${e10}`, { body: t10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteOAuthClient(e10) {
          try {
            return await hN(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _regenerateOAuthClientSecret(e10) {
          try {
            return await hN(this.fetch, "POST", `${this.url}/admin/oauth/clients/${e10}/regenerate_secret`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _listCustomProviders(e10) {
          try {
            let t10 = {};
            return (null == e10 ? void 0 : e10.type) && (t10.type = e10.type), await hN(this.fetch, "GET", `${this.url}/admin/custom-providers`, { headers: this.headers, query: t10, xform: (e11) => {
              var t11;
              return { data: { providers: null != (t11 = null == e11 ? void 0 : e11.providers) ? t11 : [] }, error: null };
            } });
          } catch (e11) {
            if (u2(e11)) return { data: { providers: [] }, error: e11 };
            throw e11;
          }
        }
        async _createCustomProvider(e10) {
          try {
            return await hN(this.fetch, "POST", `${this.url}/admin/custom-providers`, { body: e10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _getCustomProvider(e10) {
          try {
            return await hN(this.fetch, "GET", `${this.url}/admin/custom-providers/${e10}`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _updateCustomProvider(e10, t10) {
          try {
            return await hN(this.fetch, "PUT", `${this.url}/admin/custom-providers/${e10}`, { body: t10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteCustomProvider(e10) {
          try {
            return await hN(this.fetch, "DELETE", `${this.url}/admin/custom-providers/${e10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _adminListPasskeys(e10) {
          hC(this.experimental), hR(e10.userId);
          try {
            return await hN(this.fetch, "GET", `${this.url}/admin/users/${e10.userId}/passkeys`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _adminDeletePasskey(e10) {
          hC(this.experimental), hR(e10.userId), hR(e10.passkeyId);
          try {
            return await hN(this.fetch, "DELETE", `${this.url}/admin/users/${e10.userId}/passkeys/${e10.passkeyId}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }
      function hJ(e10 = {}) {
        return { getItem: (t10) => e10[t10] || null, setItem: (t10, r10) => {
          e10[t10] = r10;
        }, removeItem: (t10) => {
          delete e10[t10];
        } };
      }
      class hF extends Error {
        constructor(e10) {
          super(e10), this.isAcquireTimeout = true;
        }
      }
      function hz(e10) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(e10)) throw Error(`@supabase/auth-js: Address "${e10}" is invalid.`);
        return e10.toLowerCase();
      }
      class hV extends Error {
        constructor({ message: e10, code: t10, cause: r10, name: n10 }) {
          var i10;
          super(e10, { cause: r10 }), this.__isWebAuthnError = true, this.name = null != (i10 = null != n10 ? n10 : r10 instanceof Error ? r10.name : void 0) ? i10 : "Unknown Error", this.code = t10;
        }
        toJSON() {
          return { name: this.name, message: this.message, code: this.code };
        }
      }
      class hG extends hV {
        constructor(e10, t10) {
          super({ code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: t10, message: e10 }), this.name = "WebAuthnUnknownError", this.originalError = t10;
        }
      }
      let hX = new class {
        createNewAbortSignal() {
          if (this.controller) {
            let e11 = Error("Cancelling existing WebAuthn API call for new one");
            e11.name = "AbortError", this.controller.abort(e11);
          }
          let e10 = new AbortController();
          return this.controller = e10, e10.signal;
        }
        cancelCeremony() {
          if (this.controller) {
            let e10 = Error("Manually cancelling existing WebAuthn API call");
            e10.name = "AbortError", this.controller.abort(e10), this.controller = void 0;
          }
        }
      }();
      function hY(e10) {
        if (!e10) throw Error("Credential creation options are required");
        if ("u" > typeof PublicKeyCredential && "parseCreationOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseCreationOptionsFromJSON) return PublicKeyCredential.parseCreationOptionsFromJSON(e10);
        let { challenge: t10, user: r10, excludeCredentials: n10 } = e10, i10 = cc(e10, ["challenge", "user", "excludeCredentials"]), a10 = hp(t10).buffer, s10 = Object.assign(Object.assign({}, r10), { id: hp(r10.id).buffer }), o10 = Object.assign(Object.assign({}, i10), { challenge: a10, user: s10 });
        if (n10 && n10.length > 0) {
          o10.excludeCredentials = Array(n10.length);
          for (let e11 = 0; e11 < n10.length; e11++) {
            let t11 = n10[e11];
            o10.excludeCredentials[e11] = Object.assign(Object.assign({}, t11), { id: hp(t11.id).buffer, type: t11.type || "public-key", transports: t11.transports });
          }
        }
        return o10;
      }
      function hZ(e10) {
        if (!e10) throw Error("Credential request options are required");
        if ("u" > typeof PublicKeyCredential && "parseRequestOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseRequestOptionsFromJSON) return PublicKeyCredential.parseRequestOptionsFromJSON(e10);
        let { challenge: t10, allowCredentials: r10 } = e10, n10 = cc(e10, ["challenge", "allowCredentials"]), i10 = hp(t10).buffer, a10 = Object.assign(Object.assign({}, n10), { challenge: i10 });
        if (r10 && r10.length > 0) {
          a10.allowCredentials = Array(r10.length);
          for (let e11 = 0; e11 < r10.length; e11++) {
            let t11 = r10[e11];
            a10.allowCredentials[e11] = Object.assign(Object.assign({}, t11), { id: hp(t11.id).buffer, type: t11.type || "public-key", transports: t11.transports });
          }
        }
        return a10;
      }
      function hQ(e10) {
        var t10;
        return "toJSON" in e10 && "function" == typeof e10.toJSON ? e10.toJSON() : { id: e10.id, rawId: e10.id, response: { attestationObject: hf(new Uint8Array(e10.response.attestationObject)), clientDataJSON: hf(new Uint8Array(e10.response.clientDataJSON)) }, type: "public-key", clientExtensionResults: e10.getClientExtensionResults(), authenticatorAttachment: null != (t10 = e10.authenticatorAttachment) ? t10 : void 0 };
      }
      function h0(e10) {
        var t10;
        if ("toJSON" in e10 && "function" == typeof e10.toJSON) return e10.toJSON();
        let r10 = e10.getClientExtensionResults(), n10 = e10.response;
        return { id: e10.id, rawId: e10.id, response: { authenticatorData: hf(new Uint8Array(n10.authenticatorData)), clientDataJSON: hf(new Uint8Array(n10.clientDataJSON)), signature: hf(new Uint8Array(n10.signature)), userHandle: n10.userHandle ? hf(new Uint8Array(n10.userHandle)) : void 0 }, type: "public-key", clientExtensionResults: r10, authenticatorAttachment: null != (t10 = e10.authenticatorAttachment) ? t10 : void 0 };
      }
      function h1(e10) {
        return "localhost" === e10 || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e10);
      }
      async function h2(e10) {
        try {
          let t10 = await navigator.credentials.create(e10);
          if (!t10) return { data: null, error: new hG("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new hG("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            var r10, n10, i10;
            let { publicKey: a10 } = t11;
            if (!a10) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new hV({ message: "Registration ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("ConstraintError" === e11.name) {
              if ((null == (r10 = a10.authenticatorSelection) ? void 0 : r10.requireResidentKey) === true) return new hV({ message: "Discoverable credentials were required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT", cause: e11 });
              else if ("conditional" === t11.mediation && (null == (n10 = a10.authenticatorSelection) ? void 0 : n10.userVerification) === "required") return new hV({ message: "User verification was required during automatic registration but it could not be performed", code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE", cause: e11 });
              else if ((null == (i10 = a10.authenticatorSelection) ? void 0 : i10.userVerification) === "required") return new hV({ message: "User verification was required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT", cause: e11 });
            } else if ("InvalidStateError" === e11.name) return new hV({ message: "The authenticator was previously registered", code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED", cause: e11 });
            else if ("NotAllowedError" === e11.name) return new hV({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("NotSupportedError" === e11.name) return new hV(0 === a10.pubKeyCredParams.filter((e12) => "public-key" === e12.type).length ? { message: 'No entry in pubKeyCredParams was of type "public-key"', code: "ERROR_MALFORMED_PUBKEYCREDPARAMS", cause: e11 } : { message: "No available authenticator supported any of the specified pubKeyCredParams algorithms", code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!h1(t12)) return new hV({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (a10.rp.id !== t12) return new hV({ message: `The RP ID "${a10.rp.id}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("TypeError" === e11.name) {
              if (a10.user.id.byteLength < 1 || a10.user.id.byteLength > 64) return new hV({ message: "User ID was not between 1 and 64 characters", code: "ERROR_INVALID_USER_ID_LENGTH", cause: e11 });
            } else if ("UnknownError" === e11.name) return new hV({ message: "The authenticator was unable to process the specified options, or could not create a new credential", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new hV({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      async function h5(e10) {
        try {
          let t10 = await navigator.credentials.get(e10);
          if (!t10) return { data: null, error: new hG("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new hG("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            let { publicKey: r10 } = t11;
            if (!r10) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new hV({ message: "Authentication ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("NotAllowedError" === e11.name) return new hV({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!h1(t12)) return new hV({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (r10.rpId !== t12) return new hV({ message: `The RP ID "${r10.rpId}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("UnknownError" === e11.name) return new hV({ message: "The authenticator was unable to process the specified options, or could not create a new assertion signature", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new hV({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      let h6 = { hints: ["security-key"], authenticatorSelection: { authenticatorAttachment: "cross-platform", requireResidentKey: false, userVerification: "preferred", residentKey: "discouraged" }, attestation: "direct" }, h3 = { userVerification: "preferred", hints: ["security-key"], attestation: "direct" };
      function h4(...e10) {
        let t10 = (e11) => null !== e11 && "object" == typeof e11 && !Array.isArray(e11), r10 = (e11) => e11 instanceof ArrayBuffer || ArrayBuffer.isView(e11), n10 = {};
        for (let i10 of e10) if (i10) for (let e11 in i10) {
          let a10 = i10[e11];
          if (void 0 !== a10) if (Array.isArray(a10)) n10[e11] = a10;
          else if (r10(a10)) n10[e11] = a10;
          else if (t10(a10)) {
            let r11 = n10[e11];
            t10(r11) ? n10[e11] = h4(r11, a10) : n10[e11] = h4(a10);
          } else n10[e11] = a10;
        }
        return n10;
      }
      class h8 {
        constructor(e10) {
          this.client = e10, this.enroll = this._enroll.bind(this), this.challenge = this._challenge.bind(this), this.verify = this._verify.bind(this), this.authenticate = this._authenticate.bind(this), this.register = this._register.bind(this);
        }
        async _enroll(e10) {
          return this.client.mfa.enroll(Object.assign(Object.assign({}, e10), { factorType: "webauthn" }));
        }
        async _challenge({ factorId: e10, webauthn: t10, friendlyName: r10, signal: n10 }, i10) {
          var a10, s10, o10, l10, c10;
          try {
            let { data: u10, error: h10 } = await this.client.mfa.challenge({ factorId: e10, webauthn: t10 });
            if (!u10) return { data: null, error: h10 };
            let d2 = null != n10 ? n10 : hX.createNewAbortSignal();
            if ("create" === u10.webauthn.type) {
              let { user: e11 } = u10.webauthn.credential_options.publicKey;
              if (!e11.name) if (r10) e11.name = `${e11.id}:${r10}`;
              else {
                let t11 = (await this.client.getUser()).data.user, r11 = (null == (a10 = null == t11 ? void 0 : t11.user_metadata) ? void 0 : a10.name) || (null == t11 ? void 0 : t11.email) || (null == t11 ? void 0 : t11.id) || "User";
                e11.name = `${e11.id}:${r11}`;
              }
              e11.displayName || (e11.displayName = e11.name);
            }
            switch (u10.webauthn.type) {
              case "create": {
                let t11 = (s10 = u10.webauthn.credential_options.publicKey, o10 = null == i10 ? void 0 : i10.create, h4(h6, s10, o10 || {})), { data: r11, error: n11 } = await h2({ publicKey: t11, signal: d2 });
                if (r11) return { data: { factorId: e10, challengeId: u10.id, webauthn: { type: u10.webauthn.type, credential_response: r11 } }, error: null };
                return { data: null, error: n11 };
              }
              case "request": {
                let t11 = (l10 = u10.webauthn.credential_options.publicKey, c10 = null == i10 ? void 0 : i10.request, h4(h3, l10, c10 || {})), { data: r11, error: n11 } = await h5(Object.assign(Object.assign({}, u10.webauthn.credential_options), { publicKey: t11, signal: d2 }));
                if (r11) return { data: { factorId: e10, challengeId: u10.id, webauthn: { type: u10.webauthn.type, credential_response: r11 } }, error: null };
                return { data: null, error: n11 };
              }
            }
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            return { data: null, error: new u6("Unexpected error in challenge", e11) };
          }
        }
        async _verify({ challengeId: e10, factorId: t10, webauthn: r10 }) {
          return this.client.mfa.verify({ factorId: t10, challengeId: e10, webauthn: r10 });
        }
        async _authenticate({ factorId: e10, webauthn: { rpId: t10, rpOrigins: r10, signal: n10 } = {} }, i10) {
          if (!t10) return { data: null, error: new u1("rpId is required for WebAuthn authentication") };
          try {
            1;
            return { data: null, error: new u6("Browser does not support WebAuthn", null) };
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            return { data: null, error: new u6("Unexpected error in authenticate", e11) };
          }
        }
        async _register({ friendlyName: e10, webauthn: { rpId: t10, rpOrigins: r10, signal: n10 } = {} }, i10) {
          if (!t10) return { data: null, error: new u1("rpId is required for WebAuthn registration") };
          try {
            1;
            return { data: null, error: new u6("Browser does not support WebAuthn", null) };
          } catch (e11) {
            if (u2(e11)) return { data: null, error: e11 };
            return { data: null, error: new u6("Unexpected error in register", e11) };
          }
        }
      }
      if ("object" != typeof globalThis) try {
        Object.defineProperty(Object.prototype, "__magic__", { get: function() {
          return this;
        }, configurable: true }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
      } catch (e10) {
        "u" > typeof self && (self.globalThis = self);
      }
      let h9 = { url: "http://localhost:9999", storageKey: "supabase.auth.token", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, headers: uY, flowType: "implicit", debug: false, hasCustomAuthorizationHeader: false, throwOnError: false, lockAcquireTimeout: 5e3, skipAutoInitialize: false, experimental: {} }, h7 = {};
      class de {
        get jwks() {
          var e10, t10;
          return null != (t10 = null == (e10 = h7[this.storageKey]) ? void 0 : e10.jwks) ? t10 : { keys: [] };
        }
        set jwks(e10) {
          h7[this.storageKey] = Object.assign(Object.assign({}, h7[this.storageKey]), { jwks: e10 });
        }
        get jwks_cached_at() {
          var e10, t10;
          return null != (t10 = null == (e10 = h7[this.storageKey]) ? void 0 : e10.cachedAt) ? t10 : Number.MIN_SAFE_INTEGER;
        }
        set jwks_cached_at(e10) {
          h7[this.storageKey] = Object.assign(Object.assign({}, h7[this.storageKey]), { cachedAt: e10 });
        }
        constructor(e10) {
          var t10, r10;
          this.userStorage = null, this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.autoRefreshTickTimeout = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.lastRefreshFailure = null, this._sessionRemovalEpoch = 0, this.initializePromise = null, this.detectSessionInUrl = true, this.hasCustomAuthorizationHeader = false, this.suppressGetSessionWarning = false, this.lock = null, this.lockAcquired = false, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log;
          const n10 = Object.assign(Object.assign({}, h9), e10);
          this.storageKey = n10.storageKey, this.instanceID = null != (t10 = de.nextInstanceID[this.storageKey]) ? t10 : 0, de.nextInstanceID[this.storageKey] = this.instanceID + 1, this.logDebugMessages = !!n10.debug, "function" == typeof n10.debug && (this.logger = n10.debug), this.instanceID, this.persistSession = n10.persistSession, this.autoRefreshToken = n10.autoRefreshToken, this.experimental = null != (r10 = n10.experimental) ? r10 : {}, this.admin = new hK({ url: n10.url, headers: n10.headers, fetch: n10.fetch, experimental: this.experimental }), this.url = n10.url, this.headers = n10.headers, this.fetch = hg(n10.fetch), this.detectSessionInUrl = n10.detectSessionInUrl, this.flowType = n10.flowType, this.hasCustomAuthorizationHeader = n10.hasCustomAuthorizationHeader, this.throwOnError = n10.throwOnError, this.lockAcquireTimeout = n10.lockAcquireTimeout, null != n10.lock && (this.lock = n10.lock), this.jwks || (this.jwks = { keys: [] }, this.jwks_cached_at = Number.MIN_SAFE_INTEGER), this.mfa = { verify: this._verify.bind(this), enroll: this._enroll.bind(this), unenroll: this._unenroll.bind(this), challenge: this._challenge.bind(this), listFactors: this._listFactors.bind(this), challengeAndVerify: this._challengeAndVerify.bind(this), getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this), webauthn: new h8(this) }, this.oauth = { getAuthorizationDetails: this._getAuthorizationDetails.bind(this), approveAuthorization: this._approveAuthorization.bind(this), denyAuthorization: this._denyAuthorization.bind(this), listGrants: this._listOAuthGrants.bind(this), revokeGrant: this._revokeOAuthGrant.bind(this) }, this.passkey = { startRegistration: this._startPasskeyRegistration.bind(this), verifyRegistration: this._verifyPasskeyRegistration.bind(this), startAuthentication: this._startPasskeyAuthentication.bind(this), verifyAuthentication: this._verifyPasskeyAuthentication.bind(this), list: this._listPasskeys.bind(this), update: this._updatePasskey.bind(this), delete: this._deletePasskey.bind(this) }, this.persistSession ? (n10.storage ? this.storage = n10.storage : (this.memoryStorage = {}, this.storage = hJ(this.memoryStorage)), n10.userStorage && (this.userStorage = n10.userStorage)) : (this.memoryStorage = {}, this.storage = hJ(this.memoryStorage)), n10.skipAutoInitialize || this.initialize().catch((e11) => {
            this._debug("#initialize()", "error", e11);
          });
        }
        isThrowOnErrorEnabled() {
          return this.throwOnError;
        }
        _returnResult(e10) {
          if (this.throwOnError && e10 && e10.error) throw e10.error;
          return e10;
        }
        _logPrefix() {
          return `GoTrueClient@${this.storageKey}:${this.instanceID} (${uX}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
        }
        _debug(...e10) {
          return this.logDebugMessages && this.logger(this._logPrefix(), ...e10), this;
        }
        async initialize() {
          return this.initializePromise || (this.initializePromise = (async () => null != this.lock ? await this._acquireLock(this.lockAcquireTimeout, async () => await this._initialize()) : await this._initialize())()), await this.initializePromise;
        }
        async _initialize() {
          try {
            return await this._recoverAndRefresh(), { error: null };
          } catch (e10) {
            if (u2(e10)) return this._returnResult({ error: e10 });
            return this._returnResult({ error: new u6("Unexpected error during initialization", e10) });
          } finally {
            await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
          }
        }
        async signInAnonymously(e10) {
          var t10, r10, n10;
          try {
            let { data: i10, error: a10 } = await hN(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { data: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.options) ? void 0 : t10.data) ? r10 : {}, gotrue_meta_security: { captcha_token: null == (n10 = null == e10 ? void 0 : e10.options) ? void 0 : n10.captchaToken } }, xform: hD });
            if (a10 || !i10) return this._returnResult({ data: { user: null, session: null }, error: a10 });
            let s10 = i10.session, o10 = i10.user;
            return i10.session && (await this._saveSession(i10.session), await this._notifyAllSubscribers("SIGNED_IN", s10)), this._returnResult({ data: { user: o10, session: s10 }, error: null });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signUp(e10) {
          var t10, r10, n10;
          try {
            let i10;
            if ("email" in e10) {
              let { email: r11, password: n11, options: a11 } = e10, s11 = null, o11 = null;
              "pkce" === this.flowType && ([s11, o11] = await hS(this.storage, this.storageKey)), i10 = await hN(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, redirectTo: null == a11 ? void 0 : a11.emailRedirectTo, body: { email: r11, password: n11, data: null != (t10 = null == a11 ? void 0 : a11.data) ? t10 : {}, gotrue_meta_security: { captcha_token: null == a11 ? void 0 : a11.captchaToken }, code_challenge: s11, code_challenge_method: o11 }, xform: hD });
            } else if ("phone" in e10) {
              let { phone: t11, password: a11, options: s11 } = e10;
              i10 = await hN(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { phone: t11, password: a11, data: null != (r10 = null == s11 ? void 0 : s11.data) ? r10 : {}, channel: null != (n10 = null == s11 ? void 0 : s11.channel) ? n10 : "sms", gotrue_meta_security: { captcha_token: null == s11 ? void 0 : s11.captchaToken } }, xform: hD });
            } else throw new u7("You must provide either an email or phone number and a password");
            let { data: a10, error: s10 } = i10;
            if (s10 || !a10) return await hb(this.storage, `${this.storageKey}-code-verifier`), this._returnResult({ data: { user: null, session: null }, error: s10 });
            let o10 = a10.session, l10 = a10.user;
            return a10.session && (await this._saveSession(a10.session), await this._notifyAllSubscribers("SIGNED_IN", o10)), this._returnResult({ data: { user: l10, session: o10 }, error: null });
          } catch (e11) {
            if (await hb(this.storage, `${this.storageKey}-code-verifier`), u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithPassword(e10) {
          try {
            let t10;
            if ("email" in e10) {
              let { email: r11, password: n11, options: i10 } = e10;
              t10 = await hN(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { email: r11, password: n11, gotrue_meta_security: { captcha_token: null == i10 ? void 0 : i10.captchaToken } }, xform: hL });
            } else if ("phone" in e10) {
              let { phone: r11, password: n11, options: i10 } = e10;
              t10 = await hN(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { phone: r11, password: n11, gotrue_meta_security: { captcha_token: null == i10 ? void 0 : i10.captchaToken } }, xform: hL });
            } else throw new u7("You must provide either an email or phone number and a password");
            let { data: r10, error: n10 } = t10;
            if (n10) return this._returnResult({ data: { user: null, session: null }, error: n10 });
            if (!r10 || !r10.session || !r10.user) {
              let e11 = new u9();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return r10.session && (await this._saveSession(r10.session), await this._notifyAllSubscribers("SIGNED_IN", r10.session)), this._returnResult({ data: Object.assign({ user: r10.user, session: r10.session }, r10.weak_password ? { weakPassword: r10.weak_password } : null), error: n10 });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithOAuth(e10) {
          var t10, r10, n10, i10;
          return await this._handleProviderSignIn(e10.provider, { redirectTo: null == (t10 = e10.options) ? void 0 : t10.redirectTo, scopes: null == (r10 = e10.options) ? void 0 : r10.scopes, queryParams: null == (n10 = e10.options) ? void 0 : n10.queryParams, skipBrowserRedirect: null == (i10 = e10.options) ? void 0 : i10.skipBrowserRedirect });
        }
        async exchangeCodeForSession(e10) {
          return (await this.initializePromise, null != this.lock) ? this._acquireLock(this.lockAcquireTimeout, async () => this._exchangeCodeForSession(e10)) : this._exchangeCodeForSession(e10);
        }
        async signInWithWeb3(e10) {
          let { chain: t10 } = e10;
          switch (t10) {
            case "ethereum":
              return await this.signInWithEthereum(e10);
            case "solana":
              return await this.signInWithSolana(e10);
            default:
              throw Error(`@supabase/auth-js: Unsupported chain "${t10}"`);
          }
        }
        async signInWithEthereum(e10) {
          var t10, r10, n10, i10, a10, s10, o10, l10, c10, u10, h10, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let { chain: u11, wallet: h11, statement: g2, options: m2 } = e10;
            if ("object" != typeof h11 || !(null == m2 ? void 0 : m2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            let y2 = new URL(null != (t10 = null == m2 ? void 0 : m2.url) ? t10 : window.location.href), b2 = await h11.request({ method: "eth_requestAccounts" }).then((e11) => e11).catch(() => {
              throw Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid");
            });
            if (!b2 || 0 === b2.length) throw Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");
            let w2 = hz(b2[0]), v2 = null == (r10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : r10.chainId;
            v2 || (v2 = parseInt(await h11.request({ method: "eth_chainId" }), 16)), p2 = function(e11) {
              var t11;
              let { chainId: r11, domain: n11, expirationTime: i11, issuedAt: a11 = /* @__PURE__ */ new Date(), nonce: s11, notBefore: o11, requestId: l11, resources: c11, scheme: u12, uri: h12, version: d3 } = e11;
              if (!Number.isInteger(r11)) throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r11}`);
              if (!n11) throw Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');
              if (s11 && s11.length < 8) throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${s11}`);
              if (!h12) throw Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');
              if ("1" !== d3) throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d3}`);
              if (null == (t11 = e11.statement) ? void 0 : t11.includes("\n")) throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e11.statement}`);
              let p3 = hz(e11.address), f3 = u12 ? `${u12}://${n11}` : n11, g3 = e11.statement ? `${e11.statement}
` : "", m3 = `${f3} wants you to sign in with your Ethereum account:
${p3}

${g3}`, y3 = `URI: ${h12}
Version: ${d3}
Chain ID: ${r11}${s11 ? `
Nonce: ${s11}` : ""}
Issued At: ${a11.toISOString()}`;
              if (i11 && (y3 += `
Expiration Time: ${i11.toISOString()}`), o11 && (y3 += `
Not Before: ${o11.toISOString()}`), l11 && (y3 += `
Request ID: ${l11}`), c11) {
                let e12 = "\nResources:";
                for (let t12 of c11) {
                  if (!t12 || "string" != typeof t12) throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t12}`);
                  e12 += `
- ${t12}`;
                }
                y3 += e12;
              }
              return `${m3}
${y3}`;
            }({ domain: y2.host, address: w2, statement: g2, uri: y2.href, version: "1", chainId: v2, nonce: null == (n10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : n10.nonce, issuedAt: null != (a10 = null == (i10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : i10.issuedAt) ? a10 : /* @__PURE__ */ new Date(), expirationTime: null == (s10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : s10.expirationTime, notBefore: null == (o10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : o10.notBefore, requestId: null == (l10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : l10.requestId, resources: null == (c10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : c10.resources }), f2 = await h11.request({ method: "personal_sign", params: [(d2 = p2, "0x" + Array.from(new TextEncoder().encode(d2), (e11) => e11.toString(16).padStart(2, "0")).join("")), w2] });
          }
          try {
            let { data: t11, error: r11 } = await hN(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "ethereum", message: p2, signature: f2 }, (null == (u10 = e10.options) ? void 0 : u10.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (h10 = e10.options) ? void 0 : h10.captchaToken } } : null), xform: hD });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new u9();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign({}, t11), error: r11 });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithSolana(e10) {
          var t10, r10, n10, i10, a10, s10, o10, l10, c10, u10, h10, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let { chain: h11, wallet: d3, statement: g2, options: m2 } = e10;
            if ("object" != typeof d3 || !(null == m2 ? void 0 : m2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            let y2 = new URL(null != (t10 = null == m2 ? void 0 : m2.url) ? t10 : window.location.href);
            if ("signIn" in d3 && d3.signIn) {
              let e11, t11 = await d3.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, null == m2 ? void 0 : m2.signInWithSolana), { version: "1", domain: y2.host, uri: y2.href }), g2 ? { statement: g2 } : null));
              if (Array.isArray(t11) && t11[0] && "object" == typeof t11[0]) e11 = t11[0];
              else if (t11 && "object" == typeof t11 && "signedMessage" in t11 && "signature" in t11) e11 = t11;
              else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
              if ("signedMessage" in e11 && "signature" in e11 && ("string" == typeof e11.signedMessage || e11.signedMessage instanceof Uint8Array) && e11.signature instanceof Uint8Array) p2 = "string" == typeof e11.signedMessage ? e11.signedMessage : new TextDecoder().decode(e11.signedMessage), f2 = e11.signature;
              else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            } else {
              if (!("signMessage" in d3) || "function" != typeof d3.signMessage || !("publicKey" in d3) || "object" != typeof d3 || !d3.publicKey || !("toBase58" in d3.publicKey) || "function" != typeof d3.publicKey.toBase58) throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
              p2 = [`${y2.host} wants you to sign in with your Solana account:`, d3.publicKey.toBase58(), ...g2 ? ["", g2, ""] : [""], "Version: 1", `URI: ${y2.href}`, `Issued At: ${null != (n10 = null == (r10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : r10.issuedAt) ? n10 : (/* @__PURE__ */ new Date()).toISOString()}`, ...(null == (i10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : i10.notBefore) ? [`Not Before: ${m2.signInWithSolana.notBefore}`] : [], ...(null == (a10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : a10.expirationTime) ? [`Expiration Time: ${m2.signInWithSolana.expirationTime}`] : [], ...(null == (s10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : s10.chainId) ? [`Chain ID: ${m2.signInWithSolana.chainId}`] : [], ...(null == (o10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : o10.nonce) ? [`Nonce: ${m2.signInWithSolana.nonce}`] : [], ...(null == (l10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : l10.requestId) ? [`Request ID: ${m2.signInWithSolana.requestId}`] : [], ...(null == (u10 = null == (c10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : c10.resources) ? void 0 : u10.length) ? ["Resources", ...m2.signInWithSolana.resources.map((e12) => `- ${e12}`)] : []].join("\n");
              let e11 = await d3.signMessage(new TextEncoder().encode(p2), "utf8");
              if (!e11 || !(e11 instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
              f2 = e11;
            }
          }
          try {
            let { data: t11, error: r11 } = await hN(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "solana", message: p2, signature: hf(f2) }, (null == (h10 = e10.options) ? void 0 : h10.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (d2 = e10.options) ? void 0 : d2.captchaToken } } : null), xform: hD });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new u9();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign({}, t11), error: r11 });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async _exchangeCodeForSession(e10) {
          let t10 = await hy(this.storage, `${this.storageKey}-code-verifier`), [r10, n10] = (null != t10 ? t10 : "").split("/");
          try {
            if (!r10 && "pkce" === this.flowType) throw new ht();
            let { data: t11, error: i10 } = await hN(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, { headers: this.headers, body: { auth_code: e10, code_verifier: r10 }, xform: hD });
            if (await hb(this.storage, `${this.storageKey}-code-verifier`), i10) throw i10;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new u9();
              return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("recovery" === n10 ? "PASSWORD_RECOVERY" : "SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign(Object.assign({}, t11), { redirectType: null != n10 ? n10 : null }), error: i10 });
          } catch (e11) {
            if (await hb(this.storage, `${this.storageKey}-code-verifier`), u2(e11)) return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithIdToken(e10) {
          try {
            let { options: t10, provider: r10, token: n10, access_token: i10, nonce: a10 } = e10, { data: s10, error: o10 } = await hN(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, body: { provider: r10, id_token: n10, access_token: i10, nonce: a10, gotrue_meta_security: { captcha_token: null == t10 ? void 0 : t10.captchaToken } }, xform: hD });
            if (o10) return this._returnResult({ data: { user: null, session: null }, error: o10 });
            if (!s10 || !s10.session || !s10.user) {
              let e11 = new u9();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return s10.session && (await this._saveSession(s10.session), await this._notifyAllSubscribers("SIGNED_IN", s10.session)), this._returnResult({ data: s10, error: o10 });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithOtp(e10) {
          var t10, r10, n10, i10, a10;
          try {
            if ("email" in e10) {
              let { email: n11, options: i11 } = e10, a11 = null, s10 = null;
              "pkce" === this.flowType && ([a11, s10] = await hS(this.storage, this.storageKey));
              let { error: o10 } = await hN(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { email: n11, data: null != (t10 = null == i11 ? void 0 : i11.data) ? t10 : {}, create_user: null == (r10 = null == i11 ? void 0 : i11.shouldCreateUser) || r10, gotrue_meta_security: { captcha_token: null == i11 ? void 0 : i11.captchaToken }, code_challenge: a11, code_challenge_method: s10 }, redirectTo: null == i11 ? void 0 : i11.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: o10 });
            }
            if ("phone" in e10) {
              let { phone: t11, options: r11 } = e10, { data: s10, error: o10 } = await hN(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { phone: t11, data: null != (n10 = null == r11 ? void 0 : r11.data) ? n10 : {}, create_user: null == (i10 = null == r11 ? void 0 : r11.shouldCreateUser) || i10, gotrue_meta_security: { captcha_token: null == r11 ? void 0 : r11.captchaToken }, channel: null != (a10 = null == r11 ? void 0 : r11.channel) ? a10 : "sms" } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == s10 ? void 0 : s10.message_id }, error: o10 });
            }
            throw new u7("You must provide either an email or phone number.");
          } catch (e11) {
            if (await hb(this.storage, `${this.storageKey}-code-verifier`), u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async verifyOtp(e10) {
          var t10, r10;
          try {
            let n10, i10;
            "options" in e10 && (n10 = null == (t10 = e10.options) ? void 0 : t10.redirectTo, i10 = null == (r10 = e10.options) ? void 0 : r10.captchaToken);
            let { data: a10, error: s10 } = await hN(this.fetch, "POST", `${this.url}/verify`, { headers: this.headers, body: Object.assign(Object.assign({}, e10), { gotrue_meta_security: { captcha_token: i10 } }), redirectTo: n10, xform: hD });
            if (s10) throw s10;
            if (!a10) throw Error("An error occurred on token verification.");
            let o10 = a10.session, l10 = a10.user;
            return (null == o10 ? void 0 : o10.access_token) && (await this._saveSession(o10), await this._notifyAllSubscribers("recovery" == e10.type ? "PASSWORD_RECOVERY" : "SIGNED_IN", o10)), this._returnResult({ data: { user: l10, session: o10 }, error: null });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithSSO(e10) {
          var t10, r10, n10, i10;
          try {
            let a10 = null, s10 = null;
            "pkce" === this.flowType && ([a10, s10] = await hS(this.storage, this.storageKey));
            let o10 = await hN(this.fetch, "POST", `${this.url}/sso`, { body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e10 ? { provider_id: e10.providerId } : null), "domain" in e10 ? { domain: e10.domain } : null), { redirect_to: null != (r10 = null == (t10 = e10.options) ? void 0 : t10.redirectTo) ? r10 : void 0 }), (null == (n10 = null == e10 ? void 0 : e10.options) ? void 0 : n10.captchaToken) ? { gotrue_meta_security: { captcha_token: e10.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: a10, code_challenge_method: s10 }), headers: this.headers, xform: hH });
            return null == (i10 = o10.data) || i10.url, this._returnResult(o10);
          } catch (e11) {
            if (await hb(this.storage, `${this.storageKey}-code-verifier`), u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async reauthenticate() {
          return (await this.initializePromise, null != this.lock) ? await this._acquireLock(this.lockAcquireTimeout, async () => await this._reauthenticate()) : await this._reauthenticate();
        }
        async _reauthenticate() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) throw r10;
              if (!t10) throw new u4();
              let { error: n10 } = await hN(this.fetch, "GET", `${this.url}/reauthenticate`, { headers: this.headers, jwt: t10.access_token });
              return this._returnResult({ data: { user: null, session: null }, error: n10 });
            });
          } catch (e10) {
            if (u2(e10)) return this._returnResult({ data: { user: null, session: null }, error: e10 });
            throw e10;
          }
        }
        async resend(e10) {
          try {
            let t10 = `${this.url}/resend`;
            if ("email" in e10) {
              let { email: r10, type: n10, options: i10 } = e10, a10 = null, s10 = null;
              "pkce" === this.flowType && ([a10, s10] = await hS(this.storage, this.storageKey));
              let { error: o10 } = await hN(this.fetch, "POST", t10, { headers: this.headers, body: { email: r10, type: n10, gotrue_meta_security: { captcha_token: null == i10 ? void 0 : i10.captchaToken }, code_challenge: a10, code_challenge_method: s10 }, redirectTo: null == i10 ? void 0 : i10.emailRedirectTo });
              return o10 && await hb(this.storage, `${this.storageKey}-code-verifier`), this._returnResult({ data: { user: null, session: null }, error: o10 });
            }
            if ("phone" in e10) {
              let { phone: r10, type: n10, options: i10 } = e10, { data: a10, error: s10 } = await hN(this.fetch, "POST", t10, { headers: this.headers, body: { phone: r10, type: n10, gotrue_meta_security: { captcha_token: null == i10 ? void 0 : i10.captchaToken } } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == a10 ? void 0 : a10.message_id }, error: s10 });
            }
            throw new u7("You must provide either an email or phone number and a type");
          } catch (e11) {
            if (await hb(this.storage, `${this.storageKey}-code-verifier`), u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async getSession() {
          return (await this.initializePromise, null != this.lock) ? await this._acquireLock(this.lockAcquireTimeout, async () => this._useSession(async (e10) => e10)) : await this._useSession(async (e10) => e10);
        }
        async _acquireLock(e10, t10) {
          this._debug("#_acquireLock", "begin", e10);
          try {
            if (this.lockAcquired) {
              let e11 = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), r10 = (async () => (await e11, await t10()))();
              return this.pendingInLock.push((async () => {
                try {
                  await r10;
                } catch (e12) {
                }
              })()), r10;
            }
            return await this.lock(`lock:${this.storageKey}`, e10, async () => {
              this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
              try {
                this.lockAcquired = true;
                let e11 = t10();
                for (this.pendingInLock.push((async () => {
                  try {
                    await e11;
                  } catch (e12) {
                  }
                })()), await e11; this.pendingInLock.length; ) {
                  let e12 = [...this.pendingInLock];
                  await Promise.all(e12), this.pendingInLock.splice(0, e12.length);
                }
                return await e11;
              } finally {
                this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = false;
              }
            });
          } finally {
            this._debug("#_acquireLock", "end");
          }
        }
        async _useSession(e10) {
          this._debug("#_useSession", "begin");
          try {
            let t10 = await this.__loadSession();
            return await e10(t10);
          } finally {
            this._debug("#_useSession", "end");
          }
        }
        async __loadSession() {
          this._debug("#__loadSession()", "begin"), null == this.lock || this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
          try {
            let t10 = null, r10 = await hy(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", r10), null !== r10 && (this._isValidSession(r10) ? t10 = r10 : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !t10) return { data: { session: null }, error: null };
            let n10 = !!t10.expires_at && 1e3 * t10.expires_at - Date.now() < 9e4;
            if (this._debug("#__loadSession()", `session has${n10 ? "" : " not"} expired`, "expires_at", t10.expires_at), !n10) {
              if (this.userStorage) {
                let e11 = await hy(this.userStorage, this.storageKey + "-user");
                (null == e11 ? void 0 : e11.user) ? t10.user = e11.user : t10.user = hO();
              }
              if (this.storage.isServer && t10.user && !t10.user.__isUserNotAvailableProxy) {
                var e10;
                let r11 = { value: this.suppressGetSessionWarning };
                t10.user = (e10 = t10.user, new Proxy(e10, { get: (e11, t11, n11) => {
                  if ("__isInsecureUserWarningProxy" === t11) return true;
                  if ("symbol" == typeof t11) {
                    let r12 = t11.toString();
                    if ("Symbol(Symbol.toPrimitive)" === r12 || "Symbol(Symbol.toStringTag)" === r12 || "Symbol(util.inspect.custom)" === r12 || "Symbol(nodejs.util.inspect.custom)" === r12) return Reflect.get(e11, t11, n11);
                  }
                  return r11.value || "string" != typeof t11 || (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), r11.value = true), Reflect.get(e11, t11, n11);
                } })), r11.value && (this.suppressGetSessionWarning = true);
              }
              return { data: { session: t10 }, error: null };
            }
            let { data: i10, error: a10 } = await this._callRefreshToken(t10.refresh_token);
            if (a10) {
              if (t10.expires_at && 1e3 * t10.expires_at > Date.now()) {
                let e11 = await hy(this.storage, this.storageKey);
                if (e11 && e11.refresh_token === t10.refresh_token) return this._returnResult({ data: { session: t10 }, error: null });
              }
              return this._returnResult({ data: { session: null }, error: a10 });
            }
            return this._returnResult({ data: { session: i10 }, error: null });
          } finally {
            this._debug("#__loadSession()", "end");
          }
        }
        async getUser(e10) {
          let t10;
          return e10 ? await this._getUser(e10) : (await this.initializePromise, (t10 = null != this.lock ? await this._acquireLock(this.lockAcquireTimeout, async () => await this._getUser()) : await this._getUser()).data.user && (this.suppressGetSessionWarning = true), t10);
        }
        async _getUser(e10) {
          try {
            if (e10) return await hN(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: e10, xform: hM });
            return await this._useSession(async (e11) => {
              var t10, r10, n10;
              let { data: i10, error: a10 } = e11;
              if (a10) throw a10;
              return (null == (t10 = i10.session) ? void 0 : t10.access_token) || this.hasCustomAuthorizationHeader ? await hN(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: null != (n10 = null == (r10 = i10.session) ? void 0 : r10.access_token) ? n10 : void 0, xform: hM }) : { data: { user: null }, error: new u4() };
            });
          } catch (e11) {
            if (u2(e11)) return u8(e11) && (await this._removeSession(), await hb(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ data: { user: null }, error: e11 });
            throw e11;
          }
        }
        async updateUser(e10, t10 = {}) {
          return (await this.initializePromise, null != this.lock) ? await this._acquireLock(this.lockAcquireTimeout, async () => await this._updateUser(e10, t10)) : await this._updateUser(e10, t10);
        }
        async _updateUser(e10, t10 = {}) {
          try {
            return await this._useSession(async (r10) => {
              let { data: n10, error: i10 } = r10;
              if (i10) throw i10;
              if (!n10.session) throw new u4();
              let a10 = n10.session, s10 = null, o10 = null;
              "pkce" === this.flowType && null != e10.email && ([s10, o10] = await hS(this.storage, this.storageKey));
              let { data: l10, error: c10 } = await hN(this.fetch, "PUT", `${this.url}/user`, { headers: this.headers, redirectTo: null == t10 ? void 0 : t10.emailRedirectTo, body: Object.assign(Object.assign({}, e10), { code_challenge: s10, code_challenge_method: o10 }), jwt: a10.access_token, xform: hM });
              if (c10) throw c10;
              return a10.user = l10.user, await this._saveSession(a10), await this._notifyAllSubscribers("USER_UPDATED", a10), this._returnResult({ data: { user: a10.user }, error: null });
            });
          } catch (e11) {
            if (await hb(this.storage, `${this.storageKey}-code-verifier`), u2(e11)) return this._returnResult({ data: { user: null }, error: e11 });
            throw e11;
          }
        }
        async setSession(e10) {
          return (await this.initializePromise, null != this.lock) ? await this._acquireLock(this.lockAcquireTimeout, async () => await this._setSession(e10)) : await this._setSession(e10);
        }
        async _setSession(e10) {
          try {
            if (!e10.access_token || !e10.refresh_token) throw new u4();
            let t10 = Date.now() / 1e3, r10 = t10, n10 = true, i10 = null, { payload: a10 } = hv(e10.access_token);
            if (a10.exp && (n10 = (r10 = a10.exp) <= t10), n10) {
              let { data: t11, error: r11 } = await this._callRefreshToken(e10.refresh_token);
              if (r11) return this._returnResult({ data: { user: null, session: null }, error: r11 });
              if (!t11) return { data: { user: null, session: null }, error: null };
              i10 = t11;
            } else {
              let { data: n11, error: a11 } = await this._getUser(e10.access_token);
              if (a11) return this._returnResult({ data: { user: null, session: null }, error: a11 });
              i10 = { access_token: e10.access_token, refresh_token: e10.refresh_token, user: n11.user, token_type: "bearer", expires_in: r10 - t10, expires_at: r10 }, await this._saveSession(i10), await this._notifyAllSubscribers("SIGNED_IN", i10);
            }
            return this._returnResult({ data: { user: i10.user, session: i10 }, error: null });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { session: null, user: null }, error: e11 });
            throw e11;
          }
        }
        async refreshSession(e10) {
          return (await this.initializePromise, null != this.lock) ? await this._acquireLock(this.lockAcquireTimeout, async () => await this._refreshSession(e10)) : await this._refreshSession(e10);
        }
        async _refreshSession(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              if (!e10) {
                let { data: n11, error: i11 } = t10;
                if (i11) throw i11;
                e10 = null != (r10 = n11.session) ? r10 : void 0;
              }
              if (!(null == e10 ? void 0 : e10.refresh_token)) throw new u4();
              let { data: n10, error: i10 } = await this._callRefreshToken(e10.refresh_token);
              return i10 ? this._returnResult({ data: { user: null, session: null }, error: i10 }) : n10 ? this._returnResult({ data: { user: n10.user, session: n10 }, error: null }) : this._returnResult({ data: { user: null, session: null }, error: null });
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async _getSessionFromURL(e10, t10) {
          try {
            throw new he("No browser detected.");
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: { session: null, redirectType: null }, error: e11 });
            throw e11;
          }
        }
        _isImplicitGrantCallback(e10) {
          return "function" == typeof this.detectSessionInUrl ? this.detectSessionInUrl(new URL(window.location.href), e10) : !!(e10.access_token || e10.error || e10.error_description || e10.error_code);
        }
        async _isPKCECallback(e10) {
          let t10 = await hy(this.storage, `${this.storageKey}-code-verifier`);
          return !!(e10.code && t10);
        }
        async signOut(e10 = { scope: "global" }) {
          return (await this.initializePromise, null != this.lock) ? await this._acquireLock(this.lockAcquireTimeout, async () => await this._signOut(e10)) : await this._signOut(e10);
        }
        async _signOut({ scope: e10 } = { scope: "global" }) {
          return await this._useSession(async (t10) => {
            var r10;
            let { data: n10, error: i10 } = t10;
            if (i10 && !u8(i10)) return this._returnResult({ error: i10 });
            let a10 = null == (r10 = n10.session) ? void 0 : r10.access_token;
            if (a10) {
              let { error: t11 } = await this.admin.signOut(a10, e10);
              if (t11 && !(u2(t11) && "AuthApiError" === t11.name && (404 === t11.status || 401 === t11.status || 403 === t11.status) || u8(t11))) return this._returnResult({ error: t11 });
            }
            return "others" !== e10 && (await this._removeSession(), await hb(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ error: null });
          });
        }
        onAuthStateChange(e10) {
          let t10 = Symbol("auth-callback"), r10 = { id: t10, callback: e10, unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", t10), this.stateChangeEmitters.delete(t10);
          } };
          return this._debug("#onAuthStateChange()", "registered callback with id", t10), this.stateChangeEmitters.set(t10, r10), (async () => {
            await this.initializePromise, null != this.lock ? await this._acquireLock(this.lockAcquireTimeout, async () => {
              this._emitInitialSession(t10);
            }) : await this._emitInitialSession(t10);
          })(), { data: { subscription: r10 } };
        }
        async _emitInitialSession(e10) {
          return await this._useSession(async (t10) => {
            var r10, n10;
            try {
              let { data: { session: n11 }, error: i10 } = t10;
              if (i10) throw i10;
              await (null == (r10 = this.stateChangeEmitters.get(e10)) ? void 0 : r10.callback("INITIAL_SESSION", n11)), this._debug("INITIAL_SESSION", "callback id", e10, "session", n11);
            } catch (t11) {
              await (null == (n10 = this.stateChangeEmitters.get(e10)) ? void 0 : n10.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", e10, "error", t11), u8(t11) ? console.warn(t11) : console.error(t11);
            }
          });
        }
        async resetPasswordForEmail(e10, t10 = {}) {
          let r10 = null, n10 = null;
          "pkce" === this.flowType && ([r10, n10] = await hS(this.storage, this.storageKey, true));
          try {
            return await hN(this.fetch, "POST", `${this.url}/recover`, { body: { email: e10, code_challenge: r10, code_challenge_method: n10, gotrue_meta_security: { captcha_token: t10.captchaToken } }, headers: this.headers, redirectTo: t10.redirectTo });
          } catch (e11) {
            if (await hb(this.storage, `${this.storageKey}-code-verifier`), u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async getUserIdentities() {
          var e10;
          try {
            let { data: t10, error: r10 } = await this.getUser();
            if (r10) throw r10;
            return this._returnResult({ data: { identities: null != (e10 = t10.user.identities) ? e10 : [] }, error: null });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async linkIdentity(e10) {
          return "token" in e10 ? this.linkIdentityIdToken(e10) : this.linkIdentityOAuth(e10);
        }
        async linkIdentityOAuth(e10) {
          try {
            let { data: t10, error: r10 } = await this._useSession(async (t11) => {
              var r11, n10, i10, a10, s10;
              let { data: o10, error: l10 } = t11;
              if (l10) throw l10;
              let c10 = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e10.provider, { redirectTo: null == (r11 = e10.options) ? void 0 : r11.redirectTo, scopes: null == (n10 = e10.options) ? void 0 : n10.scopes, queryParams: null == (i10 = e10.options) ? void 0 : i10.queryParams, skipBrowserRedirect: true });
              return await hN(this.fetch, "GET", c10, { headers: this.headers, jwt: null != (s10 = null == (a10 = o10.session) ? void 0 : a10.access_token) ? s10 : void 0 });
            });
            if (r10) throw r10;
            return this._returnResult({ data: { provider: e10.provider, url: null == t10 ? void 0 : t10.url }, error: null });
          } catch (t10) {
            if (u2(t10)) return this._returnResult({ data: { provider: e10.provider, url: null }, error: t10 });
            throw t10;
          }
        }
        async linkIdentityIdToken(e10) {
          return await this._useSession(async (t10) => {
            var r10;
            try {
              let { error: n10, data: { session: i10 } } = t10;
              if (n10) throw n10;
              let { options: a10, provider: s10, token: o10, access_token: l10, nonce: c10 } = e10, { data: u10, error: h10 } = await hN(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, jwt: null != (r10 = null == i10 ? void 0 : i10.access_token) ? r10 : void 0, body: { provider: s10, id_token: o10, access_token: l10, nonce: c10, link_identity: true, gotrue_meta_security: { captcha_token: null == a10 ? void 0 : a10.captchaToken } }, xform: hD });
              if (h10) return this._returnResult({ data: { user: null, session: null }, error: h10 });
              if (!u10 || !u10.session || !u10.user) return this._returnResult({ data: { user: null, session: null }, error: new u9() });
              return u10.session && (await this._saveSession(u10.session), await this._notifyAllSubscribers("USER_UPDATED", u10.session)), this._returnResult({ data: u10, error: h10 });
            } catch (e11) {
              if (await hb(this.storage, `${this.storageKey}-code-verifier`), u2(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
              throw e11;
            }
          });
        }
        async unlinkIdentity(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, n10;
              let { data: i10, error: a10 } = t10;
              if (a10) throw a10;
              return await hN(this.fetch, "DELETE", `${this.url}/user/identities/${e10.identity_id}`, { headers: this.headers, jwt: null != (n10 = null == (r10 = i10.session) ? void 0 : r10.access_token) ? n10 : void 0 });
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _refreshAccessToken(e10) {
          let t10 = "#_refreshAccessToken()";
          this._debug(t10, "begin");
          try {
            var r10, n10;
            let i10 = Date.now();
            return await (r10 = async (r11) => (r11 > 0 && await h_(200 * Math.pow(2, r11 - 1)), this._debug(t10, "refreshing attempt", r11), await hN(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, { body: { refresh_token: e10 }, headers: this.headers, xform: hD })), n10 = (e11, t11) => {
              let r11 = 200 * Math.pow(2, e11);
              return t11 && hn(t11) && Date.now() + r11 - i10 < 3e4;
            }, new Promise((e11, t11) => {
              (async () => {
                for (let i11 = 0; i11 < 1 / 0; i11++) try {
                  let t12 = await r10(i11);
                  if (!n10(i11, null, t12)) return void e11(t12);
                } catch (e12) {
                  if (!n10(i11, e12)) return void t11(e12);
                }
              })();
            }));
          } catch (e11) {
            if (this._debug(t10, "error", e11), u2(e11)) return this._returnResult({ data: { session: null, user: null }, error: e11 });
            throw e11;
          } finally {
            this._debug(t10, "end");
          }
        }
        _isValidSession(e10) {
          return "object" == typeof e10 && null !== e10 && "access_token" in e10 && "refresh_token" in e10 && "expires_at" in e10;
        }
        async _handleProviderSignIn(e10, t10) {
          let r10 = await this._getUrlForProvider(`${this.url}/authorize`, e10, { redirectTo: t10.redirectTo, scopes: t10.scopes, queryParams: t10.queryParams });
          return this._debug("#_handleProviderSignIn()", "provider", e10, "options", t10, "url", r10), { data: { provider: e10, url: r10 }, error: null };
        }
        async _recoverAndRefresh() {
          var e10, t10;
          let r10 = "#_recoverAndRefresh()";
          this._debug(r10, "begin");
          try {
            let n10 = await hy(this.storage, this.storageKey);
            if (n10 && this.userStorage) {
              let t11 = await hy(this.userStorage, this.storageKey + "-user");
              !this.storage.isServer && Object.is(this.storage, this.userStorage) && !t11 && (t11 = { user: n10.user }, await hm(this.userStorage, this.storageKey + "-user", t11)), n10.user = null != (e10 = null == t11 ? void 0 : t11.user) ? e10 : hO();
            } else if (n10 && !n10.user && !n10.user) {
              let e11 = await hy(this.storage, this.storageKey + "-user");
              e11 && (null == e11 ? void 0 : e11.user) ? (n10.user = e11.user, await hb(this.storage, this.storageKey + "-user"), await hm(this.storage, this.storageKey, n10)) : n10.user = hO();
            }
            if (this._debug(r10, "session from storage", n10), !this._isValidSession(n10)) {
              this._debug(r10, "session is not valid"), null !== n10 && await this._removeSession();
              return;
            }
            let i10 = (null != (t10 = n10.expires_at) ? t10 : 1 / 0) * 1e3 - Date.now() < 9e4;
            if (this._debug(r10, `session has${i10 ? "" : " not"} expired with margin of 90000s`), i10) {
              if (this.autoRefreshToken && n10.refresh_token) {
                let { error: e11 } = await this._callRefreshToken(n10.refresh_token);
                e11 && (u2(e11) && "AuthRefreshDiscardedError" === e11.name ? this._debug(r10, "refresh discarded by commit guard", e11) : this._debug(r10, "refresh failed", e11));
              }
            } else if (n10.user && true === n10.user.__isUserNotAvailableProxy) try {
              let { data: e11, error: t11 } = await this._getUser(n10.access_token);
              !t11 && (null == e11 ? void 0 : e11.user) ? (n10.user = e11.user, await this._saveSession(n10), await this._notifyAllSubscribers("SIGNED_IN", n10)) : this._debug(r10, "could not get user data, skipping SIGNED_IN notification");
            } catch (e11) {
              console.error("Error getting user data:", e11), this._debug(r10, "error getting user data, skipping SIGNED_IN notification", e11);
            }
            else await this._notifyAllSubscribers("SIGNED_IN", n10);
          } catch (e11) {
            this._debug(r10, "error", e11), console.error(e11);
            return;
          } finally {
            this._debug(r10, "end");
          }
        }
        async _callRefreshToken(e10) {
          var t10, r10;
          if (!e10) throw new u4();
          if (this.refreshingDeferred) return this.refreshingDeferred.promise;
          if (this.lastRefreshFailure && this.lastRefreshFailure.refreshToken === e10 && Date.now() < this.lastRefreshFailure.expiresAt) return this._debug("#_callRefreshToken()", "returning cached failure (cooldown active)"), this.lastRefreshFailure.result;
          let n10 = "#_callRefreshToken()";
          this._debug(n10, "begin");
          try {
            this.refreshingDeferred = new hw();
            let t11 = await hy(this.storage, this.storageKey), { data: r11, error: i10 } = await this._refreshAccessToken(e10);
            if (i10) throw i10;
            if (!r11.session) throw new u4();
            let a10 = await hy(this.storage, this.storageKey);
            if (null !== t11 && (null === a10 || a10.refresh_token !== t11.refresh_token)) {
              this._debug(n10, "commit guard: storage changed since refresh started, discarding rotated tokens", { startedWith: "present", nowHolds: a10 ? "replaced" : "cleared" });
              let e11 = { data: null, error: new hi() };
              return this.refreshingDeferred.resolve(e11), e11;
            }
            let s10 = this._sessionRemovalEpoch;
            if (await this._saveSession(r11.session), this._sessionRemovalEpoch !== s10) {
              this._debug(n10, "commit guard (post-save): _removeSession ran during _saveSession, undoing write"), await hb(this.storage, this.storageKey), this.userStorage && await hb(this.userStorage, this.storageKey + "-user");
              let e11 = { data: null, error: new hi() };
              return this.refreshingDeferred.resolve(e11), e11;
            }
            await this._notifyAllSubscribers("TOKEN_REFRESHED", r11.session);
            let o10 = { data: r11.session, error: null };
            return this.lastRefreshFailure = null, this.refreshingDeferred.resolve(o10), o10;
          } catch (i10) {
            if (this._debug(n10, "error", i10), u2(i10)) {
              let r11 = { data: null, error: i10 };
              if (!hn(i10)) {
                let e11 = await hy(this.storage, this.storageKey);
                (null == e11 ? void 0 : e11.expires_at) && 1e3 * e11.expires_at > Date.now() ? this._debug(n10, "proactive refresh failed, access token still valid \u2014 preserving session") : await this._removeSession();
              }
              return this.lastRefreshFailure = { refreshToken: e10, result: r11, expiresAt: Date.now() + 6e4 }, null == (t10 = this.refreshingDeferred) || t10.resolve(r11), r11;
            }
            throw null == (r10 = this.refreshingDeferred) || r10.reject(i10), i10;
          } finally {
            this.refreshingDeferred = null, this._debug(n10, "end");
          }
        }
        async _notifyAllSubscribers(e10, t10, r10 = true) {
          let n10 = `#_notifyAllSubscribers(${e10})`;
          this._debug(n10, "begin", t10, `broadcast = ${r10}`);
          try {
            this.broadcastChannel && r10 && this.broadcastChannel.postMessage({ event: e10, session: t10 });
            let n11 = [], i10 = Array.from(this.stateChangeEmitters.values()).map(async (r11) => {
              try {
                await r11.callback(e10, t10);
              } catch (e11) {
                n11.push(e11);
              }
            });
            if (await Promise.all(i10), n11.length > 0) {
              for (let e11 = 0; e11 < n11.length; e11 += 1) console.error(n11[e11]);
              throw n11[0];
            }
          } finally {
            this._debug(n10, "end");
          }
        }
        async _saveSession(e10) {
          this._debug("#_saveSession()", e10), this.suppressGetSessionWarning = true, await hb(this.storage, `${this.storageKey}-code-verifier`);
          let t10 = Object.assign({}, e10), r10 = t10.user && true === t10.user.__isUserNotAvailableProxy;
          if (this.userStorage) {
            !r10 && t10.user && await hm(this.userStorage, this.storageKey + "-user", { user: t10.user });
            let e11 = Object.assign({}, t10);
            delete e11.user;
            let n10 = hP(e11);
            await hm(this.storage, this.storageKey, n10);
          } else {
            let e11 = hP(t10);
            await hm(this.storage, this.storageKey, e11);
          }
        }
        async _removeSession() {
          this._sessionRemovalEpoch += 1, this._debug("#_removeSession()"), this.lastRefreshFailure = null, this.suppressGetSessionWarning = false, await hb(this.storage, this.storageKey), await hb(this.storage, this.storageKey + "-code-verifier"), await hb(this.storage, this.storageKey + "-user"), this.userStorage && await hb(this.userStorage, this.storageKey + "-user"), await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        _removeVisibilityChangedCallback() {
          this._debug("#_removeVisibilityChangedCallback()"), this.visibilityChangedCallback, this.visibilityChangedCallback = null;
        }
        async _startAutoRefresh() {
          await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
          let e10 = setInterval(() => this._autoRefreshTokenTick(), 3e4);
          this.autoRefreshTicker = e10, e10 && "object" == typeof e10 && "function" == typeof e10.unref ? e10.unref() : "u" > typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(e10);
          let t10 = setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
          }, 0);
          this.autoRefreshTickTimeout = t10, t10 && "object" == typeof t10 && "function" == typeof t10.unref ? t10.unref() : "u" > typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(t10);
        }
        async _stopAutoRefresh() {
          this._debug("#_stopAutoRefresh()");
          let e10 = this.autoRefreshTicker;
          this.autoRefreshTicker = null, e10 && clearInterval(e10);
          let t10 = this.autoRefreshTickTimeout;
          this.autoRefreshTickTimeout = null, t10 && clearTimeout(t10);
        }
        async startAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
        }
        async stopAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
        }
        async dispose() {
          var e10;
          this._removeVisibilityChangedCallback(), await this._stopAutoRefresh(), null == (e10 = this.broadcastChannel) || e10.close(), this.broadcastChannel = null, this.stateChangeEmitters.clear();
        }
        async _autoRefreshTokenTick() {
          if (this._debug("#_autoRefreshTokenTick()", "begin"), null != this.lock) {
            try {
              await this._acquireLock(0, async () => {
                try {
                  let e10 = Date.now();
                  try {
                    return await this._useSession(async (t10) => {
                      let { data: { session: r10 } } = t10;
                      if (!r10 || !r10.refresh_token || !r10.expires_at) return void this._debug("#_autoRefreshTokenTick()", "no session");
                      let n10 = Math.floor((1e3 * r10.expires_at - e10) / 3e4);
                      this._debug("#_autoRefreshTokenTick()", `access token expires in ${n10} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), n10 <= 3 && await this._callRefreshToken(r10.refresh_token);
                    });
                  } catch (e11) {
                    console.error("Auto refresh tick failed with error. This is likely a transient error.", e11);
                  }
                } finally {
                  this._debug("#_autoRefreshTokenTick()", "end");
                }
              });
            } catch (e10) {
              if (e10 instanceof hF) this._debug("auto refresh token tick lock not available");
              else throw e10;
            }
            return;
          }
          if (null !== this.refreshingDeferred) return void this._debug("#_autoRefreshTokenTick()", "refresh already in flight, skipping");
          try {
            let e10 = Date.now();
            try {
              await this._useSession(async (t10) => {
                let { data: { session: r10 } } = t10;
                if (!r10 || !r10.refresh_token || !r10.expires_at) return void this._debug("#_autoRefreshTokenTick()", "no session");
                let n10 = Math.floor((1e3 * r10.expires_at - e10) / 3e4);
                this._debug("#_autoRefreshTokenTick()", `access token expires in ${n10} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), n10 <= 3 && await this._callRefreshToken(r10.refresh_token);
              });
            } catch (e11) {
              console.error("Auto refresh tick failed with error. This is likely a transient error.", e11);
            }
          } finally {
            this._debug("#_autoRefreshTokenTick()", "end");
          }
        }
        async _handleVisibilityChange() {
          return this._debug("#_handleVisibilityChange()"), this.autoRefreshToken && this.startAutoRefresh(), false;
        }
        async _onVisibilityChanged(e10) {
          let t10 = `#_onVisibilityChanged(${e10})`;
          if (this._debug(t10, "visibilityState", document.visibilityState), "visible" === document.visibilityState) {
            if (this.autoRefreshToken && this._startAutoRefresh(), !e10) if (await this.initializePromise, null != this.lock) await this._acquireLock(this.lockAcquireTimeout, async () => {
              "visible" !== document.visibilityState ? this._debug(t10, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting") : await this._recoverAndRefresh();
            });
            else {
              if ("visible" !== document.visibilityState) return void this._debug(t10, "visibilityState is no longer visible, skipping recovery");
              await this._recoverAndRefresh();
            }
          } else "hidden" === document.visibilityState && this.autoRefreshToken && this._stopAutoRefresh();
        }
        async _getUrlForProvider(e10, t10, r10) {
          let n10 = [`provider=${encodeURIComponent(t10)}`];
          if ((null == r10 ? void 0 : r10.redirectTo) && n10.push(`redirect_to=${encodeURIComponent(r10.redirectTo)}`), (null == r10 ? void 0 : r10.scopes) && n10.push(`scopes=${encodeURIComponent(r10.scopes)}`), "pkce" === this.flowType) {
            let [e11, t11] = await hS(this.storage, this.storageKey), r11 = new URLSearchParams({ code_challenge: `${encodeURIComponent(e11)}`, code_challenge_method: `${encodeURIComponent(t11)}` });
            n10.push(r11.toString());
          }
          if (null == r10 ? void 0 : r10.queryParams) {
            let e11 = new URLSearchParams(r10.queryParams);
            n10.push(e11.toString());
          }
          return (null == r10 ? void 0 : r10.skipBrowserRedirect) && n10.push(`skip_http_redirect=${r10.skipBrowserRedirect}`), `${e10}?${n10.join("&")}`;
        }
        async _unenroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              let { data: n10, error: i10 } = t10;
              return i10 ? this._returnResult({ data: null, error: i10 }) : await hN(this.fetch, "DELETE", `${this.url}/factors/${e10.factorId}`, { headers: this.headers, jwt: null == (r10 = null == n10 ? void 0 : n10.session) ? void 0 : r10.access_token });
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _enroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, n10;
              let { data: i10, error: a10 } = t10;
              if (a10) return this._returnResult({ data: null, error: a10 });
              let s10 = Object.assign({ friendly_name: e10.friendlyName, factor_type: e10.factorType }, "phone" === e10.factorType ? { phone: e10.phone } : "totp" === e10.factorType ? { issuer: e10.issuer } : {}), { data: o10, error: l10 } = await hN(this.fetch, "POST", `${this.url}/factors`, { body: s10, headers: this.headers, jwt: null == (r10 = null == i10 ? void 0 : i10.session) ? void 0 : r10.access_token });
              return l10 ? this._returnResult({ data: null, error: l10 }) : ("totp" === e10.factorType && "totp" === o10.type && (null == (n10 = null == o10 ? void 0 : o10.totp) ? void 0 : n10.qr_code) && (o10.totp.qr_code = `data:image/svg+xml;utf-8,${o10.totp.qr_code}`), this._returnResult({ data: o10, error: null }));
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _verify(e10) {
          let t10 = async () => {
            try {
              return await this._useSession(async (t11) => {
                var r10;
                let { data: n10, error: i10 } = t11;
                if (i10) return this._returnResult({ data: null, error: i10 });
                let a10 = Object.assign({ challenge_id: e10.challengeId }, "webauthn" in e10 ? { webauthn: Object.assign(Object.assign({}, e10.webauthn), { credential_response: "create" === e10.webauthn.type ? hQ(e10.webauthn.credential_response) : h0(e10.webauthn.credential_response) }) } : { code: e10.code }), { data: s10, error: o10 } = await hN(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/verify`, { body: a10, headers: this.headers, jwt: null == (r10 = null == n10 ? void 0 : n10.session) ? void 0 : r10.access_token });
                return o10 ? this._returnResult({ data: null, error: o10 }) : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + s10.expires_in }, s10)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", s10), this._returnResult({ data: s10, error: o10 }));
              });
            } catch (e11) {
              if (u2(e11)) return this._returnResult({ data: null, error: e11 });
              throw e11;
            }
          };
          return null != this.lock ? this._acquireLock(this.lockAcquireTimeout, t10) : t10();
        }
        async _challenge(e10) {
          let t10 = async () => {
            try {
              return await this._useSession(async (t11) => {
                var r10;
                let { data: n10, error: i10 } = t11;
                if (i10) return this._returnResult({ data: null, error: i10 });
                let a10 = await hN(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/challenge`, { body: e10, headers: this.headers, jwt: null == (r10 = null == n10 ? void 0 : n10.session) ? void 0 : r10.access_token });
                if (a10.error) return a10;
                let { data: s10 } = a10;
                if ("webauthn" !== s10.type) return { data: s10, error: null };
                switch (s10.webauthn.type) {
                  case "create":
                    return { data: Object.assign(Object.assign({}, s10), { webauthn: Object.assign(Object.assign({}, s10.webauthn), { credential_options: Object.assign(Object.assign({}, s10.webauthn.credential_options), { publicKey: hY(s10.webauthn.credential_options.publicKey) }) }) }), error: null };
                  case "request":
                    return { data: Object.assign(Object.assign({}, s10), { webauthn: Object.assign(Object.assign({}, s10.webauthn), { credential_options: Object.assign(Object.assign({}, s10.webauthn.credential_options), { publicKey: hZ(s10.webauthn.credential_options.publicKey) }) }) }), error: null };
                }
              });
            } catch (e11) {
              if (u2(e11)) return this._returnResult({ data: null, error: e11 });
              throw e11;
            }
          };
          return null != this.lock ? this._acquireLock(this.lockAcquireTimeout, t10) : t10();
        }
        async _challengeAndVerify(e10) {
          let { data: t10, error: r10 } = await this._challenge({ factorId: e10.factorId });
          return r10 ? this._returnResult({ data: null, error: r10 }) : await this._verify({ factorId: e10.factorId, challengeId: t10.id, code: e10.code });
        }
        async _listFactors() {
          var e10;
          let { data: { user: t10 }, error: r10 } = await this.getUser();
          if (r10) return { data: null, error: r10 };
          let n10 = { all: [], phone: [], totp: [], webauthn: [] };
          for (let r11 of null != (e10 = null == t10 ? void 0 : t10.factors) ? e10 : []) n10.all.push(r11), "verified" === r11.status && n10[r11.factor_type].push(r11);
          return { data: n10, error: null };
        }
        async _getAuthenticatorAssuranceLevel(e10) {
          var t10, r10, n10, i10;
          if (e10) try {
            let { payload: n11 } = hv(e10), i11 = null;
            n11.aal && (i11 = n11.aal);
            let a11 = i11, { data: { user: s11 }, error: o11 } = await this.getUser(e10);
            if (o11) return this._returnResult({ data: null, error: o11 });
            (null != (r10 = null == (t10 = null == s11 ? void 0 : s11.factors) ? void 0 : t10.filter((e11) => "verified" === e11.status)) ? r10 : []).length > 0 && (a11 = "aal2");
            let l11 = n11.amr || [];
            return { data: { currentLevel: i11, nextLevel: a11, currentAuthenticationMethods: l11 }, error: null };
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
          let { data: { session: a10 }, error: s10 } = await this.getSession();
          if (s10) return this._returnResult({ data: null, error: s10 });
          if (!a10) return { data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] }, error: null };
          let { payload: o10 } = hv(a10.access_token), l10 = null;
          o10.aal && (l10 = o10.aal);
          let c10 = l10;
          return (null != (i10 = null == (n10 = a10.user.factors) ? void 0 : n10.filter((e11) => "verified" === e11.status)) ? i10 : []).length > 0 && (c10 = "aal2"), { data: { currentLevel: l10, nextLevel: c10, currentAuthenticationMethods: o10.amr || [] }, error: null };
        }
        async _getAuthorizationDetails(e10) {
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: n10 } = t10;
              return n10 ? this._returnResult({ data: null, error: n10 }) : r10 ? await hN(this.fetch, "GET", `${this.url}/oauth/authorizations/${e10}`, { headers: this.headers, jwt: r10.access_token, xform: (e11) => ({ data: e11, error: null }) }) : this._returnResult({ data: null, error: new u4() });
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _approveAuthorization(e10, t10) {
          try {
            return await this._useSession(async (t11) => {
              let { data: { session: r10 }, error: n10 } = t11;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new u4() });
              let i10 = await hN(this.fetch, "POST", `${this.url}/oauth/authorizations/${e10}/consent`, { headers: this.headers, jwt: r10.access_token, body: { action: "approve" }, xform: (e11) => ({ data: e11, error: null }) });
              return i10.data && i10.data.redirect_url, i10;
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _denyAuthorization(e10, t10) {
          try {
            return await this._useSession(async (t11) => {
              let { data: { session: r10 }, error: n10 } = t11;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new u4() });
              let i10 = await hN(this.fetch, "POST", `${this.url}/oauth/authorizations/${e10}/consent`, { headers: this.headers, jwt: r10.access_token, body: { action: "deny" }, xform: (e11) => ({ data: e11, error: null }) });
              return i10.data && i10.data.redirect_url, i10;
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _listOAuthGrants() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              return r10 ? this._returnResult({ data: null, error: r10 }) : t10 ? await hN(this.fetch, "GET", `${this.url}/user/oauth/grants`, { headers: this.headers, jwt: t10.access_token, xform: (e11) => ({ data: e11, error: null }) }) : this._returnResult({ data: null, error: new u4() });
            });
          } catch (e10) {
            if (u2(e10)) return this._returnResult({ data: null, error: e10 });
            throw e10;
          }
        }
        async _revokeOAuthGrant(e10) {
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: n10 } = t10;
              return n10 ? this._returnResult({ data: null, error: n10 }) : r10 ? (await hN(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, { headers: this.headers, jwt: r10.access_token, query: { client_id: e10.clientId }, noResolveJson: true }), { data: {}, error: null }) : this._returnResult({ data: null, error: new u4() });
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async fetchJwk(e10, t10 = { keys: [] }) {
          let r10 = t10.keys.find((t11) => t11.kid === e10);
          if (r10) return r10;
          let n10 = Date.now();
          if ((r10 = this.jwks.keys.find((t11) => t11.kid === e10)) && this.jwks_cached_at + 6e5 > n10) return r10;
          let { data: i10, error: a10 } = await hN(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
          if (a10) throw a10;
          return i10.keys && 0 !== i10.keys.length && (this.jwks = i10, this.jwks_cached_at = n10, r10 = i10.keys.find((t11) => t11.kid === e10)) ? r10 : null;
        }
        async getClaims(e10, t10 = {}) {
          try {
            let i10, a10 = e10;
            if (!a10) {
              let { data: e11, error: t11 } = await this.getSession();
              if (t11 || !e11.session) return this._returnResult({ data: null, error: t11 });
              a10 = e11.session.access_token;
            }
            let { header: s10, payload: o10, signature: l10, raw: { header: c10, payload: u10 } } = hv(a10);
            if (!(null == t10 ? void 0 : t10.allowExpired)) try {
              var r10, n10 = o10.exp;
              if (!n10) throw Error("Missing exp claim");
              if (n10 <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired");
            } catch (e11) {
              throw new hs(e11 instanceof Error ? e11.message : "JWT validation failed");
            }
            let h10 = !s10.alg || s10.alg.startsWith("HS") || !s10.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(s10.kid, (null == t10 ? void 0 : t10.keys) ? { keys: t10.keys } : null == t10 ? void 0 : t10.jwks);
            if (!h10) {
              let { error: e11 } = await this.getUser(a10);
              if (e11) throw e11;
              return { data: { claims: o10, header: s10, signature: l10 }, error: null };
            }
            let d2 = function(e11) {
              switch (e11) {
                case "RS256":
                  return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
                case "ES256":
                  return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
                default:
                  throw Error("Invalid alg claim");
              }
            }(s10.alg), p2 = await crypto.subtle.importKey("jwk", h10, d2, true, ["verify"]);
            if (!await crypto.subtle.verify(d2, p2, l10, (r10 = `${c10}.${u10}`, i10 = [], !function(e11, t11) {
              for (let r11 = 0; r11 < e11.length; r11 += 1) {
                let n11 = e11.charCodeAt(r11);
                if (n11 > 55295 && n11 <= 56319) {
                  let t12 = (n11 - 55296) * 1024 & 65535;
                  n11 = (e11.charCodeAt(r11 + 1) - 56320 & 65535 | t12) + 65536, r11 += 1;
                }
                !function(e12, t12) {
                  if (e12 <= 127) return t12(e12);
                  if (e12 <= 2047) {
                    t12(192 | e12 >> 6), t12(128 | 63 & e12);
                    return;
                  }
                  if (e12 <= 65535) {
                    t12(224 | e12 >> 12), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                    return;
                  }
                  if (e12 <= 1114111) {
                    t12(240 | e12 >> 18), t12(128 | e12 >> 12 & 63), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                    return;
                  }
                  throw Error(`Unrecognized Unicode codepoint: ${e12.toString(16)}`);
                }(n11, t11);
              }
            }(r10, (e11) => i10.push(e11)), new Uint8Array(i10)))) throw new hs("Invalid JWT signature");
            return { data: { claims: o10, header: s10, signature: l10 }, error: null };
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async signInWithPasskey(e10) {
          var t10, r10, n10;
          hC(this.experimental);
          try {
            1;
            return this._returnResult({ data: null, error: new u6("Browser does not support WebAuthn", null) });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async registerPasskey(e10) {
          var t10, r10;
          hC(this.experimental);
          try {
            1;
            return this._returnResult({ data: null, error: new u6("Browser does not support WebAuthn", null) });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _startPasskeyRegistration() {
          hC(this.experimental);
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) return this._returnResult({ data: null, error: r10 });
              if (!t10) return this._returnResult({ data: null, error: new u4() });
              let { data: n10, error: i10 } = await hN(this.fetch, "POST", `${this.url}/passkeys/registration/options`, { headers: this.headers, jwt: t10.access_token, body: {} });
              return i10 ? this._returnResult({ data: null, error: i10 }) : this._returnResult({ data: n10, error: null });
            });
          } catch (e10) {
            if (u2(e10)) return this._returnResult({ data: null, error: e10 });
            throw e10;
          }
        }
        async _verifyPasskeyRegistration(e10) {
          hC(this.experimental);
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: n10 } = t10;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new u4() });
              let { data: i10, error: a10 } = await hN(this.fetch, "POST", `${this.url}/passkeys/registration/verify`, { headers: this.headers, jwt: r10.access_token, body: { challenge_id: e10.challengeId, credential: e10.credential } });
              return a10 ? this._returnResult({ data: null, error: a10 }) : this._returnResult({ data: i10, error: null });
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _startPasskeyAuthentication(e10) {
          var t10;
          hC(this.experimental);
          try {
            let { data: r10, error: n10 } = await hN(this.fetch, "POST", `${this.url}/passkeys/authentication/options`, { headers: this.headers, body: { gotrue_meta_security: { captcha_token: null == (t10 = null == e10 ? void 0 : e10.options) ? void 0 : t10.captchaToken } } });
            if (n10) return this._returnResult({ data: null, error: n10 });
            return this._returnResult({ data: r10, error: null });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _verifyPasskeyAuthentication(e10) {
          hC(this.experimental);
          try {
            let { data: t10, error: r10 } = await hN(this.fetch, "POST", `${this.url}/passkeys/authentication/verify`, { headers: this.headers, body: { challenge_id: e10.challengeId, credential: e10.credential }, xform: hD });
            if (r10) return this._returnResult({ data: null, error: r10 });
            return t10.session && (await this._saveSession(t10.session), await this._notifyAllSubscribers("SIGNED_IN", t10.session)), this._returnResult({ data: t10, error: null });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _listPasskeys() {
          hC(this.experimental);
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) return this._returnResult({ data: null, error: r10 });
              if (!t10) return this._returnResult({ data: null, error: new u4() });
              let { data: n10, error: i10 } = await hN(this.fetch, "GET", `${this.url}/passkeys`, { headers: this.headers, jwt: t10.access_token, xform: (e11) => ({ data: e11, error: null }) });
              return i10 ? this._returnResult({ data: null, error: i10 }) : this._returnResult({ data: n10, error: null });
            });
          } catch (e10) {
            if (u2(e10)) return this._returnResult({ data: null, error: e10 });
            throw e10;
          }
        }
        async _updatePasskey(e10) {
          hC(this.experimental);
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: n10 } = t10;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new u4() });
              let { data: i10, error: a10 } = await hN(this.fetch, "PATCH", `${this.url}/passkeys/${e10.passkeyId}`, { headers: this.headers, jwt: r10.access_token, body: { friendly_name: e10.friendlyName } });
              return a10 ? this._returnResult({ data: null, error: a10 }) : this._returnResult({ data: i10, error: null });
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _deletePasskey(e10) {
          hC(this.experimental);
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: n10 } = t10;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new u4() });
              let { error: i10 } = await hN(this.fetch, "DELETE", `${this.url}/passkeys/${e10.passkeyId}`, { headers: this.headers, jwt: r10.access_token, noResolveJson: true });
              return i10 ? this._returnResult({ data: null, error: i10 }) : this._returnResult({ data: null, error: null });
            });
          } catch (e11) {
            if (u2(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
      }
      de.nextInstanceID = {};
      let dt = de, dr = "";
      "u" > typeof Deno ? (dr = "deno", c = null == (ea = Deno.version) ? void 0 : ea.deno) : "u" > typeof document ? dr = "web" : "u" > typeof navigator && "ReactNative" === navigator.product ? dr = "react-native" : (dr = "node", c = "u" > typeof process ? null == (es = process.version) ? void 0 : es.replace(/^v/, "") : void 0);
      let dn = [`runtime=${dr}`];
      c && dn.push(`runtime-version=${c}`);
      let di = { headers: { "X-Client-Info": `supabase-js/2.108.2; ${dn.join("; ")}` } }, da = { schema: "public" }, ds = { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" }, dl = {}, dc = { enabled: false, respectSamplingDecision: true }, du = null;
      function dh(e10) {
        return (dh = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function dd(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var n10 = Object.getOwnPropertySymbols(e10);
          t10 && (n10 = n10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, n10);
        }
        return r10;
      }
      function dp(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? dd(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var n10;
              (n10 = function(e12, t13) {
                if ("object" != dh(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var n11 = r12.call(e12, t13 || "default");
                  if ("object" != dh(n11)) return n11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == dh(n10) ? n10 : n10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : dd(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      async function df(e10, t10, r10) {
        if (!function(e11, t11) {
          let r11;
          if (!e11 || !t11 || 0 === t11.length) return false;
          if (e11 instanceof URL) r11 = e11;
          else try {
            r11 = new URL(e11);
          } catch (e12) {
            return false;
          }
          for (let e12 of t11) try {
            if ("string" == typeof e12) {
              if (function(e13, t12) {
                if (t12 === e13) return true;
                if (t12.startsWith("*.")) {
                  let r12 = t12.slice(2);
                  if (e13.endsWith(r12) && (e13 === r12 || e13.endsWith("." + r12))) return true;
                }
                return false;
              }(r11.hostname, e12)) return true;
            } else if (e12 instanceof RegExp) {
              if (e12.test(r11.hostname)) return true;
            } else if ("function" == typeof e12 && e12(r11)) return true;
          } catch (e13) {
            continue;
          }
          return false;
        }("string" == typeof e10 || e10 instanceof URL ? e10 : e10.url, t10)) return null;
        let n10 = await function() {
          var e11, t11, r11, n11;
          return e11 = this, t11 = void 0, r11 = void 0, n11 = function* () {
            try {
              let e12 = yield (null === du && (du = import("@opentelemetry/api").catch(() => null)), du);
              if (!e12 || !e12.propagation || !e12.context) return null;
              let t12 = {};
              e12.propagation.inject(e12.context.active(), t12);
              let r12 = t12.traceparent;
              if (!r12) return null;
              return { traceparent: r12, tracestate: t12.tracestate, baggage: t12.baggage };
            } catch (e12) {
              return null;
            }
          }, new (r11 || (r11 = Promise))(function(i10, a10) {
            function s10(e12) {
              try {
                l10(n11.next(e12));
              } catch (e13) {
                a10(e13);
              }
            }
            function o10(e12) {
              try {
                l10(n11.throw(e12));
              } catch (e13) {
                a10(e13);
              }
            }
            function l10(e12) {
              var t12;
              e12.done ? i10(e12.value) : ((t12 = e12.value) instanceof r11 ? t12 : new r11(function(e13) {
                e13(t12);
              })).then(s10, o10);
            }
            l10((n11 = n11.apply(e11, t11 || [])).next());
          });
        }();
        if (!n10 || !n10.traceparent) return null;
        if (r10) {
          let e11 = function(e12) {
            if (!e12 || "string" != typeof e12) return null;
            let t11 = e12.split("-");
            if (4 !== t11.length) return null;
            let [r11, n11, i10, a10] = t11;
            if (2 !== r11.length || 32 !== n11.length || 16 !== i10.length || 2 !== a10.length) return null;
            let s10 = /^[0-9a-f]+$/i;
            return s10.test(r11) && s10.test(n11) && s10.test(i10) && s10.test(a10) && "00000000000000000000000000000000" !== n11 && "0000000000000000" !== i10 ? { version: r11, traceId: n11, parentId: i10, traceFlags: a10, isSampled: (1 & parseInt(a10, 16)) == 1 } : null;
          }(n10.traceparent);
          if (e11 && !e11.isSampled) return null;
        }
        return n10;
      }
      function dg(e10) {
        return "boolean" == typeof e10 ? { enabled: e10 } : e10;
      }
      var dm = class extends dt {
        constructor(e10) {
          super(e10);
        }
      }, dy = class {
        constructor(e10, t10, r10) {
          var n10, i10, a10;
          this.supabaseUrl = e10, this.supabaseKey = t10;
          const s10 = function(e11) {
            let t11 = null == e11 ? void 0 : e11.trim();
            if (!t11) throw Error("supabaseUrl is required.");
            if (!t11.match(/^https?:\/\//i)) throw Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
            try {
              return new URL(t11.endsWith("/") ? t11 : t11 + "/");
            } catch (e12) {
              throw Error("Invalid supabaseUrl: Provided URL is malformed.");
            }
          }(e10);
          if (!t10) throw Error("supabaseKey is required.");
          this.realtimeUrl = new URL("realtime/v1", s10), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", s10), this.storageUrl = new URL("storage/v1", s10), this.functionsUrl = new URL("functions/v1", s10);
          const o10 = `sb-${s10.hostname.split(".")[0]}-auth-token`, l10 = function(e11, t11) {
            var r11, n11, i11, a11, s11, o11;
            let { db: l11, auth: c10, realtime: u10, global: h10 } = e11, { db: d2, auth: p2, realtime: f2, global: g2 } = t11, m2 = dg(e11.tracePropagation), y2 = dg(t11.tracePropagation), b2 = { db: dp(dp({}, d2), l11), auth: dp(dp({}, p2), c10), realtime: dp(dp({}, f2), u10), storage: {}, global: dp(dp(dp({}, g2), h10), {}, { headers: dp(dp({}, null != (r11 = null == g2 ? void 0 : g2.headers) ? r11 : {}), null != (n11 = null == h10 ? void 0 : h10.headers) ? n11 : {}) }), tracePropagation: { enabled: null != (i11 = null != (a11 = null == m2 ? void 0 : m2.enabled) ? a11 : null == y2 ? void 0 : y2.enabled) && i11, respectSamplingDecision: null == (s11 = null != (o11 = null == m2 ? void 0 : m2.respectSamplingDecision) ? o11 : null == y2 ? void 0 : y2.respectSamplingDecision) || s11 }, accessToken: async () => "" };
            return e11.accessToken ? b2.accessToken = e11.accessToken : delete b2.accessToken, b2;
          }(null != r10 ? r10 : {}, { db: da, realtime: dl, auth: dp(dp({}, ds), {}, { storageKey: o10 }), global: di, tracePropagation: dc });
          this.settings = l10, this.storageKey = null != (n10 = l10.auth.storageKey) ? n10 : "", this.headers = null != (i10 = l10.global.headers) ? i10 : {}, l10.accessToken ? (this.accessToken = l10.accessToken, this.auth = new Proxy({}, { get: (e11, t11) => {
            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t11)} is not possible`);
          } })) : this.auth = this._initSupabaseAuthClient(null != (a10 = l10.auth) ? a10 : {}, this.headers, l10.global.fetch), this.fetch = ((e11, t11, r11, n11, i11) => {
            let a11 = n11 ? (...e12) => n11(...e12) : (...e12) => fetch(...e12), s11 = Headers, o11 = (null == i11 ? void 0 : i11.enabled) === true, l11 = (null == i11 ? void 0 : i11.respectSamplingDecision) !== false, c10 = o11 ? function(e12) {
              let t12 = [];
              try {
                let r12 = new URL(e12);
                t12.push(r12.hostname);
              } catch (e13) {
              }
              return t12.push("*.supabase.co", "*.supabase.in"), t12.push("localhost", "127.0.0.1", "[::1]"), t12;
            }(t11) : null;
            return async (t12, n12) => {
              var i12;
              let o12 = null != (i12 = await r11()) ? i12 : e11, u10 = new s11(null == n12 ? void 0 : n12.headers);
              if (u10.has("apikey") || u10.set("apikey", e11), u10.has("Authorization") || u10.set("Authorization", `Bearer ${o12}`), c10) {
                let e12 = await df(t12, c10, l11);
                e12 && (e12.traceparent && !u10.has("traceparent") && u10.set("traceparent", e12.traceparent), e12.tracestate && !u10.has("tracestate") && u10.set("tracestate", e12.tracestate), e12.baggage && !u10.has("baggage") && u10.set("baggage", e12.baggage));
              }
              return a11(t12, dp(dp({}, n12), {}, { headers: u10 }));
            };
          })(t10, e10, this._getAccessToken.bind(this), l10.global.fetch, l10.tracePropagation), this.realtime = this._initRealtimeClient(dp({ headers: this.headers, accessToken: this._getAccessToken.bind(this), fetch: this.fetch }, l10.realtime)), this.accessToken && Promise.resolve(this.accessToken()).then((e11) => this.realtime.setAuth(e11)).catch((e11) => console.warn("Failed to set initial Realtime auth token:", e11)), this.rest = new ck(new URL("rest/v1", s10).href, { headers: this.headers, schema: l10.db.schema, fetch: this.fetch, timeout: l10.db.timeout, urlLengthLimit: l10.db.urlLengthLimit }), this.storage = new uG(this.storageUrl.href, this.headers, this.fetch, null == r10 ? void 0 : r10.storage), l10.accessToken || this._listenForAuthEvents();
        }
        get functions() {
          return new cu(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
        }
        from(e10) {
          return this.rest.from(e10);
        }
        schema(e10) {
          return this.rest.schema(e10);
        }
        rpc(e10, t10 = {}, r10 = { head: false, get: false, count: void 0 }) {
          return this.rest.rpc(e10, t10, r10);
        }
        channel(e10, t10 = { config: {} }) {
          return this.realtime.channel(e10, t10);
        }
        getChannels() {
          return this.realtime.getChannels();
        }
        removeChannel(e10) {
          return this.realtime.removeChannel(e10);
        }
        removeAllChannels() {
          return this.realtime.removeAllChannels();
        }
        async _getAccessToken() {
          var e10, t10;
          if (this.accessToken) return await this.accessToken();
          let { data: r10 } = await this.auth.getSession();
          return null != (e10 = null == (t10 = r10.session) ? void 0 : t10.access_token) ? e10 : this.supabaseKey;
        }
        _initSupabaseAuthClient({ autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: n10, userStorage: i10, storageKey: a10, flowType: s10, lock: o10, debug: l10, throwOnError: c10, experimental: u10, lockAcquireTimeout: h10, skipAutoInitialize: d2 }, p2, f2) {
          let g2 = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
          return new dm({ url: this.authUrl.href, headers: dp(dp({}, g2), p2), storageKey: a10, autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: n10, userStorage: i10, flowType: s10, lock: o10, debug: l10, throwOnError: c10, experimental: u10, fetch: f2, lockAcquireTimeout: h10, skipAutoInitialize: d2, hasCustomAuthorizationHeader: Object.keys(this.headers).some((e11) => "authorization" === e11.toLowerCase()) });
        }
        _initRealtimeClient(e10) {
          return new uo(this.realtimeUrl.href, dp(dp({}, e10), {}, { params: dp(dp({}, { apikey: this.supabaseKey }), null == e10 ? void 0 : e10.params) }));
        }
        _listenForAuthEvents() {
          return this.auth.onAuthStateChange((e10, t10) => {
            this._handleTokenChanged(e10, "CLIENT", null == t10 ? void 0 : t10.access_token);
          });
        }
        _handleTokenChanged(e10, t10, r10) {
          ("TOKEN_REFRESHED" === e10 || "SIGNED_IN" === e10) && this.changedAccessToken !== r10 ? (this.changedAccessToken = r10, this.realtime.setAuth(r10)) : "SIGNED_OUT" === e10 && (this.realtime.setAuth(), "STORAGE" == t10 && this.auth.signOut(), this.changedAccessToken = void 0);
        }
      };
      let db = (e10, t10, r10) => new dy(e10, t10, r10);
      (function() {
        let e10 = globalThis.process;
        if (!e10) return false;
        let t10 = e10.version;
        if (null == t10) return false;
        let r10 = t10.match(/^v(\d+)\./);
        return !!r10 && 18 >= parseInt(r10[1], 10);
      })() && console.warn("\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");
      let dw = "https://rertnbzartiabkncsyax.supabase.co", dv = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlcnRuYnphcnRpYWJrbmNzeWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTE2MTgsImV4cCI6MjA5NzQyNzYxOH0.hDOILTD2f65IdKgSUqM8xh0pI9vVfYYdEs9eF_j73tU", d_ = process.env.SUPABASE_SERVICE_ROLE_KEY || dv;
      process.env.SUPABASE_SERVICE_ROLE_KEY || console.warn("SUPABASE_SERVICE_ROLE_KEY not set \u2014 supabaseAdmin will use anon key and may be blocked by RLS");
      let dx = db(dw, dv);
      db(dw, d_, { auth: { autoRefreshToken: false, persistSession: false } });
      var dE = e.i(90894);
      function dk(e10, t10) {
        if ("number" != typeof (e10 = e10 || dO)) throw Error("Illegal arguments: " + typeof e10 + ", " + typeof t10);
        e10 < 4 ? e10 = 4 : e10 > 31 && (e10 = 31);
        var r10 = [];
        return r10.push("$2b$"), e10 < 10 && r10.push("0"), r10.push(e10.toString()), r10.push("$"), r10.push(dR(function(e11) {
          try {
            return crypto.getRandomValues(new Uint8Array(e11));
          } catch {
          }
          try {
            return dE.default.randomBytes(e11);
          } catch {
          }
          throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
        }(dC), dC)), r10.join("");
      }
      var dS = "function" == typeof setImmediate ? setImmediate : "object" == typeof scheduler && "function" == typeof scheduler.postTask ? scheduler.postTask.bind(scheduler) : setTimeout, dT = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), dA = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, -1, -1, -1, -1, -1, -1, -1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, -1, -1, -1, -1, -1, -1, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, -1, -1, -1, -1, -1];
      function dR(e10, t10) {
        var r10, n10, i10 = 0, a10 = [];
        if (t10 <= 0 || t10 > e10.length) throw Error("Illegal len: " + t10);
        for (; i10 < t10; ) {
          if (r10 = 255 & e10[i10++], a10.push(dT[r10 >> 2 & 63]), r10 = (3 & r10) << 4, i10 >= t10 || (r10 |= (n10 = 255 & e10[i10++]) >> 4 & 15, a10.push(dT[63 & r10]), r10 = (15 & n10) << 2, i10 >= t10)) {
            a10.push(dT[63 & r10]);
            break;
          }
          r10 |= (n10 = 255 & e10[i10++]) >> 6 & 3, a10.push(dT[63 & r10]), a10.push(dT[63 & n10]);
        }
        return a10.join("");
      }
      var dC = 16, dO = 10, dP = [608135816, 2242054355, 320440878, 57701188, 2752067618, 698298832, 137296536, 3964562569, 1160258022, 953160567, 3193202383, 887688300, 3232508343, 3380367581, 1065670069, 3041331479, 2450970073, 2306472731], dI = [3509652390, 2564797868, 805139163, 3491422135, 3101798381, 1780907670, 3128725573, 4046225305, 614570311, 3012652279, 134345442, 2240740374, 1667834072, 1901547113, 2757295779, 4103290238, 227898511, 1921955416, 1904987480, 2182433518, 2069144605, 3260701109, 2620446009, 720527379, 3318853667, 677414384, 3393288472, 3101374703, 2390351024, 1614419982, 1822297739, 2954791486, 3608508353, 3174124327, 2024746970, 1432378464, 3864339955, 2857741204, 1464375394, 1676153920, 1439316330, 715854006, 3033291828, 289532110, 2706671279, 2087905683, 3018724369, 1668267050, 732546397, 1947742710, 3462151702, 2609353502, 2950085171, 1814351708, 2050118529, 680887927, 999245976, 1800124847, 3300911131, 1713906067, 1641548236, 4213287313, 1216130144, 1575780402, 4018429277, 3917837745, 3693486850, 3949271944, 596196993, 3549867205, 258830323, 2213823033, 772490370, 2760122372, 1774776394, 2652871518, 566650946, 4142492826, 1728879713, 2882767088, 1783734482, 3629395816, 2517608232, 2874225571, 1861159788, 326777828, 3124490320, 2130389656, 2716951837, 967770486, 1724537150, 2185432712, 2364442137, 1164943284, 2105845187, 998989502, 3765401048, 2244026483, 1075463327, 1455516326, 1322494562, 910128902, 469688178, 1117454909, 936433444, 3490320968, 3675253459, 1240580251, 122909385, 2157517691, 634681816, 4142456567, 3825094682, 3061402683, 2540495037, 79693498, 3249098678, 1084186820, 1583128258, 426386531, 1761308591, 1047286709, 322548459, 995290223, 1845252383, 2603652396, 3431023940, 2942221577, 3202600964, 3727903485, 1712269319, 422464435, 3234572375, 1170764815, 3523960633, 3117677531, 1434042557, 442511882, 3600875718, 1076654713, 1738483198, 4213154764, 2393238008, 3677496056, 1014306527, 4251020053, 793779912, 2902807211, 842905082, 4246964064, 1395751752, 1040244610, 2656851899, 3396308128, 445077038, 3742853595, 3577915638, 679411651, 2892444358, 2354009459, 1767581616, 3150600392, 3791627101, 3102740896, 284835224, 4246832056, 1258075500, 768725851, 2589189241, 3069724005, 3532540348, 1274779536, 3789419226, 2764799539, 1660621633, 3471099624, 4011903706, 913787905, 3497959166, 737222580, 2514213453, 2928710040, 3937242737, 1804850592, 3499020752, 2949064160, 2386320175, 2390070455, 2415321851, 4061277028, 2290661394, 2416832540, 1336762016, 1754252060, 3520065937, 3014181293, 791618072, 3188594551, 3933548030, 2332172193, 3852520463, 3043980520, 413987798, 3465142937, 3030929376, 4245938359, 2093235073, 3534596313, 375366246, 2157278981, 2479649556, 555357303, 3870105701, 2008414854, 3344188149, 4221384143, 3956125452, 2067696032, 3594591187, 2921233993, 2428461, 544322398, 577241275, 1471733935, 610547355, 4027169054, 1432588573, 1507829418, 2025931657, 3646575487, 545086370, 48609733, 2200306550, 1653985193, 298326376, 1316178497, 3007786442, 2064951626, 458293330, 2589141269, 3591329599, 3164325604, 727753846, 2179363840, 146436021, 1461446943, 4069977195, 705550613, 3059967265, 3887724982, 4281599278, 3313849956, 1404054877, 2845806497, 146425753, 1854211946, 1266315497, 3048417604, 3681880366, 3289982499, 290971e4, 1235738493, 2632868024, 2414719590, 3970600049, 1771706367, 1449415276, 3266420449, 422970021, 1963543593, 2690192192, 3826793022, 1062508698, 1531092325, 1804592342, 2583117782, 2714934279, 4024971509, 1294809318, 4028980673, 1289560198, 2221992742, 1669523910, 35572830, 157838143, 1052438473, 1016535060, 1802137761, 1753167236, 1386275462, 3080475397, 2857371447, 1040679964, 2145300060, 2390574316, 1461121720, 2956646967, 4031777805, 4028374788, 33600511, 2920084762, 1018524850, 629373528, 3691585981, 3515945977, 2091462646, 2486323059, 586499841, 988145025, 935516892, 3367335476, 2599673255, 2839830854, 265290510, 3972581182, 2759138881, 3795373465, 1005194799, 847297441, 406762289, 1314163512, 1332590856, 1866599683, 4127851711, 750260880, 613907577, 1450815602, 3165620655, 3734664991, 3650291728, 3012275730, 3704569646, 1427272223, 778793252, 1343938022, 2676280711, 2052605720, 1946737175, 3164576444, 3914038668, 3967478842, 3682934266, 1661551462, 3294938066, 4011595847, 840292616, 3712170807, 616741398, 312560963, 711312465, 1351876610, 322626781, 1910503582, 271666773, 2175563734, 1594956187, 70604529, 3617834859, 1007753275, 1495573769, 4069517037, 2549218298, 2663038764, 504708206, 2263041392, 3941167025, 2249088522, 1514023603, 1998579484, 1312622330, 694541497, 2582060303, 2151582166, 1382467621, 776784248, 2618340202, 3323268794, 2497899128, 2784771155, 503983604, 4076293799, 907881277, 423175695, 432175456, 1378068232, 4145222326, 3954048622, 3938656102, 3820766613, 2793130115, 2977904593, 26017576, 3274890735, 3194772133, 1700274565, 1756076034, 4006520079, 3677328699, 720338349, 1533947780, 354530856, 688349552, 3973924725, 1637815568, 332179504, 3949051286, 53804574, 2852348879, 3044236432, 1282449977, 3583942155, 3416972820, 4006381244, 1617046695, 2628476075, 3002303598, 1686838959, 431878346, 2686675385, 1700445008, 1080580658, 1009431731, 832498133, 3223435511, 2605976345, 2271191193, 2516031870, 1648197032, 4164389018, 2548247927, 300782431, 375919233, 238389289, 3353747414, 2531188641, 2019080857, 1475708069, 455242339, 2609103871, 448939670, 3451063019, 1395535956, 2413381860, 1841049896, 1491858159, 885456874, 4264095073, 4001119347, 1565136089, 3898914787, 1108368660, 540939232, 1173283510, 2745871338, 3681308437, 4207628240, 3343053890, 4016749493, 1699691293, 1103962373, 3625875870, 2256883143, 3830138730, 1031889488, 3479347698, 1535977030, 4236805024, 3251091107, 2132092099, 1774941330, 1199868427, 1452454533, 157007616, 2904115357, 342012276, 595725824, 1480756522, 206960106, 497939518, 591360097, 863170706, 2375253569, 3596610801, 1814182875, 2094937945, 3421402208, 1082520231, 3463918190, 2785509508, 435703966, 3908032597, 1641649973, 2842273706, 3305899714, 1510255612, 2148256476, 2655287854, 3276092548, 4258621189, 236887753, 3681803219, 274041037, 1734335097, 3815195456, 3317970021, 1899903192, 1026095262, 4050517792, 356393447, 2410691914, 3873677099, 3682840055, 3913112168, 2491498743, 4132185628, 2489919796, 1091903735, 1979897079, 3170134830, 3567386728, 3557303409, 857797738, 1136121015, 1342202287, 507115054, 2535736646, 337727348, 3213592640, 1301675037, 2528481711, 1895095763, 1721773893, 3216771564, 62756741, 2142006736, 835421444, 2531993523, 1442658625, 3659876326, 2882144922, 676362277, 1392781812, 170690266, 3921047035, 1759253602, 3611846912, 1745797284, 664899054, 1329594018, 3901205900, 3045908486, 2062866102, 2865634940, 3543621612, 3464012697, 1080764994, 553557557, 3656615353, 3996768171, 991055499, 499776247, 1265440854, 648242737, 3940784050, 980351604, 3713745714, 1749149687, 3396870395, 4211799374, 3640570775, 1161844396, 3125318951, 1431517754, 545492359, 4268468663, 3499529547, 1437099964, 2702547544, 3433638243, 2581715763, 2787789398, 1060185593, 1593081372, 2418618748, 4260947970, 69676912, 2159744348, 86519011, 2512459080, 3838209314, 1220612927, 3339683548, 133810670, 1090789135, 1078426020, 1569222167, 845107691, 3583754449, 4072456591, 1091646820, 628848692, 1613405280, 3757631651, 526609435, 236106946, 48312990, 2942717905, 3402727701, 1797494240, 859738849, 992217954, 4005476642, 2243076622, 3870952857, 3732016268, 765654824, 3490871365, 2511836413, 1685915746, 3888969200, 1414112111, 2273134842, 3281911079, 4080962846, 172450625, 2569994100, 980381355, 4109958455, 2819808352, 2716589560, 2568741196, 3681446669, 3329971472, 1835478071, 660984891, 3704678404, 4045999559, 3422617507, 3040415634, 1762651403, 1719377915, 3470491036, 2693910283, 3642056355, 3138596744, 1364962596, 2073328063, 1983633131, 926494387, 3423689081, 2150032023, 4096667949, 1749200295, 3328846651, 309677260, 2016342300, 1779581495, 3079819751, 111262694, 1274766160, 443224088, 298511866, 1025883608, 3806446537, 1145181785, 168956806, 3641502830, 3584813610, 1689216846, 3666258015, 3200248200, 1692713982, 2646376535, 4042768518, 1618508792, 1610833997, 3523052358, 4130873264, 2001055236, 3610705100, 2202168115, 4028541809, 2961195399, 1006657119, 2006996926, 3186142756, 1430667929, 3210227297, 1314452623, 4074634658, 4101304120, 2273951170, 1399257539, 3367210612, 3027628629, 1190975929, 2062231137, 2333990788, 2221543033, 2438960610, 1181637006, 548689776, 2362791313, 3372408396, 3104550113, 3145860560, 296247880, 1970579870, 3078560182, 3769228297, 1714227617, 3291629107, 3898220290, 166772364, 1251581989, 493813264, 448347421, 195405023, 2709975567, 677966185, 3703036547, 1463355134, 2715995803, 1338867538, 1343315457, 2802222074, 2684532164, 233230375, 2599980071, 2000651841, 3277868038, 1638401717, 4028070440, 3237316320, 6314154, 819756386, 300326615, 590932579, 1405279636, 3267499572, 3150704214, 2428286686, 3959192993, 3461946742, 1862657033, 1266418056, 963775037, 2089974820, 2263052895, 1917689273, 448879540, 3550394620, 3981727096, 150775221, 3627908307, 1303187396, 508620638, 2975983352, 2726630617, 1817252668, 1876281319, 1457606340, 908771278, 3720792119, 3617206836, 2455994898, 1729034894, 1080033504, 976866871, 3556439503, 2881648439, 1522871579, 1555064734, 1336096578, 3548522304, 2579274686, 3574697629, 3205460757, 3593280638, 3338716283, 3079412587, 564236357, 2993598910, 1781952180, 1464380207, 3163844217, 3332601554, 1699332808, 1393555694, 1183702653, 3581086237, 1288719814, 691649499, 2847557200, 2895455976, 3193889540, 2717570544, 1781354906, 1676643554, 2592534050, 3230253752, 1126444790, 2770207658, 2633158820, 2210423226, 2615765581, 2414155088, 3127139286, 673620729, 2805611233, 1269405062, 4015350505, 3341807571, 4149409754, 1057255273, 2012875353, 2162469141, 2276492801, 2601117357, 993977747, 3918593370, 2654263191, 753973209, 36408145, 2530585658, 25011837, 3520020182, 2088578344, 530523599, 2918365339, 1524020338, 1518925132, 3760827505, 3759777254, 1202760957, 3985898139, 3906192525, 674977740, 4174734889, 2031300136, 2019492241, 3983892565, 4153806404, 3822280332, 352677332, 2297720250, 60907813, 90501309, 3286998549, 1016092578, 2535922412, 2839152426, 457141659, 509813237, 4120667899, 652014361, 1966332200, 2975202805, 55981186, 2327461051, 676427537, 3255491064, 2882294119, 3433927263, 1307055953, 942726286, 933058658, 2468411793, 3933900994, 4215176142, 1361170020, 2001714738, 2830558078, 3274259782, 1222529897, 1679025792, 2729314320, 3714953764, 1770335741, 151462246, 3013232138, 1682292957, 1483529935, 471910574, 1539241949, 458788160, 3436315007, 1807016891, 3718408830, 978976581, 1043663428, 3165965781, 1927990952, 4200891579, 2372276910, 3208408903, 3533431907, 1412390302, 2931980059, 4132332400, 1947078029, 3881505623, 4168226417, 2941484381, 1077988104, 1320477388, 886195818, 18198404, 3786409e3, 2509781533, 112762804, 3463356488, 1866414978, 891333506, 18488651, 661792760, 1628790961, 3885187036, 3141171499, 876946877, 2693282273, 1372485963, 791857591, 2686433993, 3759982718, 3167212022, 3472953795, 2716379847, 445679433, 3561995674, 3504004811, 3574258232, 54117162, 3331405415, 2381918588, 3769707343, 4154350007, 1140177722, 4074052095, 668550556, 3214352940, 367459370, 261225585, 2610173221, 4209349473, 3468074219, 3265815641, 314222801, 3066103646, 3808782860, 282218597, 3406013506, 3773591054, 379116347, 1285071038, 846784868, 2669647154, 3771962079, 3550491691, 2305946142, 453669953, 1268987020, 3317592352, 3279303384, 3744833421, 2610507566, 3859509063, 266596637, 3847019092, 517658769, 3462560207, 3443424879, 370717030, 4247526661, 2224018117, 4143653529, 4112773975, 2788324899, 2477274417, 1456262402, 2901442914, 1517677493, 1846949527, 2295493580, 3734397586, 2176403920, 1280348187, 1908823572, 3871786941, 846861322, 1172426758, 3287448474, 3383383037, 1655181056, 3139813346, 901632758, 1897031941, 2986607138, 3066810236, 3447102507, 1393639104, 373351379, 950779232, 625454576, 3124240540, 4148612726, 2007998917, 544563296, 2244738638, 2330496472, 2058025392, 1291430526, 424198748, 50039436, 29584100, 3605783033, 2429876329, 2791104160, 1057563949, 3255363231, 3075367218, 3463963227, 1469046755, 985887462], dj = [1332899944, 1700884034, 1701343084, 1684370003, 1668446532, 1869963892];
      function d$(e10, t10, r10, n10) {
        var i10 = e10[t10], a10 = e10[t10 + 1];
        return i10 ^= r10[0], a10 ^= (n10[i10 >>> 24] + n10[256 | i10 >> 16 & 255] ^ n10[512 | i10 >> 8 & 255]) + n10[768 | 255 & i10] ^ r10[1], i10 ^= (n10[a10 >>> 24] + n10[256 | a10 >> 16 & 255] ^ n10[512 | a10 >> 8 & 255]) + n10[768 | 255 & a10] ^ r10[2], a10 ^= (n10[i10 >>> 24] + n10[256 | i10 >> 16 & 255] ^ n10[512 | i10 >> 8 & 255]) + n10[768 | 255 & i10] ^ r10[3], i10 ^= (n10[a10 >>> 24] + n10[256 | a10 >> 16 & 255] ^ n10[512 | a10 >> 8 & 255]) + n10[768 | 255 & a10] ^ r10[4], a10 ^= (n10[i10 >>> 24] + n10[256 | i10 >> 16 & 255] ^ n10[512 | i10 >> 8 & 255]) + n10[768 | 255 & i10] ^ r10[5], i10 ^= (n10[a10 >>> 24] + n10[256 | a10 >> 16 & 255] ^ n10[512 | a10 >> 8 & 255]) + n10[768 | 255 & a10] ^ r10[6], a10 ^= (n10[i10 >>> 24] + n10[256 | i10 >> 16 & 255] ^ n10[512 | i10 >> 8 & 255]) + n10[768 | 255 & i10] ^ r10[7], i10 ^= (n10[a10 >>> 24] + n10[256 | a10 >> 16 & 255] ^ n10[512 | a10 >> 8 & 255]) + n10[768 | 255 & a10] ^ r10[8], a10 ^= (n10[i10 >>> 24] + n10[256 | i10 >> 16 & 255] ^ n10[512 | i10 >> 8 & 255]) + n10[768 | 255 & i10] ^ r10[9], i10 ^= (n10[a10 >>> 24] + n10[256 | a10 >> 16 & 255] ^ n10[512 | a10 >> 8 & 255]) + n10[768 | 255 & a10] ^ r10[10], a10 ^= (n10[i10 >>> 24] + n10[256 | i10 >> 16 & 255] ^ n10[512 | i10 >> 8 & 255]) + n10[768 | 255 & i10] ^ r10[11], i10 ^= (n10[a10 >>> 24] + n10[256 | a10 >> 16 & 255] ^ n10[512 | a10 >> 8 & 255]) + n10[768 | 255 & a10] ^ r10[12], a10 ^= (n10[i10 >>> 24] + n10[256 | i10 >> 16 & 255] ^ n10[512 | i10 >> 8 & 255]) + n10[768 | 255 & i10] ^ r10[13], i10 ^= (n10[a10 >>> 24] + n10[256 | a10 >> 16 & 255] ^ n10[512 | a10 >> 8 & 255]) + n10[768 | 255 & a10] ^ r10[14], a10 ^= (n10[i10 >>> 24] + n10[256 | i10 >> 16 & 255] ^ n10[512 | i10 >> 8 & 255]) + n10[768 | 255 & i10] ^ r10[15], i10 ^= (n10[a10 >>> 24] + n10[256 | a10 >> 16 & 255] ^ n10[512 | a10 >> 8 & 255]) + n10[768 | 255 & a10] ^ r10[16], e10[t10] = a10 ^ r10[17], e10[t10 + 1] = i10, e10;
      }
      function dN(e10, t10) {
        for (var r10 = 0, n10 = 0; r10 < 4; ++r10) n10 = n10 << 8 | 255 & e10[t10], t10 = (t10 + 1) % e10.length;
        return { key: n10, offp: t10 };
      }
      function dU(e10, t10, r10) {
        for (var n10, i10 = 0, a10 = [0, 0], s10 = t10.length, o10 = r10.length, l10 = 0; l10 < s10; l10++) i10 = (n10 = dN(e10, i10)).offp, t10[l10] = t10[l10] ^ n10.key;
        for (l10 = 0; l10 < s10; l10 += 2) a10 = d$(a10, 0, t10, r10), t10[l10] = a10[0], t10[l10 + 1] = a10[1];
        for (l10 = 0; l10 < o10; l10 += 2) a10 = d$(a10, 0, t10, r10), r10[l10] = a10[0], r10[l10 + 1] = a10[1];
      }
      function dD(e10, t10, r10, n10, i10) {
        var a10, s10, o10 = dj.slice(), l10 = o10.length;
        if (r10 < 4 || r10 > 31) {
          if (s10 = Error("Illegal number of rounds (4-31): " + r10), n10) return void dS(n10.bind(this, s10));
          throw s10;
        }
        if (t10.length !== dC) {
          if (s10 = Error("Illegal salt length: " + t10.length + " != " + dC), n10) return void dS(n10.bind(this, s10));
          throw s10;
        }
        r10 = 1 << r10 >>> 0;
        var c10, u10, h10, d2 = 0;
        function p2() {
          if (i10 && i10(d2 / r10), d2 < r10) for (var a11 = Date.now(); d2 < r10 && (d2 += 1, dU(e10, c10, u10), dU(t10, c10, u10), !(Date.now() - a11 > 100)); ) ;
          else {
            for (d2 = 0; d2 < 64; d2++) for (h10 = 0; h10 < l10 >> 1; h10++) d$(o10, h10 << 1, c10, u10);
            var s11 = [];
            for (d2 = 0; d2 < l10; d2++) s11.push((o10[d2] >> 24 & 255) >>> 0), s11.push((o10[d2] >> 16 & 255) >>> 0), s11.push((o10[d2] >> 8 & 255) >>> 0), s11.push((255 & o10[d2]) >>> 0);
            return n10 ? void n10(null, s11) : s11;
          }
          n10 && dS(p2);
        }
        if ("function" == typeof Int32Array ? (c10 = new Int32Array(dP), u10 = new Int32Array(dI)) : (c10 = dP.slice(), u10 = dI.slice()), !function(e11, t11, r11, n11) {
          for (var i11, a11 = 0, s11 = [0, 0], o11 = r11.length, l11 = n11.length, c11 = 0; c11 < o11; c11++) a11 = (i11 = dN(t11, a11)).offp, r11[c11] = r11[c11] ^ i11.key;
          for (c11 = 0, a11 = 0; c11 < o11; c11 += 2) a11 = (i11 = dN(e11, a11)).offp, s11[0] ^= i11.key, a11 = (i11 = dN(e11, a11)).offp, s11[1] ^= i11.key, s11 = d$(s11, 0, r11, n11), r11[c11] = s11[0], r11[c11 + 1] = s11[1];
          for (c11 = 0; c11 < l11; c11 += 2) a11 = (i11 = dN(e11, a11)).offp, s11[0] ^= i11.key, a11 = (i11 = dN(e11, a11)).offp, s11[1] ^= i11.key, s11 = d$(s11, 0, r11, n11), n11[c11] = s11[0], n11[c11 + 1] = s11[1];
        }(t10, e10, c10, u10), void 0 !== n10) p2();
        else for (; ; ) if (void 0 !== (a10 = p2())) return a10 || [];
      }
      function dL(e10, t10, r10, n10) {
        if ("string" != typeof e10 || "string" != typeof t10) {
          if (i10 = Error("Invalid string / salt: Not a string"), r10) return void dS(r10.bind(this, i10));
          throw i10;
        }
        if ("$" !== t10.charAt(0) || "2" !== t10.charAt(1)) {
          if (i10 = Error("Invalid salt version: " + t10.substring(0, 2)), r10) return void dS(r10.bind(this, i10));
          throw i10;
        }
        if ("$" === t10.charAt(2)) a10 = "\0", s10 = 3;
        else {
          if ("a" !== (a10 = t10.charAt(2)) && "b" !== a10 && "y" !== a10 || "$" !== t10.charAt(3)) {
            if (i10 = Error("Invalid salt revision: " + t10.substring(2, 4)), r10) return void dS(r10.bind(this, i10));
            throw i10;
          }
          s10 = 4;
        }
        if (t10.charAt(s10 + 2) > "$") {
          if (i10 = Error("Missing salt rounds"), r10) return void dS(r10.bind(this, i10));
          throw i10;
        }
        var i10, a10, s10, o10 = 10 * parseInt(t10.substring(s10, s10 + 1), 10) + parseInt(t10.substring(s10 + 1, s10 + 2), 10), l10 = t10.substring(s10 + 3, s10 + 25), c10 = function(e11) {
          for (var t11, r11, n11 = 0, i11 = Array(function(e12) {
            for (var t12 = 0, r12 = 0, n12 = 0; n12 < e12.length; ++n12) (r12 = e12.charCodeAt(n12)) < 128 ? t12 += 1 : r12 < 2048 ? t12 += 2 : (64512 & r12) == 55296 && (64512 & e12.charCodeAt(n12 + 1)) == 56320 ? (++n12, t12 += 4) : t12 += 3;
            return t12;
          }(e11)), a11 = 0, s11 = e11.length; a11 < s11; ++a11) (t11 = e11.charCodeAt(a11)) < 128 ? i11[n11++] = t11 : (t11 < 2048 ? i11[n11++] = t11 >> 6 | 192 : ((64512 & t11) == 55296 && (64512 & (r11 = e11.charCodeAt(a11 + 1))) == 56320 ? (t11 = 65536 + ((1023 & t11) << 10) + (1023 & r11), ++a11, i11[n11++] = t11 >> 18 | 240, i11[n11++] = t11 >> 12 & 63 | 128) : i11[n11++] = t11 >> 12 | 224, i11[n11++] = t11 >> 6 & 63 | 128), i11[n11++] = 63 & t11 | 128);
          return i11;
        }(e10 += a10 >= "a" ? "\0" : ""), u10 = function(e11, t11) {
          var r11, n11, i11, a11, s11, o11 = 0, l11 = e11.length, c11 = 0, u11 = [];
          if (t11 <= 0) throw Error("Illegal len: " + t11);
          for (; o11 < l11 - 1 && c11 < t11 && (r11 = (s11 = e11.charCodeAt(o11++)) < dA.length ? dA[s11] : -1, n11 = (s11 = e11.charCodeAt(o11++)) < dA.length ? dA[s11] : -1, -1 != r11 && -1 != n11) && (a11 = r11 << 2 >>> 0 | (48 & n11) >> 4, u11.push(String.fromCharCode(a11)), !(++c11 >= t11 || o11 >= l11 || -1 == (i11 = (s11 = e11.charCodeAt(o11++)) < dA.length ? dA[s11] : -1) || (a11 = (15 & n11) << 4 >>> 0 | (60 & i11) >> 2, u11.push(String.fromCharCode(a11)), ++c11 >= t11 || o11 >= l11))); ) {
            ;
            a11 = (3 & i11) << 6 >>> 0 | ((s11 = e11.charCodeAt(o11++)) < dA.length ? dA[s11] : -1), u11.push(String.fromCharCode(a11)), ++c11;
          }
          var h11 = [];
          for (o11 = 0; o11 < c11; o11++) h11.push(u11[o11].charCodeAt(0));
          return h11;
        }(l10, dC);
        function h10(e11) {
          var t11 = [];
          return t11.push("$2"), a10 >= "a" && t11.push(a10), t11.push("$"), o10 < 10 && t11.push("0"), t11.push(o10.toString()), t11.push("$"), t11.push(dR(u10, u10.length)), t11.push(dR(e11, 4 * dj.length - 1)), t11.join("");
        }
        if (void 0 === r10) return h10(dD(c10, u10, o10));
        dD(c10, u10, o10, function(e11, t11) {
          e11 ? r10(e11, null) : r10(null, h10(t11));
        }, n10);
      }
      let dM = function(e10, t10, r10, n10) {
        function i10(r11) {
          "string" != typeof e10 || "string" != typeof t10 ? dS(r11.bind(this, Error("Illegal arguments: " + typeof e10 + ", " + typeof t10))) : 60 !== t10.length ? dS(r11.bind(this, null, false)) : function(e11, t11, r12, n11) {
            function i11(r13) {
              "string" == typeof e11 && "number" == typeof t11 ? function(e12, t12, r14) {
                if ("function" == typeof t12 && (r14 = t12, t12 = void 0), "function" == typeof e12 && (r14 = e12, e12 = void 0), void 0 === e12) e12 = dO;
                else if ("number" != typeof e12) throw Error("illegal arguments: " + typeof e12);
                function n12(t13) {
                  dS(function() {
                    try {
                      t13(null, dk(e12));
                    } catch (e13) {
                      t13(e13);
                    }
                  });
                }
                if (!r14) return new Promise(function(e13, t13) {
                  n12(function(r15, n13) {
                    r15 ? t13(r15) : e13(n13);
                  });
                });
                if ("function" != typeof r14) throw Error("Illegal callback: " + typeof r14);
                n12(r14);
              }(t11, function(t12, i12) {
                dL(e11, i12, r13, n11);
              }) : "string" == typeof e11 && "string" == typeof t11 ? dL(e11, t11, r13, n11) : dS(r13.bind(this, Error("Illegal arguments: " + typeof e11 + ", " + typeof t11)));
            }
            if (!r12) return new Promise(function(e12, t12) {
              i11(function(r13, n12) {
                r13 ? t12(r13) : e12(n12);
              });
            });
            if ("function" != typeof r12) throw Error("Illegal callback: " + typeof r12);
            i11(r12);
          }(e10, t10.substring(0, 29), function(e11, n11) {
            e11 ? r11(e11) : r11(null, function(e12, t11) {
              for (var r12 = e12.length ^ t11.length, n12 = 0; n12 < e12.length; ++n12) r12 |= e12.charCodeAt(n12) ^ t11.charCodeAt(n12);
              return 0 === r12;
            }(n11, t10));
          }, n10);
        }
        if (!r10) return new Promise(function(e11, t11) {
          i10(function(r11, n11) {
            r11 ? t11(r11) : e11(n11);
          });
        });
        if ("function" != typeof r10) throw Error("Illegal callback: " + typeof r10);
        i10(r10);
      }, { handlers: dH, auth: dB, signIn: dW, signOut: dq } = function(e10) {
        if ("function" == typeof e10) {
          let t11 = async (t12) => {
            let r10 = await e10(t12);
            return lq(r10), lM(lW(t12), r10);
          };
          return { handlers: { GET: t11, POST: t11 }, auth: l3(e10, (e11) => lq(e11)), signIn: async (t12, r10, n10) => {
            let i10 = await e10(void 0);
            return lq(i10), cr(t12, r10, n10, i10);
          }, signOut: async (t12) => {
            let r10 = await e10(void 0);
            return lq(r10), cn(t12, r10);
          }, unstable_update: async (t12) => {
            let r10 = await e10(void 0);
            return lq(r10), ci(t12, r10);
          } };
        }
        lq(e10);
        let t10 = (t11) => lM(lW(t11), e10);
        return { handlers: { GET: t10, POST: t10 }, auth: l3(e10), signIn: (t11, r10, n10) => cr(t11, r10, n10, e10), signOut: (t11) => cn(t11, e10), unstable_update: (t11) => ci(t11, e10) };
      }({ basePath: "/api/auth", secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "metalabs-secret-key-change-in-production", providers: [{ id: "credentials", name: "Credentials", type: "credentials", credentials: {}, authorize: () => null, options: { name: "credentials", credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } }, async authorize(e10) {
        if (!e10?.email || !e10?.password) return null;
        let { data: t10, error: r10 } = await dx.from("User").select("*").eq("email", e10.email).single();
        return !r10 && t10 && "SUSPENDED" !== t10.status && await dM(e10.password, t10.passwordHash) ? (await dx.from("User").update({ lastLoginAt: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", t10.id), { id: t10.id, name: t10.name, email: t10.email, role: t10.role }) : null;
      } } }], callbacks: { jwt: async ({ token: e10, user: t10 }) => (t10 && (e10.id = t10.id, e10.role = t10.role), e10), session: async ({ session: e10, token: t10 }) => (t10 && (e10.user.id = t10.id, e10.user.role = t10.role), e10) }, pages: { signIn: "/login" }, session: { strategy: "jwt" } }), dK = dB((e10) => {
        let { nextUrl: t10 } = e10, r10 = !!e10.auth, n10 = e10.auth?.user?.role, i10 = t10.pathname.startsWith("/admin"), a10 = t10.pathname.startsWith("/dashboard"), s10 = "/login" === t10.pathname;
        if (i10) {
          if (!r10) return ef.redirect(new URL("/login", t10));
          if ("ADMIN" !== n10) return ef.redirect(new URL("/dashboard", t10));
        }
        return a10 && !r10 ? ef.redirect(new URL("/login", t10)) : s10 && r10 ? ef.redirect(new URL("ADMIN" === n10 ? "/admin" : "/dashboard", t10)) : ef.next();
      });
      e.s(["config", 0, { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] }, "default", 0, dK], 99446);
      let dJ = { ...e.i(99446) }, dF = "/middleware", dz = dJ.middleware || dJ.default;
      if ("function" != typeof dz) throw new class extends Error {
        constructor(e10) {
          super(e10), this.stack = "";
        }
      }(`The Middleware file "${dF}" must export a function named \`middleware\` or a default function.`);
      let dV = (e10) => tA({ ...e10, IncrementalCache: rc, incrementalCacheHandler: null, page: dF, handler: async (...e11) => {
        try {
          return await dz(...e11);
        } catch (i10) {
          let t10 = e11[0], r10 = new URL(t10.url), n10 = r10.pathname + r10.search;
          throw await g(i10, { path: n10, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), i10;
        }
      } });
      async function dG(e10, t10) {
        let r10 = await dV({ request: { url: e10.url, method: e10.method, headers: C(e10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: dF }, body: "GET" !== e10.method && "HEAD" !== e10.method ? e10.body ?? void 0 : void 0, waitUntil: t10.waitUntil, requestMeta: t10.requestMeta, signal: t10.signal || new AbortController().signal } });
        return null == t10.waitUntil || t10.waitUntil.call(t10, r10.waitUntil), r10.response;
      }
      e.s(["default", 0, dV, "handler", 0, dG], 42738);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0rz9m-f.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_0rz9m_f = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0rz9m-f.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0rz9m-f.js", { otherChunks: ["chunks/[root-of-the-server]__0rl5avo._.js", "chunks/_03s3dp8._.js"], runtimeModuleIds: [38022] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = ["NEXT_DEPLOYMENT_ID", "NEXT_CLIENT_ASSET_SUFFIX"];
      var r, n = ((r = n || {})[r.Runtime = 0] = "Runtime", r[r.Parent = 1] = "Parent", r[r.Update = 2] = "Update", r);
      let o = /* @__PURE__ */ new WeakMap();
      function u(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let l = u.prototype, i = Object.prototype.hasOwnProperty, a = "u" > typeof Symbol && Symbol.toStringTag;
      function s(e2, t2, r2) {
        i.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function c(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = f(t2), e2[t2] = r2), r2;
      }
      function f(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function h(e2, t2) {
        s(e2, "__esModule", { value: true }), a && s(e2, a, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          if ("number" == typeof o2) if (0 === o2) s(e2, n2, { value: t2[r2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[r2] ? s(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : s(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      function d(e2, t2) {
        (null != t2 ? c(this.c, t2) : this.m).exports = e2;
      }
      l.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = c(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, h(n2, e2);
      }, l.j = function(e2, t2) {
        var r2, n2;
        let u2, l2, a2;
        null != t2 ? l2 = (u2 = c(this.c, t2)).exports : (u2 = this.m, l2 = this.e);
        let s2 = (r2 = u2, n2 = l2, (a2 = o.get(r2)) || (o.set(r2, a2 = []), r2.exports = r2.namespaceObject = new Proxy(n2, { get(e3, t3) {
          if (i.call(e3, t3) || "default" === t3 || "__esModule" === t3) return Reflect.get(e3, t3);
          for (let e4 of a2) {
            let r3 = Reflect.get(e4, t3);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t3 = Reflect.ownKeys(e3);
          for (let e4 of a2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t3.includes(r3) || t3.push(r3);
          return t3;
        } })), a2);
        "object" == typeof e2 && null !== e2 && s2.push(e2);
      }, l.v = d, l.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? c(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let p = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, m = [null, p({}), p([]), p(p)];
      function b(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !m.includes(t3); t3 = p(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), h(t2, n2), t2;
      }
      function y(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function g(e2) {
        let t2 = K(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = b(r2, y(r2), r2 && r2.__esModule);
      }
      function w(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function O(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function k() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      l.i = g, l.A = function(e2) {
        return this.r(e2)(g.bind(this));
      }, l.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, l.r = function(e2) {
        return K(e2, this.m).exports;
      }, l.f = function(e2) {
        function t2(t3) {
          if (t3 = w(t3), i.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = w(t3), i.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let _ = Symbol("turbopack queues"), j = Symbol("turbopack exports"), C = Symbol("turbopack error");
      function P(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      l.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: l2, promise: i2 } = k(), a2 = Object.assign(i2, { [j]: r2.exports, [_]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), a2.catch(() => {
          });
        } }), s2 = { get: () => a2, set(e3) {
          e3 !== a2 && (a2[j] = e3);
        } };
        Object.defineProperty(r2, "exports", s2), Object.defineProperty(r2, "namespaceObject", s2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (_ in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [j]: {}, [_]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[j] = e5, P(t4);
                }, (e5) => {
                  r4[C] = e5, P(t4);
                }), r4;
              }
            }
            return { [j]: e4, [_]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[C]) throw e4[C];
            return e4[j];
          }), { promise: u3, resolve: l3 } = k(), i3 = Object.assign(() => l3(r3), { queueCount: 0 });
          function a3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (i3.queueCount++, e4.push(i3)));
          }
          return t3.map((e4) => e4[_](a3)), i3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? l2(a2[C] = e3) : u2(a2[j]), P(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let v = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function E(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      v.prototype = URL.prototype, l.U = v, l.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, l.g = globalThis;
      let U = u.prototype, R = /* @__PURE__ */ new Map();
      l.M = R;
      let M = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
      async function x(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return A(e2, t2, q(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!R.has(e3) || M.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let l2 = r2.moduleChunks || [], i2 = l2.map((e3) => $.get(e3)).filter((e3) => e3);
        if (i2.length > 0) {
          if (i2.length === l2.length) return void await Promise.all(i2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of l2) $.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = A(e2, t2, q(n3));
            $.set(n3, r4), i2.push(r4);
          }
          n2 = Promise.all(i2);
        } else {
          for (let o3 of (n2 = A(e2, t2, q(r2.path)), l2)) $.has(o3) || $.set(o3, n2);
        }
        for (let e3 of o2) M.has(e3) || M.set(e3, n2);
        await n2;
      }
      U.l = function(e2) {
        return x(n.Parent, this.m.id, e2);
      };
      let T = Promise.resolve(void 0), S = /* @__PURE__ */ new WeakMap();
      function A(t2, r2, o2) {
        let u2 = e.loadChunkCached(t2, o2), l2 = S.get(u2);
        if (void 0 === l2) {
          let e2 = S.set.bind(S, u2, T);
          l2 = u2.then(e2).catch((e3) => {
            let u3;
            switch (t2) {
              case n.Runtime:
                u3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case n.Parent:
                u3 = `from module ${r2}`;
                break;
              case n.Update:
                u3 = "from an HMR update";
                break;
              default:
                E(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let l3 = Error(`Failed to load chunk ${o2} ${u3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw l3.name = "ChunkLoadError", l3;
          }), S.set(u2, l2);
        }
        return l2;
      }
      function q(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      U.L = function(e2) {
        return A(n.Parent, this.m.id, e2);
      }, U.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, U.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, U.q = function(e2, t2) {
        d.call(this, `${e2}`, t2);
      }, U.b = function(e2, r2, n2, o2) {
        let u2 = "SharedWorker" === e2.name, l2 = [n2.map((e3) => q(e3)).reverse(), ""];
        for (let e3 of t) l2.push(globalThis[e3]);
        let i2 = new URL(q(r2), location.origin), a2 = JSON.stringify(l2);
        return u2 ? i2.searchParams.set("params", a2) : i2.hash = "#params=" + encodeURIComponent(a2), new e2(i2, o2 ? { ...o2, type: void 0 } : void 0);
      };
      let N = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      l.w = function(t2, r2, o2) {
        return e.loadWebAssembly(n.Parent, this.m.id, t2, r2, o2);
      }, l.u = function(t2, r2) {
        return e.loadWebAssemblyModule(n.Parent, this.m.id, t2, r2);
      };
      let I = {};
      l.c = I;
      let K = (e2, t2) => {
        let r2 = I[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return L(e2, n.Parent, t2.id);
      };
      function L(e2, t2, r2) {
        let n2 = R.get(e2);
        if ("function" != typeof n2) throw Error(function(e3, t3, r3) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r3}`;
              break;
            case 1:
              n3 = `because it was required from module ${r3}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              E(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, r2));
        let o2 = f(e2), l2 = o2.exports;
        I[e2] = o2;
        let i2 = new u(o2, l2);
        try {
          n2(i2, o2, l2);
        } catch (e3) {
          throw o2.error = e3, e3;
        }
        return o2.namespaceObject && o2.exports !== o2.namespaceObject && b(o2.exports, o2.namespaceObject), o2;
      }
      function W(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          if (e2) return { src: e2.getAttribute("src") };
          if ("u" > typeof TURBOPACK_NEXT_CHUNK_URLS) return { src: TURBOPACK_NEXT_CHUNK_URLS.pop() };
          throw Error("chunk path empty but not in a worker");
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3) {
          let r3 = 1;
          for (; r3 < e2.length; ) {
            let n3, o2 = r3 + 1;
            for (; o2 < e2.length && "function" != typeof e2[o2]; ) o2++;
            if (o2 === e2.length) throw Error("malformed chunk format, expected a factory function");
            let u2 = e2[o2];
            for (let u3 = r3; u3 < o2; u3++) {
              let r4 = e2[u3], o3 = t3.get(r4);
              if (o3) {
                n3 = o3;
                break;
              }
            }
            let l2 = n3 ?? u2, i2 = false;
            for (let n4 = r3; n4 < o2; n4++) {
              let r4 = e2[n4];
              t3.has(r4) || (i2 || (l2 === u2 && Object.defineProperty(u2, "name", { value: "module evaluation" }), i2 = true), t3.set(r4, l2));
            }
            r3 = o2 + 1;
          }
        }(t2, R)), e.registerChunk(n2, r2);
      }
      function B(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : b(n2, y(n2), true);
      }
      l.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? b(t2.default, y(t2), true) : t2;
      }, B.resolve = (e2, t2) => __require.resolve(e2, t2), l.x = B, e = { registerChunk(e2, t2) {
        let r2 = function(e3) {
          if ("string" == typeof e3) return e3;
          let t3 = decodeURIComponent(e3.src.replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(e2);
        F.add(r2), function(e3) {
          let t3 = D.get(e3);
          if (null != t3) {
            for (let r3 of t3) r3.requiredChunks.delete(e3), 0 === r3.requiredChunks.size && X(r3.runtimeModuleIds, r3.chunkPath);
            D.delete(e3);
          }
        }(r2), null != t2 && (0 === t2.otherChunks.length ? X(t2.runtimeModuleIds, r2) : function(e3, t3, r3) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r3, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = O(e4);
            if (F.has(t4)) continue;
            n2.add(t4);
            let r4 = D.get(t4);
            null == r4 && (r4 = /* @__PURE__ */ new Set(), D.set(t4, r4)), r4.add(o2);
          }
          0 === o2.requiredChunks.size && X(o2.runtimeModuleIds, o2.chunkPath);
        }(r2, t2.otherChunks.filter((e3) => {
          var t3;
          return t3 = O(e3), N.test(t3);
        }), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      }, async loadWebAssembly(e2, t2, r2, n2, o2) {
        let u2 = await z(r2, n2);
        return await WebAssembly.instantiate(u2, o2);
      }, loadWebAssemblyModule: async (e2, t2, r2, n2) => z(r2, n2) };
      let F = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Map();
      function X(e2, t2) {
        for (let r2 of e2) !function(e3, t3) {
          let r3 = I[t3];
          if (r3) {
            if (r3.error) throw r3.error;
            return;
          }
          L(t3, n.Runtime, e3);
        }(t2, r2);
      }
      async function z(e2, t2) {
        let r2;
        try {
          r2 = t2();
        } catch (e3) {
        }
        if (!r2) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
        return r2;
      }
      let H = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: W }, H.forEach(W);
    })();
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(path3);
  } catch {
  }
  const correspondingRoute = routes.find((route) => route.regex.some((r) => {
    const regex = new RegExp(r);
    return regex.test(path3) || decodedPath !== void 0 && regex.test(decodedPath);
  }));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next\\/static|_next\\/image|favicon.ico).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"] }];
    require_root_of_the_server_0rl5avo();
    require_s3dp8();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_0rz9m_f();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "C:\\Users\\t14-g\\Documents\\adsimulator", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 11, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "turbopack": { "root": "C:\\Users\\t14-g\\Documents\\adsimulator" }, "distDirRoot": ".next" };
var BuildId = "fviVZ_0IxlwQhDOQPcQJ0";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin", "regex": "^/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin(?:/)?$" }, { "page": "/admin/controls", "regex": "^/admin/controls(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/controls(?:/)?$" }, { "page": "/admin/kelas", "regex": "^/admin/kelas(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/kelas(?:/)?$" }, { "page": "/admin/monitoring", "regex": "^/admin/monitoring(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/monitoring(?:/)?$" }, { "page": "/admin/presets", "regex": "^/admin/presets(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/presets(?:/)?$" }, { "page": "/admin/sertifikasi", "regex": "^/admin/sertifikasi(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/sertifikasi(?:/)?$" }, { "page": "/admin/settings", "regex": "^/admin/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/settings(?:/)?$" }, { "page": "/admin/subscriptions", "regex": "^/admin/subscriptions(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/subscriptions(?:/)?$" }, { "page": "/admin/survey", "regex": "^/admin/survey(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/survey(?:/)?$" }, { "page": "/admin/users", "regex": "^/admin/users(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/users(?:/)?$" }, { "page": "/admin/webinar", "regex": "^/admin/webinar(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/webinar(?:/)?$" }, { "page": "/admin/withdrawals", "regex": "^/admin/withdrawals(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/withdrawals(?:/)?$" }, { "page": "/api/account", "regex": "^/api/account(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/account(?:/)?$" }, { "page": "/api/admin/ads", "regex": "^/api/admin/ads(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/ads(?:/)?$" }, { "page": "/api/admin/courses", "regex": "^/api/admin/courses(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/courses(?:/)?$" }, { "page": "/api/admin/decode-qr", "regex": "^/api/admin/decode\\-qr(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/decode\\-qr(?:/)?$" }, { "page": "/api/admin/exam-questions", "regex": "^/api/admin/exam\\-questions(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/exam\\-questions(?:/)?$" }, { "page": "/api/admin/lessons", "regex": "^/api/admin/lessons(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/lessons(?:/)?$" }, { "page": "/api/admin/presets", "regex": "^/api/admin/presets(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/presets(?:/)?$" }, { "page": "/api/admin/programs", "regex": "^/api/admin/programs(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/programs(?:/)?$" }, { "page": "/api/admin/simulator/progress", "regex": "^/api/admin/simulator/progress(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/simulator/progress(?:/)?$" }, { "page": "/api/admin/simulator/reset", "regex": "^/api/admin/simulator/reset(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/simulator/reset(?:/)?$" }, { "page": "/api/admin/subscriptions", "regex": "^/api/admin/subscriptions(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/subscriptions(?:/)?$" }, { "page": "/api/admin/upload", "regex": "^/api/admin/upload(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/upload(?:/)?$" }, { "page": "/api/admin/users", "regex": "^/api/admin/users(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/users(?:/)?$" }, { "page": "/api/admin/users/search", "regex": "^/api/admin/users/search(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/users/search(?:/)?$" }, { "page": "/api/admin/webinar-questions", "regex": "^/api/admin/webinar\\-questions(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/webinar\\-questions(?:/)?$" }, { "page": "/api/admin/webinars", "regex": "^/api/admin/webinars(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/webinars(?:/)?$" }, { "page": "/api/admin/withdrawals", "regex": "^/api/admin/withdrawals(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/withdrawals(?:/)?$" }, { "page": "/api/ads", "regex": "^/api/ads(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/ads(?:/)?$" }, { "page": "/api/adsets", "regex": "^/api/adsets(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/adsets(?:/)?$" }, { "page": "/api/affiliate", "regex": "^/api/affiliate(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/affiliate(?:/)?$" }, { "page": "/api/affiliate/withdraw", "regex": "^/api/affiliate/withdraw(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/affiliate/withdraw(?:/)?$" }, { "page": "/api/audiences", "regex": "^/api/audiences(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/audiences(?:/)?$" }, { "page": "/api/auth/register", "regex": "^/api/auth/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/register(?:/)?$" }, { "page": "/api/billing", "regex": "^/api/billing(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/billing(?:/)?$" }, { "page": "/api/billing/data", "regex": "^/api/billing/data(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/billing/data(?:/)?$" }, { "page": "/api/campaigns", "regex": "^/api/campaigns(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/campaigns(?:/)?$" }, { "page": "/api/landing-pages", "regex": "^/api/landing\\-pages(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/landing\\-pages(?:/)?$" }, { "page": "/api/pages", "regex": "^/api/pages(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/pages(?:/)?$" }, { "page": "/api/pixels", "regex": "^/api/pixels(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/pixels(?:/)?$" }, { "page": "/api/pixels/events", "regex": "^/api/pixels/events(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/pixels/events(?:/)?$" }, { "page": "/api/portfolio", "regex": "^/api/portfolio(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/portfolio(?:/)?$" }, { "page": "/api/presets", "regex": "^/api/presets(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/presets(?:/)?$" }, { "page": "/api/qris", "regex": "^/api/qris(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/qris(?:/)?$" }, { "page": "/api/qris/settings", "regex": "^/api/qris/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/qris/settings(?:/)?$" }, { "page": "/api/simulator/tick", "regex": "^/api/simulator/tick(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/simulator/tick(?:/)?$" }, { "page": "/api/social-accounts", "regex": "^/api/social\\-accounts(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/social\\-accounts(?:/)?$" }, { "page": "/api/subscriptions", "regex": "^/api/subscriptions(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/subscriptions(?:/)?$" }, { "page": "/api/survey", "regex": "^/api/survey(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/survey(?:/)?$" }, { "page": "/api/survey/config", "regex": "^/api/survey/config(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/survey/config(?:/)?$" }, { "page": "/api/track", "regex": "^/api/track(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/track(?:/)?$" }, { "page": "/api/verify-certificate", "regex": "^/api/verify\\-certificate(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/verify\\-certificate(?:/)?$" }, { "page": "/cek-sertifikat", "regex": "^/cek\\-sertifikat(?:/)?$", "routeKeys": {}, "namedRegex": "^/cek\\-sertifikat(?:/)?$" }, { "page": "/dashboard", "regex": "^/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard(?:/)?$" }, { "page": "/dashboard/ads", "regex": "^/dashboard/ads(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/ads(?:/)?$" }, { "page": "/dashboard/ads-manager", "regex": "^/dashboard/ads\\-manager(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/ads\\-manager(?:/)?$" }, { "page": "/dashboard/adsets", "regex": "^/dashboard/adsets(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/adsets(?:/)?$" }, { "page": "/dashboard/affiliate", "regex": "^/dashboard/affiliate(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/affiliate(?:/)?$" }, { "page": "/dashboard/audiences", "regex": "^/dashboard/audiences(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/audiences(?:/)?$" }, { "page": "/dashboard/billing", "regex": "^/dashboard/billing(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/billing(?:/)?$" }, { "page": "/dashboard/business-settings", "regex": "^/dashboard/business\\-settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/business\\-settings(?:/)?$" }, { "page": "/dashboard/create", "regex": "^/dashboard/create(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/create(?:/)?$" }, { "page": "/dashboard/hub", "regex": "^/dashboard/hub(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/hub(?:/)?$" }, { "page": "/dashboard/kelas", "regex": "^/dashboard/kelas(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/kelas(?:/)?$" }, { "page": "/dashboard/landing-pages", "regex": "^/dashboard/landing\\-pages(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/landing\\-pages(?:/)?$" }, { "page": "/dashboard/langganan", "regex": "^/dashboard/langganan(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/langganan(?:/)?$" }, { "page": "/dashboard/langganan/checkout", "regex": "^/dashboard/langganan/checkout(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/langganan/checkout(?:/)?$" }, { "page": "/dashboard/overview", "regex": "^/dashboard/overview(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/overview(?:/)?$" }, { "page": "/dashboard/pages", "regex": "^/dashboard/pages(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/pages(?:/)?$" }, { "page": "/dashboard/panduan", "regex": "^/dashboard/panduan(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/panduan(?:/)?$" }, { "page": "/dashboard/pemeliharaan", "regex": "^/dashboard/pemeliharaan(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/pemeliharaan(?:/)?$" }, { "page": "/dashboard/pixels", "regex": "^/dashboard/pixels(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/pixels(?:/)?$" }, { "page": "/dashboard/portfolio", "regex": "^/dashboard/portfolio(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/portfolio(?:/)?$" }, { "page": "/dashboard/profile", "regex": "^/dashboard/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/profile(?:/)?$" }, { "page": "/dashboard/sertifikasi", "regex": "^/dashboard/sertifikasi(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/sertifikasi(?:/)?$" }, { "page": "/dashboard/settings", "regex": "^/dashboard/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/settings(?:/)?$" }, { "page": "/dashboard/webinar", "regex": "^/dashboard/webinar(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/webinar(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }, { "page": "/opengraph-image", "regex": "^/opengraph\\-image(?:/)?$", "routeKeys": {}, "namedRegex": "^/opengraph\\-image(?:/)?$" }, { "page": "/preview-web", "regex": "^/preview\\-web(?:/)?$", "routeKeys": {}, "namedRegex": "^/preview\\-web(?:/)?$" }, { "page": "/register", "regex": "^/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/register(?:/)?$" }, { "page": "/robots.txt", "regex": "^/robots\\.txt(?:/)?$", "routeKeys": {}, "namedRegex": "^/robots\\.txt(?:/)?$" }, { "page": "/sitemap.xml", "regex": "^/sitemap\\.xml(?:/)?$", "routeKeys": {}, "namedRegex": "^/sitemap\\.xml(?:/)?$" }, { "page": "/traktir", "regex": "^/traktir(?:/)?$", "routeKeys": {}, "namedRegex": "^/traktir(?:/)?$" }], "dynamic": [{ "page": "/api/admin/ads/[id]", "regex": "^/api/admin/ads/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/ads/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/courses/[id]", "regex": "^/api/admin/courses/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/courses/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/exam-questions/[id]", "regex": "^/api/admin/exam\\-questions/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/exam\\-questions/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/lessons/[id]", "regex": "^/api/admin/lessons/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/lessons/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/presets/[id]", "regex": "^/api/admin/presets/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/presets/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/programs/[id]", "regex": "^/api/admin/programs/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/programs/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/subscriptions/[id]", "regex": "^/api/admin/subscriptions/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/subscriptions/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/users/[id]", "regex": "^/api/admin/users/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/users/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/users/[id]/status", "regex": "^/api/admin/users/([^/]+?)/status(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/users/(?<nxtPid>[^/]+?)/status(?:/)?$" }, { "page": "/api/admin/webinar-questions/[id]", "regex": "^/api/admin/webinar\\-questions/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/webinar\\-questions/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/webinars/[id]", "regex": "^/api/admin/webinars/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/webinars/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/webinars/[id]/attempts", "regex": "^/api/admin/webinars/([^/]+?)/attempts(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/webinars/(?<nxtPid>[^/]+?)/attempts(?:/)?$" }, { "page": "/api/ads/[id]", "regex": "^/api/ads/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/ads/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/adsets/[id]", "regex": "^/api/adsets/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/adsets/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/auth/[...nextauth]", "regex": "^/api/auth/(.+?)(?:/)?$", "routeKeys": { "nxtPnextauth": "nxtPnextauth" }, "namedRegex": "^/api/auth/(?<nxtPnextauth>.+?)(?:/)?$" }, { "page": "/api/campaigns/[id]", "regex": "^/api/campaigns/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/campaigns/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/campaigns/[id]/status", "regex": "^/api/campaigns/([^/]+?)/status(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/campaigns/(?<nxtPid>[^/]+?)/status(?:/)?$" }, { "page": "/api/exams/[courseId]", "regex": "^/api/exams/([^/]+?)(?:/)?$", "routeKeys": { "nxtPcourseId": "nxtPcourseId" }, "namedRegex": "^/api/exams/(?<nxtPcourseId>[^/]+?)(?:/)?$" }, { "page": "/api/landing-pages/public/[id]", "regex": "^/api/landing\\-pages/public/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/landing\\-pages/public/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/landing-pages/[id]", "regex": "^/api/landing\\-pages/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/landing\\-pages/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/social-accounts/[id]", "regex": "^/api/social\\-accounts/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/social\\-accounts/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/webinars/[webinarId]/exam", "regex": "^/api/webinars/([^/]+?)/exam(?:/)?$", "routeKeys": { "nxtPwebinarId": "nxtPwebinarId" }, "namedRegex": "^/api/webinars/(?<nxtPwebinarId>[^/]+?)/exam(?:/)?$" }, { "page": "/api/webinars/[webinarId]/register", "regex": "^/api/webinars/([^/]+?)/register(?:/)?$", "routeKeys": { "nxtPwebinarId": "nxtPwebinarId" }, "namedRegex": "^/api/webinars/(?<nxtPwebinarId>[^/]+?)/register(?:/)?$" }, { "page": "/dashboard/ads/[id]/edit", "regex": "^/dashboard/ads/([^/]+?)/edit(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/ads/(?<nxtPid>[^/]+?)/edit(?:/)?$" }, { "page": "/dashboard/adsets/[id]/edit", "regex": "^/dashboard/adsets/([^/]+?)/edit(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/adsets/(?<nxtPid>[^/]+?)/edit(?:/)?$" }, { "page": "/dashboard/campaigns/[id]", "regex": "^/dashboard/campaigns/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/campaigns/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/dashboard/campaigns/[id]/edit", "regex": "^/dashboard/campaigns/([^/]+?)/edit(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/campaigns/(?<nxtPid>[^/]+?)/edit(?:/)?$" }, { "page": "/dashboard/kelas/[slug]", "regex": "^/dashboard/kelas/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/dashboard/kelas/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/dashboard/kelas/[slug]/[courseSlug]", "regex": "^/dashboard/kelas/([^/]+?)/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug", "nxtPcourseSlug": "nxtPcourseSlug" }, "namedRegex": "^/dashboard/kelas/(?<nxtPslug>[^/]+?)/(?<nxtPcourseSlug>[^/]+?)(?:/)?$" }, { "page": "/dashboard/kelas/[slug]/[courseSlug]/[lessonId]", "regex": "^/dashboard/kelas/([^/]+?)/([^/]+?)/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug", "nxtPcourseSlug": "nxtPcourseSlug", "nxtPlessonId": "nxtPlessonId" }, "namedRegex": "^/dashboard/kelas/(?<nxtPslug>[^/]+?)/(?<nxtPcourseSlug>[^/]+?)/(?<nxtPlessonId>[^/]+?)(?:/)?$" }, { "page": "/dashboard/sertifikasi/[slug]", "regex": "^/dashboard/sertifikasi/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/dashboard/sertifikasi/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/dashboard/sertifikasi/[slug]/sertifikat", "regex": "^/dashboard/sertifikasi/([^/]+?)/sertifikat(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/dashboard/sertifikasi/(?<nxtPslug>[^/]+?)/sertifikat(?:/)?$" }, { "page": "/dashboard/webinar/[id]", "regex": "^/dashboard/webinar/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/webinar/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/dashboard/webinar/[id]/sertifikat", "regex": "^/dashboard/webinar/([^/]+?)/sertifikat(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/webinar/(?<nxtPid>[^/]+?)/sertifikat(?:/)?$" }, { "page": "/landing/[id]", "regex": "^/landing/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/landing/(?<nxtPid>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/cek-sertifikat": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/cek-sertifikat", "dataRoute": "/cek-sertifikat.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/pemeliharaan": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/dashboard/pemeliharaan", "dataRoute": "/dashboard/pemeliharaan.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/login": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/login", "dataRoute": "/login.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/preview-web": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/preview-web", "dataRoute": "/preview-web.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/register": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/register", "dataRoute": "/register.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/robots.txt": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "text/plain", "x-next-cache-tags": "_N_T_/layout,_N_T_/robots.txt/layout,_N_T_/robots.txt/route,_N_T_/robots.txt,site-settings" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/robots.txt", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/sitemap.xml": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "application/xml", "x-next-cache-tags": "_N_T_/layout,_N_T_/sitemap.xml/layout,_N_T_/sitemap.xml/route,_N_T_/sitemap.xml,site-settings" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/sitemap.xml", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/traktir": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 3600, "initialExpireSeconds": 31536e3, "srcRoute": "/traktir", "dataRoute": "/traktir.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "5134a1f1dd83a19963e09c7468f372cb", "previewModeSigningKey": "584a9011c9c738167aa8ecc7c8c7b3c92fc6ce4b44390ccdbc97c2a8b1f882e3", "previewModeEncryptionKey": "a3c389fe9297a96aa7f42cf354ce303fa971239e31abdcb23f5035f340f1429e" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/[root-of-the-server]__0rl5avo._.js", "server/edge/chunks/_03s3dp8._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0rz9m-f.js"], "name": "middleware", "page": "/", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0rz9m-f.js", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next\\/static|_next\\/image|favicon.ico).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/((?!api|_next/static|_next/image|favicon.ico).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "fviVZ_0IxlwQhDOQPcQJ0", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "vhoYk17UD7zzZIm6TA3pqYRT+dsE3hYfnRFYdoDQmTk=", "__NEXT_PREVIEW_MODE_ID": "5134a1f1dd83a19963e09c7468f372cb", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "a3c389fe9297a96aa7f42cf354ce303fa971239e31abdcb23f5035f340f1429e", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "584a9011c9c738167aa8ecc7c8c7b3c92fc6ce4b44390ccdbc97c2a8b1f882e3" } } }, "sortedMiddleware": ["/"], "functions": { "/opengraph-image/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/opengraph-image/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_opengraph-image_route_actions_0as17aw.js", "server/edge/chunks/[root-of-the-server]__0xg0xmy._.js", "server/edge/chunks/node_modules_next_1clly6a._.js", "server/edge/chunks/node_modules_next_dist_compiled_@vercel_og_1yocwnl._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0qw76vu.js"], "name": "app/opengraph-image/route", "page": "/opengraph-image/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0qw76vu.js", "matchers": [{ "regexp": "^/opengraph-image(?:/)?$", "originalSource": "/opengraph-image" }], "wasm": [{ "name": "wasm_10a187050363648b49a36c79d5266d2c", "filePath": "server/edge/chunks/node_modules_next_dist_compiled_@vercel_og_yoga_0athij3.wasm" }, { "name": "wasm_151b7f7b511bd6dda63695d2c75c87a3", "filePath": "server/edge/chunks/node_modules_next_dist_compiled_@vercel_og_resvg_0athij3.wasm" }], "assets": [{ "name": "server/edge/assets/Geist-Regular.05-7db9wczy07.ttf", "filePath": "server/edge/assets/Geist-Regular.05-7db9wczy07.ttf" }], "env": { "__NEXT_BUILD_ID": "fviVZ_0IxlwQhDOQPcQJ0", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "vhoYk17UD7zzZIm6TA3pqYRT+dsE3hYfnRFYdoDQmTk=", "__NEXT_PREVIEW_MODE_ID": "5134a1f1dd83a19963e09c7468f372cb", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "a3c389fe9297a96aa7f42cf354ce303fa971239e31abdcb23f5035f340f1429e", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "584a9011c9c738167aa8ecc7c8c7b3c92fc6ce4b44390ccdbc97c2a8b1f882e3" } } } };
var AppPathRoutesManifest = { "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/admin/controls/page": "/admin/controls", "/admin/kelas/page": "/admin/kelas", "/admin/monitoring/page": "/admin/monitoring", "/admin/page": "/admin", "/admin/presets/page": "/admin/presets", "/admin/sertifikasi/page": "/admin/sertifikasi", "/admin/settings/page": "/admin/settings", "/admin/subscriptions/page": "/admin/subscriptions", "/admin/survey/page": "/admin/survey", "/admin/users/page": "/admin/users", "/admin/webinar/page": "/admin/webinar", "/admin/withdrawals/page": "/admin/withdrawals", "/api/account/route": "/api/account", "/api/admin/ads/[id]/route": "/api/admin/ads/[id]", "/api/admin/ads/route": "/api/admin/ads", "/api/admin/courses/[id]/route": "/api/admin/courses/[id]", "/api/admin/courses/route": "/api/admin/courses", "/api/admin/decode-qr/route": "/api/admin/decode-qr", "/api/admin/exam-questions/[id]/route": "/api/admin/exam-questions/[id]", "/api/admin/exam-questions/route": "/api/admin/exam-questions", "/api/admin/lessons/[id]/route": "/api/admin/lessons/[id]", "/api/admin/lessons/route": "/api/admin/lessons", "/api/admin/presets/[id]/route": "/api/admin/presets/[id]", "/api/admin/presets/route": "/api/admin/presets", "/api/admin/programs/[id]/route": "/api/admin/programs/[id]", "/api/admin/programs/route": "/api/admin/programs", "/api/admin/simulator/progress/route": "/api/admin/simulator/progress", "/api/admin/simulator/reset/route": "/api/admin/simulator/reset", "/api/admin/subscriptions/[id]/route": "/api/admin/subscriptions/[id]", "/api/admin/subscriptions/route": "/api/admin/subscriptions", "/api/admin/upload/route": "/api/admin/upload", "/api/admin/users/[id]/route": "/api/admin/users/[id]", "/api/admin/users/[id]/status/route": "/api/admin/users/[id]/status", "/api/admin/users/route": "/api/admin/users", "/api/admin/users/search/route": "/api/admin/users/search", "/api/admin/webinar-questions/[id]/route": "/api/admin/webinar-questions/[id]", "/api/admin/webinar-questions/route": "/api/admin/webinar-questions", "/api/admin/webinars/[id]/attempts/route": "/api/admin/webinars/[id]/attempts", "/api/admin/webinars/[id]/route": "/api/admin/webinars/[id]", "/api/admin/webinars/route": "/api/admin/webinars", "/api/admin/withdrawals/route": "/api/admin/withdrawals", "/api/ads/[id]/route": "/api/ads/[id]", "/api/ads/route": "/api/ads", "/api/adsets/[id]/route": "/api/adsets/[id]", "/api/adsets/route": "/api/adsets", "/api/affiliate/route": "/api/affiliate", "/api/affiliate/withdraw/route": "/api/affiliate/withdraw", "/api/audiences/route": "/api/audiences", "/api/auth/[...nextauth]/route": "/api/auth/[...nextauth]", "/api/auth/register/route": "/api/auth/register", "/api/billing/data/route": "/api/billing/data", "/api/billing/route": "/api/billing", "/api/campaigns/[id]/route": "/api/campaigns/[id]", "/api/campaigns/[id]/status/route": "/api/campaigns/[id]/status", "/api/campaigns/route": "/api/campaigns", "/api/exams/[courseId]/route": "/api/exams/[courseId]", "/api/landing-pages/[id]/route": "/api/landing-pages/[id]", "/api/landing-pages/public/[id]/route": "/api/landing-pages/public/[id]", "/api/landing-pages/route": "/api/landing-pages", "/api/pages/route": "/api/pages", "/api/pixels/events/route": "/api/pixels/events", "/api/pixels/route": "/api/pixels", "/api/portfolio/route": "/api/portfolio", "/api/presets/route": "/api/presets", "/api/qris/route": "/api/qris", "/api/qris/settings/route": "/api/qris/settings", "/api/simulator/tick/route": "/api/simulator/tick", "/api/social-accounts/[id]/route": "/api/social-accounts/[id]", "/api/social-accounts/route": "/api/social-accounts", "/api/subscriptions/route": "/api/subscriptions", "/api/survey/config/route": "/api/survey/config", "/api/survey/route": "/api/survey", "/api/track/route": "/api/track", "/api/verify-certificate/route": "/api/verify-certificate", "/api/webinars/[webinarId]/exam/route": "/api/webinars/[webinarId]/exam", "/api/webinars/[webinarId]/register/route": "/api/webinars/[webinarId]/register", "/cek-sertifikat/page": "/cek-sertifikat", "/dashboard/(meta)/ads-manager/page": "/dashboard/ads-manager", "/dashboard/(meta)/ads/[id]/edit/page": "/dashboard/ads/[id]/edit", "/dashboard/(meta)/ads/page": "/dashboard/ads", "/dashboard/(meta)/adsets/[id]/edit/page": "/dashboard/adsets/[id]/edit", "/dashboard/(meta)/adsets/page": "/dashboard/adsets", "/dashboard/(meta)/affiliate/page": "/dashboard/affiliate", "/dashboard/(meta)/audiences/page": "/dashboard/audiences", "/dashboard/(meta)/billing/page": "/dashboard/billing", "/dashboard/(meta)/business-settings/page": "/dashboard/business-settings", "/dashboard/(meta)/campaigns/[id]/edit/page": "/dashboard/campaigns/[id]/edit", "/dashboard/(meta)/campaigns/[id]/page": "/dashboard/campaigns/[id]", "/dashboard/(meta)/create/page": "/dashboard/create", "/dashboard/(meta)/hub/page": "/dashboard/hub", "/dashboard/(meta)/kelas/[slug]/[courseSlug]/[lessonId]/page": "/dashboard/kelas/[slug]/[courseSlug]/[lessonId]", "/dashboard/(meta)/kelas/[slug]/[courseSlug]/page": "/dashboard/kelas/[slug]/[courseSlug]", "/dashboard/(meta)/kelas/[slug]/page": "/dashboard/kelas/[slug]", "/dashboard/(meta)/kelas/page": "/dashboard/kelas", "/dashboard/(meta)/landing-pages/page": "/dashboard/landing-pages", "/dashboard/(meta)/langganan/checkout/page": "/dashboard/langganan/checkout", "/dashboard/(meta)/langganan/page": "/dashboard/langganan", "/dashboard/(meta)/overview/page": "/dashboard/overview", "/dashboard/(meta)/pages/page": "/dashboard/pages", "/dashboard/(meta)/panduan/page": "/dashboard/panduan", "/dashboard/(meta)/pixels/page": "/dashboard/pixels", "/dashboard/(meta)/portfolio/page": "/dashboard/portfolio", "/dashboard/(meta)/profile/page": "/dashboard/profile", "/dashboard/(meta)/sertifikasi/[slug]/page": "/dashboard/sertifikasi/[slug]", "/dashboard/(meta)/sertifikasi/[slug]/sertifikat/page": "/dashboard/sertifikasi/[slug]/sertifikat", "/dashboard/(meta)/sertifikasi/page": "/dashboard/sertifikasi", "/dashboard/(meta)/settings/page": "/dashboard/settings", "/dashboard/(meta)/webinar/[id]/page": "/dashboard/webinar/[id]", "/dashboard/(meta)/webinar/[id]/sertifikat/page": "/dashboard/webinar/[id]/sertifikat", "/dashboard/(meta)/webinar/page": "/dashboard/webinar", "/dashboard/page": "/dashboard", "/dashboard/pemeliharaan/page": "/dashboard/pemeliharaan", "/favicon.ico/route": "/favicon.ico", "/landing/[id]/page": "/landing/[id]", "/login/page": "/login", "/opengraph-image/route": "/opengraph-image", "/page": "/", "/preview-web/page": "/preview-web", "/register/page": "/register", "/robots.txt/route": "/robots.txt", "/sitemap.xml/route": "/sitemap.xml", "/traktir/page": "/traktir" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/opengraph-image": {} } };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {}) && !NextConfig.experimental?.prefetchInlining;
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = event.headers.rsc === "1";
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => escapePathDelimiters(decodeURIComponent(segment), true)).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  try {
    localizedPath = decodePathParams(localizedPath) || "/";
  } catch {
    return event;
  }
  const cacheKey = localizedPath === "/" ? "/index" : localizedPath;
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath) || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(cacheKey);
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(cacheKey, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(cacheKey, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !(event.query.__nextDataReq === "1") && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      headers: {
        ...internalEvent.headers,
        "x-nextjs-data": "1"
      },
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(normalizedPath);
  } catch {
  }
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath) || decodedPath !== void 0 && r.test(decodedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
var NEXT_INTERNAL_HEADERS = [
  "x-middleware-rewrite",
  "x-middleware-redirect",
  "x-middleware-set-cookie",
  "x-middleware-skip",
  "x-middleware-override-headers",
  "x-middleware-next",
  "x-now-route-matches",
  "x-matched-path",
  "x-nextjs-data",
  "x-next-resume-state-length"
];
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith(INTERNAL_HEADER_PREFIX) || lowerCaseKey.startsWith(MIDDLEWARE_HEADER_PREFIX) || NEXT_INTERNAL_HEADERS.includes(lowerCaseKey)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
