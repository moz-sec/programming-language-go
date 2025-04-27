<div align="center">

# Train Trail

<img src="https://github.com/moz-sec/programming-language-go/blob/main/train-trail/images/logo.png" width="200">

[![Lang](https://img.shields.io/badge/Go-1.23+-blue.svg?logo=go)](https://go.dev/)

`Train Trail` is track your train rides.

</div>

## Description

## Usage

## Technologies

| Technology | Version |
|------------|---------|
| Frontend | React |
| Backend | Go(Wails) |
| Map | Leaflet.js + OpenStreetMap + GeoJSON |
| DataFormat | GeoJSON + JSON |

### OpenStreetMap

It's like Wikipedia, where everyone can create map data from all over the world.

It is a database of all kinds of geographic data.

- Roads
- Railroad lines
- Train stations
- Bus stops
- Buildings
- Mountains, rivers, parks
etc.

Extract route maps by using [overpass turbo](https://overpass-turbo.eu/), a browser-based query tool for extracting only the necessary information from OpenStreetMap data.

Example: This query with overpass turbo, you can get the Kyoto city conventional line

```txt
[out:json][timeout:25];
area["name"="京都市"]->.searchArea;
(
  way["railway"="rail"](area.searchArea);
);
out geom;
```

### GeoJSON

It is a data format for expressing geographic information (location information) in JSON format.

Various information can be written in JSON format.

- Location (latitude and longitude)
- Line (road/line)
- Surface (lake/park)
