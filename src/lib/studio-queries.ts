// GraphQL used by the Studio (author's own posts, any status).
export const EDIT_FIELDS = `
  _id title slug body bodyFormat excerpt postType status scheduledAt tags summary space
  readTime viewCount bookmarksCount createdAt updatedAt narrationUrl narrationDuration
  category { _id name slug } series { _id title slug }
  gallery { url publicId width height alt order downloadUrl variants { thumbnail landscape original } }
`;

export const MY_POST_FIELDS = `_id title slug status scheduledAt viewCount bookmarksCount createdAt updatedAt postType space`;
