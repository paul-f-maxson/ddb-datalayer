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
  create: (suppliedAttributes: SuppliedAttributes) => ({
    ...suppliedAttributes,
    ...Object.entries(
      makeKeys
    ).reduce<CalculatedAttributes>(
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
})
