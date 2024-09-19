/*
 *   CHECK ITEM IF EXIST IN DATABASE
 *   true => dont run code next
 *   false => run next function()
 */

const checkExist = (Model) => async (req, res, next) => {
  const { id } = req.params;

  try {
    const item = await Model.findById(id);

    if (item) {
      next();
    } else {
      res.status(400).send("This item is not exist in database");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  checkExist,
};
