// GraphQL selections shared by server and client code (no secrets here).
export const POST_CARD_FIELDS = `
  _id title slug excerpt tags readTime createdAt postType space
  category { name slug }
  author { _id name avatarUrl }
`;
