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

To generate an example cookbook called "MyExampleCookbook.pdf,
change into the examples directory, and run:
`cookery --name MyExampleCookbook`

In the directory you run `cookery` from, there should be two things:
1. A config file named `cookbook.yml` or `cookbook.yaml` containing a key `recipes` with the value
being an ordered list of relative file paths to ORF files to be included in
the book. Alternatively, a different yaml file can be used with the `-c | --config` command
line option.

2. The ORF files specified in the configuration file.

Example structure of the configuration file:
```yaml
recipes:
  - recipe1.yaml
  - recipe2.yaml
  - recipe3.yaml
```

## Contributing

Feel free to work one of the issues created for this project, or create a pull
request with any features you think would be nice to have!
