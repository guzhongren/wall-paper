import React, {useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {mm2px} from '../../utils/mm2px'

import './index.scss';

import Exporter from '../../components/Exporter'
import { IRootState } from '../../components/Exporter/exporterSlice'

declare global {
  interface Window {
    mapInstance: any
  }
}

function WallPaper() {

  const [mapHeight, setHeight] = useState(window.innerHeight)
    const [mapWidth, setWidth] = useState(window.innerWidth)
  
  let mapRef = useRef<HTMLDivElement>(null)
  const {currentModel} = useSelector((state: IRootState) => state.exporter)
  
  const {height, width} = useSelector((state: IRootState) => state.exporter)
  
  useEffect(() => {
    if(currentModel === 'PC') {
      setHeight(height)
      setWidth(width)
    } else {
      setHeight(mm2px(height))
      setWidth(mm2px(width))
    }
  }, [height, width, currentModel])


  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3V6aG9uZ3JlbiIsImEiOiJjajh0Z3ZvNXowbHF6MzNxenpoaTlqZnh0In0.UjqQlTKebjUEfWD6ZlVV7g'
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/guzhongren/ck9qomecy5v3z1is8k9cynq6r',
      center: [104.757, 35.116],
      zoom: 1,
      preserveDrawingBuffer: true
    })
    window.mapInstance = mapInstance
  }, [])



  return (
    <React.Fragment>
      <div id='map' ref={mapRef} className='map' style={{width: `${mapWidth}px`, height: `${mapHeight}px`}}>
      </div>

      <Exporter />
    </React.Fragment>
  );
}

export default WallPaper;
