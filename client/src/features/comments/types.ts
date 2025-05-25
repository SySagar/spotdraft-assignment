export type AddCommentPayload = {
  content: string; // serialized TipTap JSON
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
};
