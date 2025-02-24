"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// styles
import properties from "./properties.module.css";

// assets


// components
import PropertyCard from "./components/PropertyCard";

export default function Properties() {
  const [propertiesData, setProperties] = useState([]); // State to store the user data

  // Fetch data when the component is mounted
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Determine the API URL based on the environment
          // Default to localhost if no environment variable is set

        

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties`); // Call your API
        const data = await response.json(); // Parse the JSON response
        setProperties(data); // Store the data in state
      } catch (error) {
        console.error('Error fetching properties:', error); // Handle any errors
      }
    };

    fetchProperties(); // Trigger the fetch when the component mounts
  }, []); // The empty dependency array ensures this only runs on initial render  

  return (
    <div className={properties.main_content_container}>

      <div className={properties.main_cta_row}>
      <div className={properties.cta_filter_div}>
          <Link href="/properties" className={`${properties.cta_filt_btn} ${properties.cta_filt_active_btn}`}>
            Owned
          </Link>

          <Link href="/properties" className={`${properties.cta_filt_btn}`}>
            Constructing
          </Link>
        </div>

        <div className={properties.cta_pagination_div}>

        </div>

        <Link href="/properties">
          <div className={properties.cta_search_div}>
            
          </div>
        </Link>

        <Link href="/properties/new-property" className={properties.cta_newprop_btn}>
          New Property
        </Link>
      </div>

      <div className={properties.main_grid_container}>

        {/* Check if properties data is available and map through it */}
        {propertiesData.length > 0 ? (
          propertiesData.map((property) => (
            <PropertyCard key={property._id} propertyInfo={property} />
          ))
        ) : (
          <p>No properties available</p> // Fallback message if no properties are found
        )}
      </div>
    </div>
  );
}
