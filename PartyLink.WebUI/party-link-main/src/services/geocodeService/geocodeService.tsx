import Geocode from "react-geocode";
import { IEventLocation } from "../eventService/eventService";

Geocode.setApiKey(import.meta.env.VITE_PUBLIC_MAP_API_KEY);
Geocode.setLanguage("en");
Geocode.setRegion("ua");

export interface IAddressFormat {
  city?: string,
  state?: string,
  country?: string,
  street?: string,
  streetNumber?: string,
}

const getAddress = (results: any[]): IAddressFormat => {
  const address: IAddressFormat = {};

  for (let i = 0; i < results[0].address_components.length; i++) {
    for (let j = 0; j < results[0].address_components[i].types.length; j++) {
      switch (results[0].address_components[i].types[j]) {
        case "locality":
          address.city = results[0].address_components[i].long_name;
          break;
        case "administrative_area_level_1":
          address.state = results[0].address_components[i].long_name;
          break;
        case "country":
          address.country = results[0].address_components[i].long_name;
          break;
        case "route":
          address.street = results[0].address_components[i].long_name;
          break;
        case "street_number":
          address.streetNumber = results[0].address_components[i].long_name;
          break;
      }
    }
  }

  return address;
}

export const geocodeService = {
  getAddressFromLocation: async (location: IEventLocation) => {
    try {
      Geocode.setLocationType("ROOFTOP");
      const { results: rtResults } = await Geocode.fromLatLng(String(location.latitude), String(location.longitude));
      if (rtResults) {
        let { city: rtCity, country: rtCountry, street: rtStreet, streetNumber: rtStreetNumber } = getAddress(rtResults);
        const rtAddressParts = [rtCountry, rtCity, rtStreet, rtStreetNumber].filter(Boolean);
        if (rtAddressParts.length > 0) {
          return rtAddressParts.join(", ");
        }
      }
      return "";
    }
    catch (error) {
      Geocode.setLocationType("APPROXIMATE");
      const { results: aResults } = await Geocode.fromLatLng(String(location.latitude), String(location.longitude));
      let { city: aCity, state: aState, country: aCountry, street: aStreet, streetNumber: aStreetNumber } = getAddress(aResults);
      const aAddressParts = [aCountry, aState, aCity, aStreet, aStreetNumber].filter(Boolean);
      if (aAddressParts.length > 0) {
        return aAddressParts.join(", ");
      }
      return "";
    }
  }
}