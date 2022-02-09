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

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (title === undefined || contents === undefined) {
    return res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  }
  posts
    .update(id, { title, contents })
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
        .json({ message: "The post information could not be modified" });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  posts
    .remove(id)
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
        .json({ message: "The comments information could not be retrieved" });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  posts
    .findCommentById(id)
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
        .json({ message: "The comments information could not be retrieved" });
    });
});

module.exports = router;
