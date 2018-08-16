const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const { find } = require('lodash');
const authors = [
    { id: 1, firstName: 'Tom', lastName: 'Coleman' },
];

const posts = [
    { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
    { id: 2, title: 'Welcome to Apollo', votes: 3 },
];

const typeDefs = `
    type Author {
        id: ID!
        firstName: String
    }

    type Post {
        id: ID!
        title: String
        author: Author
    }

    type Query {
        posts: [Post]
    }

    schema {
        query: Query
    }
`;

const resolvers = {
    Query: {
        posts() {
            return posts;
        },
    },
    Post: {
        author(post) {
            return find(authors, { id: post.authorId });
        },
    },
};

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

addMockFunctionsToSchema({
    schema: executableSchema,
    preserveResolvers: true,
});

graphql(executableSchema, '{posts{id, author{id}}}')
    .then(res => {
        console.log(JSON.stringify(res.data.posts, null, 4));
    })