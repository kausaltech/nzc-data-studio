/**
 * The expected output based on receiving data-request.csv.ts as an input. If the structure
 * of the csv parsing output changes, generate a new output and copy it here.
 */
const ALL_MEASURES = new Map([
  ['3779efa4-9eb0-4f4b-b5d5-eb510461bed8', { label: 'Population', value: 820000, comment: '' }],
  [
    'ef124e9e-51a3-4cf1-99f2-7f925ab253e0',
    {
      label: 'Expected annual population growth (up until 2030)',
      value: 0.2,
      comment: '',
    },
  ],
  ['63f11aa5-f09c-4f54-a2c0-65738680ffdd', { label: 'City Area', value: 139, comment: '' }],
  [
    'c3f157c0-ae56-470f-9ac7-e7ac0080626d',
    {
      label: 'Transport need - passenger cars + motorcycles',
      value: 3003,
      comment: '',
    },
  ],
  [
    '0791d065-3de0-4667-939f-056055677973',
    { label: 'Transport need - buses', value: 482, comment: '' },
  ],
  [
    '1fe61660-fdce-4ea2-96ef-db0831dd2ee0',
    { label: 'Transport need - trains/metro', value: 476, comment: '' },
  ],
  [
    '53b815ee-ad74-4aad-8096-3ba19af4e6f4',
    { label: 'Transport need - walking/cycling', value: 2063, comment: '' },
  ],
  [
    '5d906005-023d-485f-ac27-851fabba2479',
    {
      label: 'Average passengers per car + motorcycle',
      value: 1.2,
      comment: '',
    },
  ],
  [
    '7ebdb840-c4f2-4917-a55b-f90818ce116c',
    { label: 'Average passengers per bus', value: 21, comment: '' },
  ],
  [
    '1869b124-b2c4-4ce2-b7ca-dc477b957bbb',
    { label: 'Average passengers per metro train', value: 40, comment: '' },
  ],
  ['e7b12aeb-e591-4cba-96e7-9901fb95d0fb', { label: 'CO2e emissions', value: 130, comment: '' }],
  ['1a328799-4774-4901-be1f-e6b46fb84ef7', { label: 'NOx emissions', value: 0.61, comment: '' }],
  ['8e9c2502-128f-4368-ad09-debb8d2e06c8', { label: 'PM 2.5 emissions', value: 0.02, comment: '' }],
  ['ac14daee-a60e-445a-b56b-bc0600e9788d', { label: 'PM 10 emissions', value: 0.03, comment: '' }],
  ['e2f0c38d-5b98-4634-8faf-ea07caae26a5', { label: 'CO2e emissions', value: 800, comment: '' }],
  ['80414475-5306-4e66-8ff9-c15f346c61fe', { label: 'NOx emissions', value: 3.22, comment: '' }],
  ['56ad8ce0-a583-4011-846d-ad44cbc92052', { label: 'PM 2.5 emissions', value: 0.07, comment: '' }],
  ['5c1b815c-6c13-4303-b9ff-f641cd725c4e', { label: 'PM 10 emissions', value: 0.1, comment: '' }],
  [
    'b8cb403d-e12e-4c79-be6c-ff2fd7c0016b',
    {
      label: 'Total number of cars + motorcycles in city',
      value: 360259,
      comment: '',
    },
  ],
  [
    'f0479ebd-e0b9-43ee-ad71-67f958529c54',
    {
      label: 'Share of fleet that is less than 2 years old',
      value: 10,
      comment: '',
    },
  ],
  [
    '2be6f9ef-1745-40bf-9498-e9eeb4fdb984',
    {
      label: 'Share of fleet fully electric (not including hybrids)',
      value: 0.3,
      comment: '',
    },
  ],
  [
    '52393800-c525-4839-b651-0dea8c948003',
    { label: 'Number of buses in city bus fleet', value: 934, comment: '' },
  ],
  [
    '8a0ddf12-611d-45c0-b51b-c5722f5fb88c',
    {
      label: 'Share of bus fleet as fully electric buses (not including hybrids)',
      value: 0,
      comment: '',
    },
  ],
  [
    'd8b2e6d8-72f7-4b5f-a614-550ecb800d6d',
    { label: 'Share of bus fleet - biobased', value: 0, comment: '' },
  ],
  [
    'beac92cf-c0c5-4921-8019-1a464d2a4fc0',
    { label: 'Light duty trucks <3.5 tonnes', value: 118, comment: '' },
  ],
  [
    '3f433a95-e490-48c5-b629-3cffa0a132bb',
    { label: 'Heavy duty trucks >3.5 tonnes', value: 337, comment: '' },
  ],
  [
    '0e5da0b5-1a7a-49e6-88d3-481eb8819916',
    { label: 'Light duty trucks <3.5 tonnes', value: 23, comment: '' },
  ],
  [
    '8a8b40eb-1848-48cd-9f61-0043ff158d7a',
    { label: 'Heavy duty trucks >3.5 tonnes', value: 45, comment: '' },
  ],
  ['f431fe40-d06f-4cc3-8d33-d4ee116105db', { label: 'CO2e emissions', value: 216, comment: '' }],
  ['51626bc7-17ca-4086-bca8-6ad806bbc224', { label: 'NOx emissions', value: 0.68, comment: '' }],
  ['11d16a62-2f77-437c-b586-3a86586edac6', { label: 'PM 2.5 emissions', value: 0.04, comment: '' }],
  ['46fdb8f7-3125-4689-be93-7b1c03abf98c', { label: 'PM 10 emissions', value: 0.05, comment: '' }],
  ['df758173-b169-46d5-b859-94f67ea0c20b', { label: 'CO2e emissions', value: 374, comment: '' }],
  ['6be10a46-8b31-46a5-a454-42b30d7f3e6f', { label: 'PM 2.5 emissions', value: 0.05, comment: '' }],
  ['fd2e2ed0-26de-4ca4-afa5-889e6cceb9fa', { label: 'PM 10 emissions', value: 0.07, comment: '' }],
  [
    '3ec0915e-acc1-4fa4-b728-ee3c5051714f',
    { label: 'Light duty trucks <3.5 tonnes', value: 17641, comment: '' },
  ],
  [
    '327a3e7e-0778-4098-b644-901533cfda3b',
    { label: 'Of which less than 2 years old', value: 7, comment: '' },
  ],
  [
    'be4a0009-a06f-4b69-a22c-babf4c616980',
    { label: 'Heavy duty trucks >3.5 tonnes', value: 4410, comment: '' },
  ],
  [
    'b03bcb8c-cb77-4d7a-bed4-2a0150090aa1',
    { label: 'Of which less than 2 years old', value: 4, comment: '' },
  ],
  [
    'ada6b0d9-4da0-420e-9e0b-adf7d19421b2',
    {
      label: 'Total floor area (residental & non-residential)',
      value: 78276,
      comment: '',
    },
  ],
  [
    '70c95faa-24d8-490f-9eac-b9423a6bf155',
    {
      label: 'Average heat use in existing buildings (space heating + domestic hot water)',
      value: 140,
      comment: '',
    },
  ],
  [
    'fa4c1349-48c2-469c-ad04-f3c61ca599ff',
    {
      label: 'Average electricity use for lighting & appliances',
      value: 41,
      comment: '',
    },
  ],
  [
    'f0401b8f-b988-45f8-bb09-252c33ce330f',
    {
      label: 'Share of building stock renovated each year',
      value: 1,
      comment: '',
    },
  ],
  [
    'db0f57bc-7503-488b-ac7c-1472ad02d0d8',
    { label: 'Minimum building standard (heat use)', value: 38, comment: '' },
  ],
  [
    'bc158706-a7dd-4ebe-b712-1cb8f4d43659',
    {
      label: 'Top performing building standard (heat use)',
      value: 10,
      comment: '',
    },
  ],
  [
    '8bd2253d-cb73-474d-b876-5ae9b8540131',
    {
      label: 'Share of new buildings built with minimum standard (today)',
      value: 100,
      comment: '',
    },
  ],
  [
    '27fedd37-18bd-4ece-8831-e96993c592d6',
    {
      label: 'Share of new buildings built with "better than minimum" standard (today)',
      value: 0,
      comment: '',
    },
  ],
  [
    '0ae5fb06-48a4-4774-9799-ccfa4e8f44a5',
    {
      label: 'Total heating demand (space heating + domestic hot water + heat for cooking)',
      value: 1630,
      comment: '',
    },
  ],
  [
    '83080b15-af7d-44e9-bab2-cefe151879b3',
    { label: 'Share of heating as district heating', value: 1, comment: '' },
  ],
  [
    'b38b5eb7-fb3c-4cfe-999e-29a349d302cd',
    { label: 'Share of heating as local heating', value: 99, comment: '' },
  ],
  [
    '3b58ecda-77bb-4ac6-80bf-7f802442bbb4',
    {
      label: 'Fossil (oil, coal, gas) + inefficient electric heating (not heat pumps)',
      value: 60,
      comment: '',
    },
  ],
  [
    'ef9b2521-c413-4513-8251-a80700d2e558',
    { label: 'Electric heat pumps / geothermal', value: 20, comment: '' },
  ],
  [
    'd1053dcd-fecf-4b2d-9b02-f9fefe02effc',
    { label: 'Bio (biogas, biomass)', value: 20, comment: '' },
  ],
  [
    '612e6a3c-81fa-4af2-9c04-18ef39778b91',
    { label: 'Waste (fossil & non-fossil waste)', value: 0, comment: '' },
  ],
  ['26a0df38-6711-4590-9283-aa519dfa4e45', { label: 'Fossil share', value: 30, comment: '' }],
  ['d926a4e8-e8a4-4f8e-848b-1bee6092cd38', { label: 'Non-fossil share', value: 70, comment: '' }],
  [
    '16e07a92-6437-4eb2-bc6e-8dc0de375dcd',
    {
      label: 'Fossil (oil, gas, coal) + inefficient electric heating (not heat pumps)',
      value: 70,
      comment: '',
    },
  ],
  [
    '804ac52f-8c7a-4b79-a56a-ed50f62ba8ad',
    { label: 'Electric (heat pumps)', value: 30, comment: '' },
  ],
  [
    'c8091681-cc83-416c-b4d2-7965b441e94e',
    { label: 'Biobased / solar water heating', value: 0, comment: '' },
  ],
  ['d178d6ca-ac4b-4e6f-871f-9a79555cb2de', { label: 'CO2e emissions', value: 200, comment: '' }],
  ['fae64934-4d43-4b58-9ee4-9f7b37cd7335', { label: 'NOx emissions', value: 0.139, comment: '' }],
  [
    '501d46fa-6d86-422f-a818-b712612995c4',
    { label: 'PM 2.5 emissions', value: 0.003, comment: '' },
  ],
  ['f8d3b736-1fe9-49ce-851b-d881f11d8a89', { label: 'PM 10 emissions', value: 0.005, comment: '' }],
  ['8b5c3adb-307c-4bd1-8b9f-1d6e01c34c50', { label: 'CO2e emissions', value: 213, comment: '' }],
  ['00924063-1dd8-43b1-a118-f3e29edbecf7', { label: 'NOx emissions', value: 0.24, comment: '' }],
  ['22dcb86a-4523-466d-be25-8b2fe4a58c20', { label: 'PM 2.5 emissions', value: 0.02, comment: '' }],
  ['e1069a45-21db-4210-96a3-71210c7a9cf8', { label: 'PM 10 emissions', value: 0.03, comment: '' }],
  [
    '5f7c8175-d3ae-4e05-9179-325b84934ead',
    {
      label: 'Total electricity demand within city boundaries',
      value: 2152,
      comment: '',
    },
  ],
  ['b132697d-6a72-476c-aed5-d3fa3886d943', { label: 'Renewable sources', value: 37, comment: '' }],
  ['82c7d588-6369-4db8-b961-c83a93d1ae42', { label: 'Fossil sources', value: 41, comment: '' }],
  [
    '9bebc7be-cc99-4edb-9932-a4465baa4748',
    { label: 'Other (e.g. nuclear)', value: 22, comment: '' },
  ],
  ['c549ff9f-91d0-48d8-b1f2-c014eaca748b', { label: 'CO2e emissions', value: 222, comment: '' }],
  ['7165c4b8-76a9-4d8a-b437-55f6099dd1ac', { label: 'NOx emissions', value: 0.14, comment: '' }],
  ['22545669-4941-445a-bac5-290acf43b110', { label: 'PM 2.5 emissions', value: 0, comment: '' }],
  ['93b7feab-da6a-4f33-8726-2ca7c96046b6', { label: 'PM 10 emissions', value: 0.01, comment: '' }],
  [
    'd7cbcdbd-9e5a-415e-a37a-5c3eefa26982',
    { label: 'Spot price electricity', value: 50, comment: '' },
  ],
  [
    '14417928-7d7f-49d5-8d59-3114be77792d',
    {
      label: 'Solar electricity produced by solar PVs',
      value: 1451,
      comment: '',
    },
  ],
  [
    '7ade3b4c-c3b1-4727-82d5-f36d1955e18f',
    {
      label: 'Yearly average of solar electricity generated by 1 m2 solar PV',
      value: 200,
      comment: '',
    },
  ],
  [
    '372c2783-4bf1-413c-b1b3-6f3565502b7e',
    { label: 'Paper and cardboard', value: 68669, comment: '' },
  ],
  ['4936856c-18bc-4169-b313-cbc41eb36d2a', { label: 'Metal', value: 13965, comment: '' }],
  ['095a8cf9-3b6b-4354-af80-6c66daf69a07', { label: 'Plastics', value: 56773, comment: '' }],
  ['961df23f-bf66-4091-81f6-b0dd106843a9', { label: 'Glass', value: 28835, comment: '' }],
  ['43507336-9c1a-4f27-bbd8-67dec958a11e', { label: 'Organic waste', value: 139462, comment: '' }],
  [
    '30b8f580-389a-4b1d-9f7f-34bf9bdfb0eb',
    {
      label: 'Other waste (e.g. textiles, rubble, wood etc)',
      value: 80633,
      comment: '',
    },
  ],
  [
    '8077d362-bfa3-499d-be1b-43c8a12585cd',
    {
      label: 'Share of paper waste - other (e.g. landfilled)',
      value: 8,
      comment: '',
    },
  ],
  [
    'ac12d659-f0bf-4d39-80f1-4147e51a46dc',
    {
      label: 'Share of paper waste - incinerated (e.g. energy recovery)',
      value: 7,
      comment: '',
    },
  ],
  [
    '9c8f2a75-700a-4b06-a5ba-2ccf11a21912',
    { label: 'Share of paper waste - recycled', value: 85, comment: '' },
  ],
  [
    '79c231c5-6725-4492-850b-33106acf5264',
    { label: 'Share of metal waste - landfilled', value: 20, comment: '' },
  ],
  [
    'adabf20f-7503-4ea7-9f36-e69d78412eab',
    {
      label: 'Share of metal waste - incinerated (e.g. energy recovery)',
      value: 1,
      comment: '',
    },
  ],
  [
    'a9d3c192-d3ea-466e-bc9e-e1a5042f8fb8',
    { label: 'Share of metal waste - recycled', value: 79, comment: '' },
  ],
  [
    '7671834a-dcc0-480f-94ab-34697908eb38',
    { label: 'Share of plastic waste - landfilled', value: 25, comment: '' },
  ],
  [
    '450a1d56-9cbf-4cc3-a63f-31d83738fbb3',
    {
      label: 'Share of plastic waste - incinerated (e.g. energy recovery)',
      value: 33,
      comment: '',
    },
  ],
  [
    '108ac7ab-47f7-485b-9a4e-e28addc350d2',
    { label: 'Share of plastic waste - recycled', value: 42, comment: '' },
  ],
  [
    'c61ebd61-0099-4c92-902d-df870e93f79d',
    { label: 'Share of glass waste - landfilled', value: 26, comment: '' },
  ],
  [
    '10dc9a05-1520-4897-a018-41c488af3af4',
    {
      label: 'Share of glass waste - incinerated (e.g. energy recovery)',
      value: 0,
      comment: '',
    },
  ],
  [
    '0183c182-97ea-407b-a578-1fc1377998c9',
    { label: 'Share of glass waste - recycled', value: 74, comment: '' },
  ],
  [
    '0f264270-1095-401b-bc2b-620ea801d4d1',
    { label: 'Share of organic waste - landfilled', value: 23, comment: '' },
  ],
  [
    '6bec5047-6031-4cf0-84f3-4790fa61cd42',
    {
      label: 'Share of organic waste - incinerated (e.g. energy recovery)',
      value: 23,
      comment: '',
    },
  ],
  [
    '80da9465-abe8-48ae-af13-7d9c648631af',
    { label: 'Share of organic waste - composted', value: 54, comment: '' },
  ],
  [
    '0c256bb4-8133-45a7-9f3d-c65c552393ea',
    { label: 'Share of "other" waste - landfilled', value: 36, comment: '' },
  ],
  [
    '5de62b62-8996-4c2a-8dea-e379354600e0',
    {
      label: 'Share of "other" waste - incinerated (e.g. energy recovery)',
      value: 54,
      comment: '',
    },
  ],
  [
    '109924c8-95c6-458d-b97b-6a872569dd41',
    { label: 'Share of "other" waste - recycled', value: 10, comment: '' },
  ],
  ['2c0c3a96-5f4b-4ce1-8e2d-8e6637d611ff', { label: 'CO2e emissions', value: 633, comment: '' }],
  ['f9721db6-29dc-4a14-abb9-1cd644d05b39', { label: 'NOx emissions', value: 0.53, comment: '' }],
  ['2fe95f5c-5895-4239-a3f9-64425da2e6e4', { label: 'PM 2.5 emissions', value: 0, comment: '' }],
  ['90fb1c6f-d882-4995-96bf-d2e190c406e4', { label: 'PM 10 emissions', value: 0, comment: '' }],
  [
    '0bfef6a2-7d17-4cc7-8524-fd429cb9c4bf',
    { label: 'Retail price of electricity', value: 0.28, comment: '' },
  ],
  [
    '01ead87d-7f61-49fd-b80f-fbc0a736eda5',
    { label: 'Retail price of heating', value: 152, comment: '' },
  ],
  [
    '8a3f5621-5dc6-4e6b-9646-ab7a5c4fa7da',
    { label: 'Passenger cars + motorcycles', value: 485, comment: '' },
  ],
  [
    '7b3a8976-5fed-4da6-a326-d3b61169810d',
    { label: 'Light duty trucks <3.5 tonne', value: 57, comment: '' },
  ],
  [
    '5475fc15-9236-4720-ab4f-7a21406e4185',
    { label: 'Heavy duty trucks >3.5 tonne', value: 33, comment: '' },
  ],
  ['452ff8d0-2cd2-4402-9d3d-97035f6eb6ef', { label: 'Buses', value: 49, comment: '' }],
  [
    'c6c0e008-9003-47f6-8579-0e44673374ac',
    { label: 'Other motorized transport', value: 13, comment: '' },
  ],
  [
    '913568b2-cdea-4016-be6d-9a3ba8e85dac',
    { label: 'Heating & hot water', value: 193, comment: '' },
  ],
  ['4f2a53a1-17e1-4625-b302-e4559811ec7f', { label: 'Cooling', value: 0, comment: '' }],
  [
    '34cc7425-8d60-4e2c-918a-2b7fdd96b1ee',
    { label: 'Other building-related emissions', value: 0, comment: '' },
  ],
  ['ca614bd8-e4db-4f60-a708-b04d79731f89', { label: 'Buildings', value: 474, comment: '' }],
  ['6ea103a2-c602-4da4-88b1-3b134016bbdc', { label: 'Other', value: 0, comment: '' }],
  [
    '9be7ad3e-faa0-4010-ad9c-528f91f8ce72',
    { label: 'Incineration of waste', value: 0, comment: '' },
  ],
  [
    '714f3c89-3b0b-448e-b55e-97e5bb625678',
    { label: 'Organic decay (waste)', value: 14, comment: '' },
  ],
  ['75184618-b10d-4ac8-b595-68809b7c53b3', { label: 'Landfill gas', value: 55, comment: '' }],
  [
    '68102437-5dff-4adc-95d6-9b47bb8a9f4f',
    { label: 'Other waste management', value: 2, comment: '' },
  ],
  ['fbf3fa68-30be-47c5-a368-decd9d6f16e2', { label: 'Industry (IPPU)', value: 64, comment: '' }],
  [
    'a08d4504-a43c-4dc1-ac2d-27d7aef5c241',
    { label: 'Agriculture (AFOLU)', value: 138, comment: '' },
  ],
  ['58c99d80-8b05-4573-8291-9252560414fd', { label: 'Other sources', value: 44, comment: '' }],
  [
    'ca90a93d-5299-42ee-b7c0-909f308e62c9',
    {
      label:
        'Transportation need reduction by 2030 from urban planning, digital meetings and other transport-reducing initiatives',
      value: 35,
      comment: '',
    },
  ],
  [
    '232d8a0e-028a-4556-9c9f-aef1f4e48e94',
    {
      label: 'Reduced Pkm cars + motorcycles by 2030',
      value: 30,
      comment: '',
    },
  ],
  ['6cdd313e-1f72-4168-b48c-ed4da1d28266', { label: 'Buses', value: 10, comment: '' }],
  ['162dc3d8-cbe0-4885-ae28-961052468b48', { label: 'Trains/metro', value: 60, comment: '' }],
  ['dc70e30c-51dc-4a9b-934a-8eb4c26dca9b', { label: 'Walking/cycling', value: 30, comment: '' }],
  [
    'a5e20d5c-8bd2-4fde-bffb-b032e851ba02',
    {
      label:
        'Percentage increase in avg. passengers per car + motorcycles (2030) due to improved transport efficiency from better Car pooling and Mobility as a Service',
      value: 25,
      comment: '',
    },
  ],
  [
    '3ac9c202-fd4e-4c7b-b313-4ff4af8d3c1c',
    {
      label:
        'What is the maximum share of the passenger car + motorcycle fleet that can be electrified?',
      value: 35,
      comment: '',
    },
  ],
  [
    '56f01fa8-6c81-4bed-91cf-436d410e3b9a',
    {
      label: 'At what year can we expect the city to reach the maximum value specified above?',
      value: 2040,
      comment: '',
    },
  ],
  ['10528e2b-bec7-4d02-9ef9-ff665d6cc7a1', { label: '2020', value: 0, comment: '' }],
  ['5216b4fa-f58a-458a-943b-f576bb679b7a', { label: '2021', value: 0, comment: '' }],
  ['c4e0bb4f-a7da-4e04-9bcc-01526769b8d5', { label: '2022', value: 3, comment: '' }],
  ['ec005e1f-d6bd-4114-859c-b2c30f4e9dad', { label: '2023', value: 10, comment: '' }],
  ['081823a8-67a7-455c-908f-96cc6a36f657', { label: '2024', value: 10, comment: '' }],
  ['85facd22-07bb-41a7-88b7-6e90d76c5683', { label: '2025', value: 10, comment: '' }],
  ['7f0a41e3-b53a-4c1b-b81d-d493a70ec606', { label: '2026', value: 10, comment: '' }],
  ['457adea4-fb53-4e3e-8e2a-b6492637f891', { label: '2027', value: 10, comment: '' }],
  ['ff1c126d-5134-437d-9d4d-1237ca1512e8', { label: '2028', value: 15, comment: '' }],
  ['3c7ee4f9-6822-43b2-8c23-ba969bdc6f56', { label: '2029', value: 15, comment: '' }],
  ['9d381c8c-7c34-4058-a69c-1b06e8117c89', { label: '2030', value: 17, comment: '' }],
  ['b74849a8-692a-4020-b337-7dbbc0c93227', { label: 'Light duty trucks', value: 45, comment: '' }],
  ['0071013d-6a8e-4a92-ba23-28e85b247a15', { label: 'Heavy duty trucks', value: 60, comment: '' }],
  [
    'eb7fc66c-1e68-4f1c-9a75-49cd9c174b17',
    {
      label: 'What is the maximum share of the truck fleet that can be electrified?',
      value: 90,
      comment: '',
    },
  ],
  [
    '04088784-13d6-484b-9248-5571877492df',
    {
      label: 'At what year can we expect the city to reach the maximum value specified above?',
      value: 2040,
      comment: '',
    },
  ],
  [
    '269337bc-3908-44f4-8435-ae6f84248756',
    {
      label: 'What is the maximum share of the truck fleet that can be electrified?',
      value: 60,
      comment: '',
    },
  ],
  [
    'd1cb6ee0-dffb-4132-9aff-05a1fe78bd75',
    {
      label: 'At what year can we expect the city to reach the maximum value specified above?',
      value: 2040,
      comment: '',
    },
  ],
  [
    'e81fd757-26b7-44d5-9f83-75f47d8c0689',
    {
      label: 'Renovation rate - decarbonisation scenario',
      value: 2.5,
      comment: '',
    },
  ],
  [
    'eae9054e-4e44-4a8e-abb9-7181ecca9a0c',
    {
      comment: '',
      label: 'Reduction of total distance travelled through route optimisation',
      value: 10,
    },
  ],
  [
    'f9364412-c739-4434-9e19-4522b2da4e06',
    {
      label: 'Minor heating renovations (0-30% improvement)',
      value: 50,
      comment: '',
    },
  ],
  [
    '923f6daa-7c57-4a56-89e3-8ff94e4f92a6',
    {
      label: 'Extensive heating renovations (30-60% improvement)',
      value: 50,
      comment: '',
    },
  ],
  [
    '9177ce9e-96c3-45eb-b709-8a59cc01eaab',
    {
      label: 'Improvement in energy efficiency relative to minimum requirement',
      value: 50,
      comment: '',
    },
  ],
  [
    '9a705041-71cc-4f90-8afc-fe2ec0f4b331',
    { label: 'Minimum building standard', value: 70, comment: '' },
  ],
  [
    'a5165c4f-29d7-4d54-9e80-e385c867eabc',
    { label: 'Top performing building standard', value: 30, comment: '' },
  ],
  [
    '05367c8a-10ca-47a4-887b-27d39ad1990a',
    {
      label: 'Renovation rate - decarbonisation scenario',
      value: 2.5,
      comment: '',
    },
  ],
  [
    '53e3a91f-eb90-4dc1-ad22-1799bd50ed04',
    {
      label: 'Minor efficiency improvements for lighting and appliances (~15%)',
      value: 0,
      comment: '',
    },
  ],
  [
    '577bf77b-825e-43ac-a210-cb2653dc6983',
    {
      label: 'Aggressive efficiency improvements for lighting and appliances (~40%)',
      value: 100,
      comment: '',
    },
  ],
  [
    '1995ad66-0a44-4d9a-911d-f6052103a8a3',
    {
      label: 'Share of heating as district heating, 2030',
      value: 5,
      comment: '',
    },
  ],
  [
    'ae0f812f-b3bf-4eb8-8a85-d591ff19c3fd',
    {
      label: 'Share of heating as local heating, 2030',
      value: 95,
      comment: '',
    },
  ],
  [
    '85d468d4-951c-49a7-8b6f-52283af9cbed',
    {
      label: 'Fossil (oil, coal, gas) + inefficient electric heating (not heat pumps)',
      value: 0,
      comment: '',
    },
  ],
  [
    '77c7e3fe-52fb-42cc-80dc-f8456115c8ae',
    { label: 'Electric heat pumps / geothermal', value: 80, comment: '' },
  ],
  [
    'cd988bf5-b6ce-436a-8af4-3d4b49fbb5ed',
    { label: 'Bio (biogas, biomass)', value: 20, comment: '' },
  ],
  [
    'b9bbce97-4fec-44a8-980c-d78fb446cc76',
    { label: 'Waste (fossil & non-fossil waste)', value: 0, comment: '' },
  ],
  ['75e49bd5-adff-408b-99d3-3630a63eecba', { label: 'Fossil share', value: 18, comment: '' }],
  ['c74c6acc-f9bf-43f4-bf5e-1af86541a92f', { label: 'Non-fossil share', value: 82, comment: '' }],
  [
    '653ef9da-2820-4de1-bb3e-1c85f76eab35',
    {
      label: 'Fossil (oil, coal, gas) + inefficient electric heating (not heat pumps)',
      value: 25,
      comment: '',
    },
  ],
  [
    '7443c2c6-9218-4c4a-8fe3-523a43548003',
    { label: 'Electric (heat pumps)', value: 60, comment: '' },
  ],
  ['1d58badb-c62c-4c1b-9824-e092b305746e', { label: 'Biobased', value: 15, comment: '' }],
  [
    '619aa8c7-c144-4392-91d0-c4e472f0fc6a',
    {
      label: 'District heating - fossil re-investments need',
      value: 100,
      comment: '',
    },
  ],
  [
    '1022da3a-c71a-4734-aef7-f00e90cdc81b',
    {
      label: 'Local heating - fossil re-investments need',
      value: 50,
      comment: '',
    },
  ],
  [
    '18b9b8ac-cd73-4551-8628-16c6f4fbc649',
    {
      label: 'Share of current fossil production replaced by renewables (or nuclear)',
      value: 85,
      comment: '',
    },
  ],
  [
    'a5e9c291-9686-44a9-a09b-bd8d4adea53f',
    { label: 'Local solar PV (e.g. rooftops)', value: 5, comment: '' },
  ],
  [
    'ad4bf140-bfdc-476d-85f8-a898f21edf81',
    { label: 'Centralised Solar PV/wind farms', value: 95, comment: '' },
  ],
  ['e1eddc0b-576a-4810-aa76-2fdcc050dbde', { label: 'Landfill', value: 0, comment: '' }],
  ['011e6229-bb54-4d26-a525-13811176307c', { label: 'Incineration', value: 15, comment: '' }],
  ['37743e60-348e-42dd-8c13-24aea2a118be', { label: 'Recycling', value: 85, comment: '' }],
  ['9ff4ebeb-6ccd-4a8e-8b81-b4f6bea06bd8', { label: 'Landfill', value: 10, comment: '' }],
  ['44966333-9664-4f13-b12a-f222d6569dce', { label: 'Incineration', value: 5, comment: '' }],
  ['767e7ea7-0185-494b-8749-84d44949a580', { label: 'Recycling', value: 85, comment: '' }],
  ['1026d3a0-b895-464b-9c3a-ce10a1e5c5aa', { label: 'Landfill', value: 10, comment: '' }],
  ['40471ce7-6885-4026-8801-cf9bbc44e77b', { label: 'Incineration', value: 22, comment: '' }],
  ['ac9cdd26-0874-45df-afa7-739bd7307457', { label: 'Recycling', value: 68, comment: '' }],
  ['99c6d0ab-1a7a-4e1c-8f58-54bee1f1e42b', { label: 'Landfill', value: 10, comment: '' }],
  ['57756603-7d42-490d-be3c-35282a6bd24b', { label: 'Incineration', value: 5, comment: '' }],
  ['842ded5f-1c1d-43d9-a868-e8a186994360', { label: 'Recycling', value: 85, comment: '' }],
  ['3ef0c01b-0631-4a7d-992d-3ce988d215cb', { label: 'Landfill', value: 0, comment: '' }],
  ['db853cd0-0d13-45e2-9097-bd50b53cc57c', { label: 'Incineration', value: 15, comment: '' }],
  ['9557785b-f6be-44a7-a7e9-9b025e93c473', { label: 'Composting', value: 85, comment: '' }],
  [
    'a5b89b5a-bdc6-44e9-a645-a8bce2dc8313',
    { label: 'Trees planted inside city', value: 20000, comment: '' },
  ],
  [
    '08bb8fb2-9b5d-4d9f-87e6-2e1abffd208c',
    { label: 'Trees planted outside city', value: 80000, comment: '' },
  ],
  [
    'a4081684-e1c5-4e98-8481-3cef7efc65ff',
    { label: 'Inside city - grey area', value: 33, comment: '' },
  ],
  [
    'ad674916-c0b8-49af-a2ff-4ea20e29a73e',
    { label: 'Inside city - green area', value: 67, comment: '' },
  ],
  [
    '373e44dd-2127-4feb-b60c-94af0489d82e',
    { label: 'Outside city - grey area', value: 17, comment: '' },
  ],
  [
    '1648bc36-3c36-47f1-bd03-78f7969923b6',
    { label: 'Outside city - green area', value: 83, comment: '' },
  ],
  [
    '7d90be89-452c-4238-bb38-4646cc49aa10',
    {
      label: 'Population density outside city (used to scale benefits from forestation)',
      value: 10,
      comment: '',
    },
  ],
  [
    '41174014-edc9-4910-921f-33750215a333',
    {
      label: 'Percentage CO2e reduction by 2030 in Other sector',
      value: 81,
      comment: '',
    },
  ],
]);

const REMOVED_UUIDS = new Set([
  '00924063-1dd8-43b1-a118-f3e29edbecf7',
  '08bb8fb2-9b5d-4d9f-87e6-2e1abffd208c',
  '11d16a62-2f77-437c-b586-3a86586edac6',
  '14417928-7d7f-49d5-8d59-3114be77792d',
  '1648bc36-3c36-47f1-bd03-78f7969923b6',
  '1a328799-4774-4901-be1f-e6b46fb84ef7',
  '22545669-4941-445a-bac5-290acf43b110',
  '22dcb86a-4523-466d-be25-8b2fe4a58c20',
  '2fe95f5c-5895-4239-a3f9-64425da2e6e4',
  '373e44dd-2127-4feb-b60c-94af0489d82e',
  '46fdb8f7-3125-4689-be93-7b1c03abf98c',
  '501d46fa-6d86-422f-a818-b712612995c4',
  '51626bc7-17ca-4086-bca8-6ad806bbc224',
  '53b815ee-ad74-4aad-8096-3ba19af4e6f4',
  '56ad8ce0-a583-4011-846d-ad44cbc92052',
  '5c1b815c-6c13-4303-b9ff-f641cd725c4e',
  '6be10a46-8b31-46a5-a454-42b30d7f3e6f',
  '7165c4b8-76a9-4d8a-b437-55f6099dd1ac',
  '7ade3b4c-c3b1-4727-82d5-f36d1955e18f',
  '7d90be89-452c-4238-bb38-4646cc49aa10',
  '80414475-5306-4e66-8ff9-c15f346c61fe',
  '8e9c2502-128f-4368-ad09-debb8d2e06c8',
  '90fb1c6f-d882-4995-96bf-d2e190c406e4',
  '93b7feab-da6a-4f33-8726-2ca7c96046b6',
  '9bebc7be-cc99-4edb-9932-a4465baa4748',
  'a4081684-e1c5-4e98-8481-3cef7efc65ff',
  'a5b89b5a-bdc6-44e9-a645-a8bce2dc8313',
  'ac14daee-a60e-445a-b56b-bc0600e9788d',
  'ad674916-c0b8-49af-a2ff-4ea20e29a73e',
  'bc158706-a7dd-4ebe-b712-1cb8f4d43659',
  'e1069a45-21db-4210-96a3-71210c7a9cf8',
  'f8d3b736-1fe9-49ce-851b-d881f11d8a89',
  'f9721db6-29dc-4a14-abb9-1cd644d05b39',
  'fae64934-4d43-4b58-9ee4-9f7b37cd7335',
  'fd2e2ed0-26de-4ca4-afa5-889e6cceb9fa',
]);

export const EXPECTED_MEASURES = new Map(
  [...ALL_MEASURES].filter(([uuid]) => !REMOVED_UUIDS.has(uuid))
);
