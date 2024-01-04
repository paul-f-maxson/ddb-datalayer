import { MergeExclusive } from "type-fest"

export const keyedValue =
  <Key extends string, Rec extends Record<Key, string>>(
    key: Key,
    options: { sep: string; keyAlias?: string }
  ) =>
  (record: Rec) =>
    `${
      options.keyAlias !== undefined
        ? options.keyAlias
        : key
    }${options.sep}${record[key]}`

export const list =
  (separator: string) =>
  <Items extends string[]>(items: Items) =>
    items.join(separator)

export const byEntity =
  <
    ParamsKey extends string,
    Params extends Record<ParamsKey, string>,
  >(
    options: { composite: ParamsKey[] } & MergeExclusive<
      { owner: string },
      { ownedBy: ParamsKey }
    >
  ) =>
  (params: Params) =>
    list("|")([
      "ent",
      list("#")(
        options.composite.map((key) =>
          keyedValue(key, { sep: "=" })(params)
        )
      ),
      ...(options.owner !== undefined
        ? [options.owner]
        : options.ownedBy !== undefined
          ? [
              keyedValue(options.ownedBy, {
                sep: "==",
                keyAlias: "onr",
              })(params),
            ]
          : []),
    ])
