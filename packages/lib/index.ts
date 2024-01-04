export const defineEntity = <
  StaticAttributes extends Record<string, string | number>,
  CalculatedAttributes extends Record<
    string,
    string | number
  >,
>(makeKeys: {
  [k in keyof CalculatedAttributes]: (
    staticAttributes: StaticAttributes
  ) => CalculatedAttributes[k]
}) => ({
  create: (staticAttributes: StaticAttributes) => ({
    ...staticAttributes,
    ...Object.entries(
      makeKeys
    ).reduce<CalculatedAttributes>(
      (
        calculatedAttributes,
        [calculatedAttribute, buildCalculatedAttribute]
      ) => ({
        ...calculatedAttributes,
        [calculatedAttribute]: buildCalculatedAttribute(
          staticAttributes
        ),
      }),
      {} as CalculatedAttributes
    ),
  }),
})
