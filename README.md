# Cookery

Cookery is a tool for converting Open Recipe Format (ORF) files to a cookbook
in PDF format. It uses a slightly modified version of the format that can be
found [here](https://github.com/jordanhatcher/openrecipeformat).

## Installation
Clone this repo, and change into the cookery directory:
`git clone https://github.com/jordanhatcher/cookery && cd cookery`

Install the package globally (may need sudo):
`npm install -g --unsafe-perm`

Verify the installation:
`cookery --version`

## Usage

As an example, change into the examples directory, and run:
`cookery --name MyExampleCookbook`

In the directory you run `cookery` from, there should be two things:
1. A file `recipeBook.yml` containing a key `recipes` with the value
being an ordered list of relative file paths to ORF files to be included in
the book.
2. The ORF files specified in the `recipeBook.yml` file.

Example structure of the `recipeBook.yml` file:
```yaml
recipes:
  - recipe1.yaml
  - recipe2.yaml
  - recipe3.yaml
```

## Contributing

Feel free to work one of the issues created for this project, or create a pull
request with any features you think would be nice to have!
