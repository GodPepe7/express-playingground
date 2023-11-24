const phonebookRouter = require("express").Router();
const Person = require("../models/person");

phonebookRouter.get("/info", (request, response) => {
  Person.countDocuments({}).then((size) => {
    response.json(size);
  });
});

phonebookRouter.get("/", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

phonebookRouter.post("/", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

phonebookRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

phonebookRouter.put("/:id", (request, response, next) => {
  const { name, number } = request.body;
  const id = request.params.id;
  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

phonebookRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = phonebookRouter;
