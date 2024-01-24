import { MergeExclusive } from "type-fest"

export const keyedValue =
  <
    Key extends string,
    Sep extends string,
    KeyAlias extends string,
    Rec extends Record<Key, string>,
  >(options: {
    key: Key
    sep?: Sep
    keyAlias?: KeyAlias
  }) =>
  (record: Rec) =>
    `${
      options.keyAlias !== undefined
        ? options.keyAlias
        : options.key
    }${options.sep !== undefined ? options.sep : "="}${
      record[options.key]
    }`

const join =
  (separator: string) =>
  <Items extends string[]>(items: Items) =>
    items.join(separator)

export const byCollection =
  <
    ParamsKey extends string,
    Params extends Record<ParamsKey, string>,
  >(
    options: {
      name: string
      composite: Parameters<typeof keyedValue>[0][]
    } & Partial<
      MergeExclusive<
        { owner: string },
        { ownedBy: ParamsKey }
      >
    >
  ) =>
  (params: Params) => {
    const name = `col=${options.name}`

    const keyedValues = join("#")(
      options.composite.map((options) =>
        keyedValue(options)(params)
      )
    )

    // The next three statements conduct some wierd logic
    // to deal with the mutually exclusive options of
    // specifying an owner by a static string,
    // specifying it from a property,
    // or not specifying one at all

    const owner = [options.owner!]

    const ownedBy = [
      keyedValue({
        key: options.ownedBy!,
        sep: "==",
        keyAlias: "onr",
      })(params),
    ]

    // This should technically be an xor but js doesn't really
    // have one, and the typing negates this possibility
    const doIncludeOwner = options.owner || options.ownedBy

    return join("|")([
      name,
      keyedValues,
      // spreading an empty array is essentially a noop
      ...(!doIncludeOwner
        ? []
        : options.ownedBy !== undefined
          ? ownedBy
          : owner),
    ])
  }
