import type { Register } from "./types/register";
import type { Equal } from "./types/utils";

type AnyParams = Record<string, Record<string, string | undefined>>;
type Params = Register extends {
  params: infer RegisteredParams extends AnyParams;
}
  ? RegisteredParams
  : AnyParams;

type HrefArgs = { [K in keyof Params]: ToHrefArgs<Params[K]> };

// prettier-ignore
type ToHrefArgs<T> =
  // path without params -> no `params` arg
  Equal<T, {}> extends true ? [] :
  // path with only optional params -> optional `params` arg
  Partial<T> extends T ? [T] | [] :
  // otherwise, require `params` arg
  [T];

/**
  Returns a resolved URL path for the specified route.

  ```tsx
  const h = href("/:lang?/about", { lang: "en" })
  // -> `/en/about`

  <Link to={href("/products/:id", { id: "abc123" })} />
  ```
 */
export function href<Path extends keyof HrefArgs>(
  path: Path,
  ...args: HrefArgs[Path]
): string {
  let params = args[0];
  return path
    .split("/")
    .map((segment) => {
      const match = segment.match(/^:([\w-]+)(\?)?/);
      if (!match) return segment;
      const param = match[1];
      if (params === undefined) {
        throw Error(`Path '${path}' requires params but none were provided`);
      }
      return params[param];
    })
    .join("/");
}
