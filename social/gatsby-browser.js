import React from "react"
import { ApolloProvider } from "@apollo/react-hooks"
import { ApolloClient } from "apollo-client"
import { createHttpLink } from "apollo-link-http"
import { ApolloLink } from "apollo-link"
import { InMemoryCache } from "apollo-cache-inmemory"
import { getCurrentUser } from "./src/utils/auth"
import netlifyIdentity from "netlify-identity-widget"

const cache = new InMemoryCache()

const httpLink = createHttpLink({
  uri: "https://stayingathomeclub-itdev164.herokuapp.com/v1/graphql",
})
// inject auth
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: `Bearer ${getCurrentUser().token.access_token}` || null,
    },
  })
  return forward(operation)
})

// use with apollo-client
const link = middlewareLink.concat(httpLink)

const client = new ApolloClient({
  link,
  cache,
})

window.netlifyIdentity = netlifyIdentity
// You must run this once before trying to interact with the widget
netlifyIdentity.init()


export const wrapRootElement = ({ element }) => {
  return <ApolloProvider client={client}>{element}</ApolloProvider>
}