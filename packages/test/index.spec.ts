import { MakeKeys, defineEntity } from "@ddb-datalayer/lib"

import {
  byCollection,
  keyedValue,
} from "@ddb-datalayer/lib/keyConstructors"

it("works", () => {
  type UserCalculatedAttributes = {
    pk: string
    sk: string
    gsi1pk: string
    gsi1sk: string
  }

  type UserSuppliedAttributes = {
    userId: string
    name: string
    favoriteColor: string
  }

  type MakeUserKeys = MakeKeys<
    UserSuppliedAttributes,
    UserCalculatedAttributes
  >

  const pk: MakeUserKeys["pk"] = byCollection({
    name: "usr",
    composite: [{ key: "userId", keyAlias: "uid" }],
    ownedBy: "userId",
  })

  const sk: MakeUserKeys["sk"] = () => "data"

  const gsi1sk: MakeUserKeys["gsi1sk"] = keyedValue({
    key: "userId",
    keyAlias: "uid",
  })

  const gsi1pk: MakeUserKeys["gsi1pk"] = byCollection({
    name: "colors",
    composite: [
      { key: "favoriteColor", keyAlias: "favclr" },
    ],
  })

  const User = defineEntity<
    UserSuppliedAttributes,
    UserCalculatedAttributes
  >({ pk, sk, gsi1pk, gsi1sk })

  const userDataById = User.defineQuery({
    pk: "pk",
    sk: "sk",
  })

  const usersByFavClr = User.defineQuery({
    pk: "gsi1pk",
    sk: "gsi1sk",
  })

  const u1 = User.generateAttributes({
    userId: "12345",
    name: "John Doe",
    favoriteColor: "red",
  })

  const u2 = User.generateAttributes({
    userId: "67890",
    name: "Jane Doe",
    favoriteColor: "red",
  })

  const q1 = userDataById({ userId: "12345" })

  const q2 = usersByFavClr({ favoriteColor: "red" })

  expect(u1).toEqual({
    userId: "12345",
    name: "John Doe",
    favoriteColor: "red",
    pk: "col=usr|uid=12345|onr==12345",
    sk: "data",
    gsi1pk: "col=colors|favclr=red",
    gsi1sk: "uid=12345",
  })

  expect(u2).toEqual({
    userId: "67890",
    name: "Jane Doe",
    favoriteColor: "red",
    pk: "col=usr|uid=67890|onr==67890",
    sk: "data",
    gsi1pk: "col=colors|favclr=red",
    gsi1sk: "uid=67890",
  })

  expect(q1).toEqual({
    pk: "col=usr|uid=12345|onr==12345",
    sk: { exact: "data" },
  })

  expect(q2).toEqual({
    pk: "col=colors|favclr=red",
    sk: {},
  })
})
