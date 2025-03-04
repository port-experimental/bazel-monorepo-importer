# bazel-monorepo-importer

WIP - tune back in soon


## Example Blueprints

```
{
  "identifier": "bazel_package",
  "description": "Bazel Package detected in a monorepo FS",
  "title": "Bazel Package",
  "icon": "Microservice",
  "schema": {
    "properties": {
      "type": {
        "type": "string",
        "title": "Type",
        "enum": [
          "library",
          "service"
        ],
        "enumColors": {
          "library": "orange",
          "service": "green"
        }
      },
      "path": {
        "type": "string",
        "title": "Path"
      }
    },
    "required": []
  },
  "mirrorProperties": {},
  "calculationProperties": {},
  "aggregationProperties": {},
  "relations": {
    "repository": {
      "title": "Repository",
      "target": "repository",
      "required": false,
      "many": false
    }
  }
}
```