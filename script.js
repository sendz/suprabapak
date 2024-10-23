const toggleMenu = () => {
  const menu = document.getElementById('menu').classList.toggle('open');
  const map = document.getElementById('map');

  if (window.innerWidth <= 768) {
      if (menu.classList.contains('open')) {
          map.style.marginLeft = '100%';
      } else {
          map.style.marginLeft = '0';
      }
  }
}

const showSidebar = () => {
  document.getElementById('sidebar').classList.add('open');
}

const closeSidebar = () => {
  document.getElementById('sidebar').classList.remove('open');
}

function handleResize() {
  const menu = document.getElementById('menu');
  const map = document.getElementById('map');
  if (window.innerWidth > 768) {
      menu.classList.add('open');
      map.style.marginLeft = '250px';
  } else {
      menu.classList.remove('open');
      map.style.marginLeft = '0';
  }
}

// Add event listener for window resize
window.addEventListener('resize', handleResize);

function closeMenu() {
  const menu = document.getElementById('menu');
  const map = document.getElementById('map');
  menu.classList.remove('open');
  if (window.innerWidth <= 768) {
      map.style.marginLeft = '0';
  }
}



let markers = []

const map = L.map('map', {
  center: [52, -0.09],
  zoom: 12,
  zoomControl: false
})

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

L.control.zoom({
  position: 'bottomright'
}).addTo(map)

const getColor = (magnitude) => {
  if (magnitude > 5) {
    return '#FF0000'
  }

  if (magnitude > 4) {
    return '#FF6600'
  }

  if (magnitude > 3) {
    return '#FFCC00'
  }

  return '#00CC00';
}

const clearMakers = () => {
  console.log('clear', markers)
  markers.forEach(marker => map.removeLayer(marker))
  markers = []
}

const createMarker = ({ coordinates, magnitude, time, location, depth }) => {
  const marker = L.circleMarker(coordinates, {
    radius: magnitude * 2,
    fillColor: getColor(magnitude),
    color: 'black',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }).bindPopup(`
<strong>Magnitude: </strong>${magnitude} SR<br />
<strong>Kedalaman: </strong>${depth}<br />
<strong>Lokasi: </strong>${location}<br />
<strong>Waktu: </strong>${time}
  `)
  markers.push(marker)
  return marker
}

const fetchLatestEarthquake = async () => {
  const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
  const data = await response.json()

  console.log(data.Infogempa.gempa)
  const {
    Coordinates,
    Magnitude,
    Wilayah,
    DateTime,
    Kedalaman,
  } = data.Infogempa.gempa

  createMarker({
    coordinates: Coordinates.split(','),
    magnitude: Number(Magnitude),
    location: Wilayah,
    time: new Date(DateTime).toLocaleString(),
    depth: Kedalaman
  }).addTo(map)

  map.setView(Coordinates.split(','), 8)
}

const fetchStrongEarthquakes = async (url) => {
  const response = await fetch(url)
  const data = await response.json()

  console.log(data.Infogempa.gempa)
  const {
    gempa
  } = data.Infogempa

  gempa.forEach(data => {
    const {
      Coordinates,
      Magnitude,
      Wilayah,
      DateTime,
      Kedalaman,
    } = data

    createMarker({
      coordinates: Coordinates.split(','),
      magnitude: Number(Magnitude),
      location: Wilayah,
      time: new Date(DateTime).toLocaleString(),
      depth: Kedalaman
    }).addTo(map)
  })

  const strongest = Math.max(...gempa.map(d => Number(d.Magnitude)))
  console.log(strongest)
  map.setView(gempa.find(d => Number(d.Magnitude) >= strongest).Coordinates.split(','), 5)
}

const showLatest = async () => {
  clearMakers()
  await fetchLatestEarthquake()
  closeMenu()
}

const showStrong = async () => {
  clearMakers()
  await fetchStrongEarthquakes('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json')
  closeMenu()
}

const showRecent = async () => {
  clearMakers()
  await fetchStrongEarthquakes('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json')
  closeMenu()
}
