import { defineEntity } from "@ddb-datalayer/lib"

import { byEntity } from "@ddb-datalayer/lib/keyConstructors"

it("works", () => {
  const pk = byEntity({
    composite: ["foo", "bar"],
    ownedBy: "foo",
  })

  const Ent = defineEntity<
    { foo: string; bar: string; baz: string },
    { pk: string; sk: string }
  >({ pk, sk: ({ bar }) => `bar-${bar}` })

  const e = Ent.create({
    foo: "apples",
    bar: "red",
    baz: "oak",
  })

  expect(e).toEqual({
    bar: "red",
    baz: "oak",
    foo: "apples",
    pk: "ent|foo=apples#bar=red|onr==apples",
    sk: "bar-red",
  })
})
