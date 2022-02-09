// implement your posts router here
const posts = require("./posts-model");
const router = require("express").Router();

router.get("/", (req, res) => {
  posts
    .find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  posts
    .findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (title === undefined || contents === undefined) {
    return res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  }
  posts
    .insert(req.body)
    .then((post) => {
      post = { id: post.id, title, contents };
      res.status(201).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "There was an error while saving the post to the database",
      });
    });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (title === undefined || contents === undefined) {
    return res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  }

  const updatedPost = await posts.update(id, { title, contents });

  try {
    if (!updatedPost) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const postId = await posts.findById(id);
      res.status(200).json(postId);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The post information could not be modified" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deletedPost = await posts.remove(id);

  try {
    if (!deletedPost) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const postID = await posts.findById(id);

      res.status(200).json(postID.id);
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "The comments information could not be retrieved" });
  }
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;

  const postId = await posts.findCommentById(id);

  try {
    if (!postId) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const postComment = await posts.findPostComments(postId);
      res.status(200).json(postComment);
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "The comments information could not be retrieved" });
  }
});

module.exports = router;
