/**
 * List of section UUIDs of whose measures should sum to 100%
 * This will be moved to a property on each section on the backend.
 */
export const SECTIONS_SUM_100_PERCENT = [
  '749bf19f-e255-4361-af96-6dce5d6f006b', // Heating technologies
  'e34af0e2-a881-4d29-b829-6ef46f4e4afa', // Share of district heating as
  'b6ad5163-6969-4f1a-8ec9-964515040f75', // Share of waste used in district heating that is fossil / non-fossil
  '79e0591a-61c1-4780-954e-7720cca2867b', // Share of local heating as
  '7563b3a4-98b4-4379-8519-2f72b3ba0e96', // Share of total electricity demand produced by fossil/renewables
  'e0b4b50e-35f4-4de4-9ba9-ea17c12daea0', // Share recycling/incineration/landfill > Paper waste
  '916f56b1-6bf4-4c88-90a9-7c5dd1760368', // Share recycling/incineration/landfill > Metal waste
  '70c4b234-5586-48a9-8545-21f71312c72a', // Share recycling/incineration/landfill > Plastic waste
  'c09b0c73-1ead-4b80-9a57-69079f938113', // Share recycling/incineration/landfill > Glass waste
  '0538d7df-0f9c-452b-b259-a20c4d259180', // Share recycling/incineration/landfill > Organic waste
  '72c396c4-74de-4116-bba6-f384f9c7ea8d', // Share recycling/incineration/landfill > Other waste (e.g. textiles, rubble, wood)
  'a7deacd1-1370-4712-a40d-f8ef93a5b2a4', // Share of car + motorcycle km reduced shifted towards other modes
  // '22366b8b-abde-475d-a402-5d2574e3df29', // Expected procurement schedule for buses
  '2848cc15-1054-44c3-8c26-f033f1feabee', // Assumed share of type of renovation in lever
  'd198ca7f-d329-4cdd-ac53-e41609c38fa2', // Share of new buildings built with high energy efficiency standards
  '054fc1d2-281d-435b-9870-cb4deff8ca7e', // Assumed share of type of efficiency programme for lever
  'dcf9ba68-515f-4af2-93b3-4fe4dcef46ce', // Heating technologies in 2030
  '6a903c6f-eceb-405d-8380-6a5a89010f45', // Share of district heating in 2030 as
  '1ca7adef-3b01-44bd-918b-aaa246819c98', // Share of waste in 2030 used in district heating that is fossil / non-fossil
  'd2e573d5-6829-43c0-a0f8-cc1428dbf926', // Share of local heating in 2030 as
  'f64bd1a0-75e6-4471-83dd-15474c28baab', // Distribution of type of new renewables
  '7b59c1e4-360c-408c-a65f-617be9cee03b', // Treatment of paper, 2030
  'd57d0191-19f3-4e10-b611-e80ccad9f662', // Treatment of metals, 2030
  '8c862673-aa1d-42ab-973c-1726971524f3', // Treatment of plastics, 2030
  'c074f270-99fb-46b5-a59f-60709f67b70e', // Treatment of glass, 2030
  'eb857095-f70b-4c09-ae51-dde4bce8083e', // Treatment of organic, 2030
];

export const additionalMeasures = [
  {
    uuid: 'c3f157c0-ae56-470f-9ac7-e7ac0080626d',
    question:
      'What was the total distance travelled by passenger cars and motorcycles?',
    id: 207,
    label: 'Passenger transportation',
  },
  {
    uuid: '0791d065-3de0-4667-939f-056055677973',
    question: 'What was the total distance travelled by buses?',
    id: 208,
    label: 'Passenger transportation',
  },
  {
    uuid: '2be6f9ef-1745-40bf-9498-e9eeb4fdb984',
    question:
      'What percentage of passenger cars and motorcycles were fully electric (excluding hybrids)?',
    id: 224,
    label: 'Passenger transportation',
  },
  {
    uuid: '8a0ddf12-611d-45c0-b51b-c5722f5fb88c',
    question:
      'What percentage of buses were fully electric (excluding hybrids)?',
    id: 226,
    label: 'Passenger transportation',
  },
  {
    uuid: 'beac92cf-c0c5-4921-8019-1a464d2a4fc0',
    question:
      'How many light duty trucks (<3.5 tonnes) were registered in the city?',
    id: 242,
    label: 'Freight transportation',
  },
  {
    uuid: '3f433a95-e490-48c5-b629-3cffa0a132bb',
    question:
      'How many heavy duty trucks (>3.5 tonnes) were registered in the city?',
    id: 243,
    label: 'Freight transportation',
  },
  {
    uuid: 'f3fc1e37-d5bf-42d4-ae1e-d5ddc8acfc08',
    question:
      'What percentage of light duty trucks were fully electric (excluding hybrids)?',
    id: 404,
    label: 'Freight transportation',
  },
  {
    uuid: '89c7e112-6102-463a-94e8-c34a6a5d943a',
    question:
      'What percentage of heavy duty trucks were fully electric (excluding hybrids)?',
    id: 405,
    label: 'Freight transportation',
  },
  {
    uuid: 'f0401b8f-b988-45f8-bb09-252c33ce330f',
    question:
      "What percentage of the city's total building stock underwent energy efficiency renovations?",
    id: 247,
    label: 'Buildings & heating',
  },
  {
    uuid: '0ae5fb06-48a4-4774-9799-ccfa4e8f44a5',
    question:
      'What was the total heating demand (including space heating, domestic hot water, and heat for cooking)?',
    id: 252,
    label: 'Buildings & heating',
  },
  {
    uuid: '83080b15-af7d-44e9-bab2-cefe151879b3',
    question:
      'What percentage of the total heating demand was met by: District heating?',
    id: 253,
    label: 'Buildings & heating',
  },
  {
    uuid: 'b38b5eb7-fb3c-4cfe-999e-29a349d302cd',
    question:
      'What percentage of the total heating demand was met by: Local heating?',
    id: 254,
    label: 'Buildings & heating',
  },
  {
    uuid: 'ef9b2521-c413-4513-8251-a80700d2e558',
    question:
      'What percentage of district heating was provided by electric heat pumps?',
    id: 256,
    label: 'Buildings & heating',
  },
  {
    uuid: '804ac52f-8c7a-4b79-a56a-ed50f62ba8ad',
    question:
      'What percentage of local heating was provided by: Electric heat pumps?',
    id: 262,
    label: 'Buildings & heating',
  },
  {
    uuid: 'c8091681-cc83-416c-b4d2-7965b441e94e',
    question:
      'What percentage of local heating was provided by: Biobased / solar water heating?',
    id: 263,
    label: 'Buildings & heating',
  },
  {
    uuid: '3b58ecda-77bb-4ac6-80bf-7f802442bbb4',
    question:
      'What percentage of local heating was provided by: Inefficient electric heating (not heat pumps)?',
    id: 255,
    label: 'Buildings & heating',
  },
  {
    uuid: '5f7c8175-d3ae-4e05-9179-325b84934ead',
    question:
      'What was the total electricity demand within the city boundaries?',
    id: 272,
    label: 'Electricity',
  },
  {
    uuid: 'b132697d-6a72-476c-aed5-d3fa3886d943',
    question:
      'What was the share of electricity production from renewable sources (excluding local solar PV)?',
    id: 273,
    label: 'Electricity',
  },
  {
    uuid: 'fbf3fa68-30be-47c5-a368-decd9d6f16e2',
    question:
      'What were the total CO2e emissions from industrial processes and product use (IPPU)?',
    id: 327,
    label: 'Greenhouse gases',
  },
  {
    uuid: '58c99d80-8b05-4573-8291-9252560414fd',
    question:
      'What were the total CO2e emissions from other sources not included in previous categories?',
    id: 329,
    label: 'Greenhouse gases',
  },
];
