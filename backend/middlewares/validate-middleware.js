const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (error) {
    console.log("Validation error:", error.errors);
    res.status(400).json({ 
      msg: "Validation failed", 
      errors: error.errors 
    });
  }
};

module.exports = validate;