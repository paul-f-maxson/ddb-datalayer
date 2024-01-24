export type MakeKeys<
  SuppliedAttributes extends Record<string, string>,
  CalculatedAttributes extends Record<string, string>,
> = {
  [k in keyof CalculatedAttributes]: (
    staticAttributes: SuppliedAttributes
  ) => CalculatedAttributes[k]
}

export const defineEntity = <
  SuppliedAttributes extends Record<string, string>,
  CalculatedAttributes extends Record<string, string>,
>(
  makeKeys: MakeKeys<
    SuppliedAttributes,
    CalculatedAttributes
  >
) => ({
  generateAttributes: (
    suppliedAttributes: SuppliedAttributes
  ) => ({
    ...suppliedAttributes,
    ...Object.entries<
      (staticAttributes: SuppliedAttributes) => unknown
    >(makeKeys).reduce<CalculatedAttributes>(
      (
        calculatedAttributes,
        [calculatedAttribute, buildCalculatedAttribute]
      ) => ({
        ...calculatedAttributes,
        [calculatedAttribute]: buildCalculatedAttribute(
          suppliedAttributes
        ),
      }),
      {} as CalculatedAttributes
    ),
  }),
  defineQuery: () => ({
    generateAttributes: () => ({}),
  }),
})
