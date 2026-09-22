# Data-Binding Keys Comparison — SearchYourProperty vs AppraisalToolReact

This compares the **object/field keys used to bind property data to the UI** in each project (not env variables). The two projects have completely different data models:

- **SearchYourProperty**: clean, camelCase JSON keys (its own mock schema), bound from `src/data/properties/*.json` via [src/api.js](src/api.js) into components (`data.accountNumber`, `data.buildings`, etc.)
- **AppraisalToolReact**: raw Aumentum/GIS feature-attribute keys (PascalCase / legacy DB column names, e.g. `OBJECTID`, `BldgID`, `TotalBldgArea25`), fetched live from ArcGIS + SQL Server and bound almost 1:1 into tables/forms (`useParcel.js`, `useBuilding.js`, `useOwnerData.js`).

None of AppraisalToolReact's binding keys are used in SearchYourProperty, and vice versa — they don't share a single key name.

---

## Parcel / Land

| Concept | SearchYourProperty key | AppraisalToolReact key |
|---|---|---|
| Parcel / account identifier | `accountNumber`, `stateParcelNumber` | `OBJECTID`, `PID`, `taxPIN` |
| Parent parcel link | *(flat model, n/a)* | `ParentObjectID` |
| Lasso / grouping id | *(n/a)* | `LassoID` |
| Land area | `landSegments[].acres` | `LandArea14`, `LandArea25` |
| Land value/tax class code | `landSegments[].abstractCode` | `Tax14ValueCode`, `Tax25ValueCode25` |
| Land value multiplier/adjustment | `landAttributes[].attributeAdjustment` | `Improvement_Adj_Amt25` (also reused as building multiplier) |
| Appraisal status | *(n/a)* | `Appraisal_Status`, `Appraisal_Exclusion_Status` |
| Notes | *(n/a)* | `Notes`, `GRMNotes` |
| Neighborhood | `neighborhoods[].code` | `Neighborhood` |
| Zoning | `zoningCode`, `zoningCodeDescription` | `Zone` |
| Sale date | `sales[].date` | `Sale_Date`, `S25_SellDate` |
| Sale price | `sales[].price` | `Sale_Indicated_Price`, `S25_Price` |
| Valid sale flag | `sales[].isValid1` | `IsValidForRatio` |

## Building

| Concept | SearchYourProperty key | AppraisalToolReact key |
|---|---|---|
| Building identifier | `buildings[].buildingNumber` | `BldgID` |
| Building type | `buildings[].propertyType` | `Improvement_Type` |
| Construction type | `buildings[].styles[].exteriorConstructionType` | `Construction_Type` |
| Building classification | `buildings[].uses[].useCodeDescription` | `Improvement_Classification` |
| Total building area | `buildings[].squareFeet` | `TotalBldgArea14`, `TotalBldgArea25` |
| Bedroom count | `buildings[].styles[].bedroomCount` | **not present anywhere in codebase** |
| Bathroom count | `buildings[].styles[].bathroomCount` | **not present anywhere in codebase** |
| Room count | `buildings[].styles[].numberOfRooms` | **not present anywhere in codebase** |
| Building condition | `buildings[].conditionType` | `Buildingcondition` |
| Effective age | `buildings[].styles[].effectiveAge` | `Effective_Age25`, `Effective_Age` |
| Separate tax id | *(n/a)* | `Taxed_Separate_ID` |
| Tax status | *(n/a)* | `Bldg_Tax_Status` |
| Building rate | *(computed differently, see `valuesByAbstractCode`)* | `BldgRate25` |
| Depreciation | *(n/a)* | `Depreciation25` |
| Replacement cost new | *(n/a)* | `RCN` *(computed: `BldgRate25 × TotalBldgArea25`)* |
| Depreciated value | *(n/a)* | `DV` *(computed: `RCN − Depreciation25`)* |
| Special purpose flag | *(n/a)* | `Special_Purpose` |
| Economic life | *(n/a)* | `EconomicLife25` |

## Owner / Value

| Concept | SearchYourProperty key | AppraisalToolReact key |
|---|---|---|
| Owner name | `owners[].name` | *(fields from `/data/owners-details`, e.g. Legal Party name)* |
| Owner effective date | *(n/a)* | `Legal_Party_Effective_Date` |
| Last updated timestamp | *(n/a)* | `LAST_UPDATE` |
| Mailing address | `owners[].mailingAddress.{street,city,state,zipCode}` | *(separate owner-property-details fields)* |
| Assessed value (by year) | `valuesByAbstractCode[].assessedValue` | *(returned per-call from `calculateLandValue`/`calculateBuildingValue`)* |
| Mill levy | `taxAuthorities[].funds[].millLevy` | *(not directly seen in hooks reviewed; likely a tax-authority table field)* |

---

## Full Key Inventory (all 148 keys, exhaustively checked)

Every unique key in SearchYourProperty's JSON data model (`src/data/properties/*.json` + `src/data/documents/*.json`) was checked against **every `.js`/`.jsx` file in AppraisalToolReact** (frontend + backend, excluding `node_modules`). Only **5 of 148** exist as an exact, literal key name anywhere in AppraisalToolReact — and even those are coincidental (different shape/meaning), not true shared data models.

**Genuine exact-name matches (5):**

| Key | Where it appears in AppraisalToolReact | Same concept? |
|---|---|---|
| `buildings` | `subTables.jsx` (local array: `buildings: [{...emptyBuilding}]`) | Different shape — SearchYourProperty nests full building records; AppraisalToolReact's is a form-builder array |
| `taxYear` | `PublicBillView.jsx` (tax payment lookup param) | Same concept (a tax year), unrelated feature (bill payment, not valuation) |
| `latitude` | `MapView.jsx` (`event.mapPoint.latitude`) | Same concept (GIS coordinate), but a live map-click point, not a stored parcel field |
| `longitude` | `MapView.jsx` (`event.mapPoint.longitude`) | Same as above |
| `effectiveAge` | `useBuilding.js`, `backend/routes/valueRoutes.js` | Same concept (building effective age) — the one real, meaningful overlap |

**Everything else — 143 keys — is not used anywhere in AppraisalToolReact**, grouped by area:

**Account / Parcel core:** `accountNo`, `accountNumber`, `accountType`, `appraisalType`, `stateParcelNumber`, `legalDescription`, `taxDistrictNumber`, `zoningCode`, `zoningCodeDescription`, `defaultLea`, `defaultLeaDescription`, `totalImprovementInterestPercent`, `totalLandInterestPercent`, `isVacant`, `isImprovementOnly`, `isTif`, `isPlatted`, `numberOfBuildings`, `isPrivate`, `ppAccount`, `quartersection`, `section`, `township`, `range`, `elevation`, `neighborhoods`

**Owner / Address:** `owners`, `mailingAddress`, `addresses`, `street`, `street2`, `city`, `state`, `zipCode`, `isPrimary`

**Subdivision:** `subdivision`, `filingNumber`, `recordingNumber`

**Sales:** `sales`, `grantor`, `grantee`, `date`, `price`, `deedType`, `book`, `page`, `isValid1`, `isImproved`

**Tax authorities / Levies:** `taxAuthorities`, `pointOfContact`, `contactPhone`, `funds`, `millLevy`, `alternateMillLevy`

**Assessed values (by year):** `valuesByAbstractCode`, `abstractCode`, `abstractCodeDescription`, `netAcres`, `actualValue`, `assessedValue`, `taxDollars`, `assessmentRate`, `alternateAssessedValue`, `alternateTaxDollars`, `alternateAssessedRate`

**Buildings / structure:** `buildingNumber`, `propertyType`, `completedPercent`, `quality`, `perimeter`, `squareFeet`, `netSquareFeet`, `unitType`, `approachType`, `conditionType`, `details`, `type`, `subtype`, `unitCount`, `builtYear`, `addonCode`, `addonCodeDescription`, `uses`, `useCode`, `useCodeDescription`, `usePercentage`, `styles`, `styleCode`, `styleCodeDescription`, `bedroomCount`, `bathroomCount`, `numberOfRooms`, `exteriorConstructionType`, `floorMaterialType`, `heatType`, `hvacPercent`, `interiorFinishType`, `numberOfStories`, `remodeledPercent`, `remodeledYear`, `roofConstructionType`, `roofMaterialType`, `sprinklerCoverageSquareFeet`, `totalUnitCount`, `typicalStoryHeight`, `length`, `width`, `height`, `mobileHomeMake`, `mobileHomeModelType`, `mobileHomeSkirt`, `mobileHomeSkirtLinearFeet`, `mobileHomeWallType`

**Land:** `landAttributes`, `attributeType`, `attributeTypeDescription`, `attributeAdjustment`, `landSegments`, `acres`

**Building permit authority:** `buildingPermitAuthority`, `phone`, `email`, `url`

**Notices / Appeals:** `notifications`, `note`, `novTaxYears`, `appeals`, `appealNo`, `decision`, `reason`

**Documents:** `directories`, `files`, `downloadUrl`, `lastModified`, `sizeWithUnits`, `sizeInBytes`, `fileExtension`, `extension`, `code`, `id`, `name`, `description`

> Note: a handful of common English words (`name`, `id`, `type`, `date`, `code`, `state`, `city`, `email`, `phone`, `url`, `note`, `range`, `section`, `street`, `details`, `sales`, `styles`, `notifications`, `uses`) do appear *somewhere* in AppraisalToolReact's source, but only as generic variable names, UI library imports (Mantine `styles`/`Notifications`), comments, or unrelated text (e.g. "Sales Data" heading, "New Subdivision" chip label) — not as the same bound data-model key. Those are excluded from the 5 "genuine matches" above.

## Why they don't overlap

- SearchYourProperty's JSON is a **hand-designed demo schema** built for readability (camelCase, nested by concept: `owners`, `sales`, `buildings`, `landSegments`).
- AppraisalToolReact binds straight to **Aumentum/ArcGIS feature attributes and SQL columns** (`OBJECTID`, `BldgID`, `TotalBldgArea25`, ...), so its "keys" are whatever the underlying GIS/DB schema calls them — not renamed for the UI.
- If SearchYourProperty is ever wired to the same backend, the components would need to map these Aumentum-style keys onto (or replace) the current clean `data.*` shape.
- AppraisalToolReact doesn't track residential-style attributes like bedroom/bathroom/room counts at all — it's an assessor/GIS valuation tool (land + improvement value, tax, sales ratio), not a property-listing style app, so those fields simply don't exist in its data model or database columns.
