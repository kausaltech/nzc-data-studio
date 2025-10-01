import { Link, Typography } from '@mui/material';

export const FAQS = [
  {
    title:
      'What is the purpose of an economic case, and what value does it have for me?',
    isList: true,
    description: (
      <ul>
        <li>
          <Typography color="text.secondary">
            The economic case allows cities to analyze the costs and benefits of
            the Actions in their Climate Action Plan to maximize decarbonization
            benefits for Euros invested.
          </Typography>
        </li>

        <li>
          <Typography color="text.secondary">
            The NetZeroPlanner model breaks down the decarbonization impacts
            along with the costs and benefits of the Climate Action Plan by
            sub-sector and stakeholder group to allow for assessment and
            prioritization of projects so that limited city budgets can be
            directed to projects with the highest monetary and carbon Return on
            Investment (ROI).
          </Typography>
        </li>

        <li>
          <Typography color="text.secondary">
            Calculating ROI including co-benefits helps to make the case to city
            leaders for allocations of limited budget resources to
            decarbonization projects. It can also help citizens and businesses
            better understand the positive returns they can expect from the
            investments they will need to make to decarbonize.
          </Typography>
        </li>

        <li>
          <Typography color="text.secondary">
            The economic case provides high level backup to support any
            incremental financing that might be necessary to fill budget
            shortfalls.
          </Typography>
        </li>

        <li>
          <Typography color="text.secondary">
            It can also serve to bridge the communication gap between city
            climate teams and city finance departments so they can work together
            to make sure the Climate Action Plan is properly funded and
            implemented.
          </Typography>
        </li>
      </ul>
    ),
  },

  {
    title:
      'For our city, we have climate budgeting, and our Climate Action Plan is funded in the city budget. Why do I have to do an economic case and an investment plan if I know I am funded already?',
    description:
      'Typically less than 10% of the total investment needed to decarbonize a city is under the control of city government and included in the city budget.  The other 90+% of the investment needed will be the responsibility of citizens and businesses in the city.  The model shows how much each Stakeholder Group must invest in order to decarbonize.  This can be very valuable information for cities as they strive to motivate, incentivize, and support citizens and businesses to change their own behavior and invest in decarbonization.',
  },

  {
    title:
      'Where can I find detailed information on the methodology used in the model for each of the main sectors?',
    description: (
      <>
        Detailed information can be found on the NetZeroCities portal at:{' '}
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href="https://netzerocities.app/group-capabilitybuildingprogrammebuildingastrongeconomiccase"
        >
          https://netzerocities.app/group-capabilitybuildingprogrammebuildingastrongeconomiccase
        </Link>
        .
      </>
    ),
  },

  {
    title: 'How does the model handle Scope 1, 2, and 3 emissions?',
    description:
      'The model includes Scope 1 and 2 emissions.  It only includes Scope 3 for solid waste (rubbish) that is discarded in the city but processed outside of the city.',
  },

  {
    title:
      'The model calculates carbon and costs and benefits for four major sectors (Transportation, Buildings & Heating, Electricity, and Waste).  How does it handle emissions outside of those four main sectors?',
    description:
      'All emissions that do not fall into the four main sectors are grouped together in a sector called “Other”.  This sector includes emissions from IPPU and AFOLU among other emissions.  The model does not calculate the carbon reductions or costs and benefits in the “Other” sector.  There is an input on the Future Assumptions tab where you can say how much you believe this “Other” sector will decline in emissions through the target year so these emissions can be included in your planning.',
  },

  {
    title:
      'How does the model handle co-benefits and where can I find additional information on the research that backs up the model methodology?',
    description: (
      <>
        The model monetizes the co-benefits related to Health and includes those
        benefits in the cost / benefit analysis. Additional information on
        co-benefits can be found on the NetZeroCities portal at:
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href="https://netzerocities.app/group-capabilitybuildingprogrammebuildingastrongeconomiccase"
        >
          https://netzerocities.app/group-capabilitybuildingprogrammebuildingastrongeconomiccase
        </Link>
        .
      </>
    ),
  },

  {
    title:
      'The model only monetizes the co-benefits associated with Health, but I know there are other co-benefits such as those associated with Economic Growth and Inclusivity.  Why does the model not include those other co-benefits?',
    description:
      'It is understood that there are other co-benefits that result from decarbonization, but many of those co-benefits are very difficult to translate into Euro benefits.  In the area of Health, high quality research is available to convert the co-benefit into Euros, so it can be included in the Return on Investment calcuations and used for decision making.',
  },

  {
    title: 'What year should I use as the baseline for my analysis?',
    description:
      'It is is a good idea to use a baseline year where you have prepared a solid emission inventory.  This will allow you to validate the results of the model against your emissions inventory to highlight any data input errors.  We do not recommend using the years 2020 or 2021 due to the unusual effects of COVID in those years.',
  },

  {
    title:
      'Do I have to fill in every one of the fields in the Data Collection and Future Assumptions tabs?  What if I am missing data for some of those fields? ',
    description:
      'You do not have to fill in every input field. All fields include a Comparable City Value that is based on an average of European cities that are similar to yours.  If you do not input a number in any field, the system will default to the Comparable City Value.  The Comparable City Value can also be used to validate the inputs you do have.  If you decide to use the Comparable City Value, please be sure to review the number to ensure that it well represents your city.  All input fields are also marked as High or Moderate priority to make it easier for you to know which fields to focus on, and which ones where you might decide to just use the Comparable City Value.',
  },

  {
    title:
      'In the emissions inventory section of the Data Collection tab, how do I handle electricity used in the Transportation and Buildings & Heating sectors?',
    description:
      'All electricity should go into the Electricity sector. The Transportation and Buildings & Heating sectors should include no carbon from electricity.',
  },

  {
    title:
      'I have also created a SECAP emission inventory.  Why does the output of the model not exactly match my SECAP? ',
    description:
      'There are likely some small methodological differences between your SECAP emission inventory and the NetZeroPlanner model.  The biggest difference may be that electricity is separated into its own sector called “Electricity” whereas your SECAP emissions inventory may include electricity in the Transportation and Buildings & Heating sectors.',
  },

  {
    title: 'How should I handle carbon sinks such as forestation in the model?',
    description:
      'The model does not calculate the carbon benefits of carbon sinks. ',
  },

  {
    title:
      'The model calculates the carbon reduction from the Business as Usual (BAU) case.  How is the BAU case calculated?',
    description:
      'The BAU case is designed to represent what would have happened if you had not implemented your Climate Action Plan.  It increases carbon over time based on population growth and reduces carbon over time through the natural replacement of worn-out equipment (cars, trucks, heating etc.) with newer more efficient fossil fuel equipment.',
  },

  {
    title:
      'How does the model analyze just the impact of the Climate Action Plan separately from what would have happened if the plan had not been implemented? ',
    description:
      'The model calculates the incremental effect of your Climate Action Plan.  This means that any decarbonization effects as well as any costs and benefits are incremental to what would have happened if you did not implement your Climate Action Plan (otherwise known as the Business as Usual case).',
  },

  {
    title:
      'The expense produced by the model for the city does not exactly match what we have budgeted.  Why is this?',
    isList: true,
    description: (
      <ul>
        <li>
          <Typography color="text.secondary">
            One of the main reasons the numbers will likely not match is because
            the model calculates Incremental Cost, while your city likely
            budgets Total Cost. As an example, the model only includes the
            additional cost of an electric bus over an above the cost of a
            replacement diesel bus. Since your budget likely includes the total
            cost of the electric bus, your budget may be higher than what the
            model shows.
          </Typography>
        </li>
        <li>
          <Typography color="text.secondary">
            Another reason is that the model only includes the Direct Cost of
            each sub-sector or lever, not the Indirect Cost. In our bus example,
            it would calculate the incremental cost of the electric bus plus
            charging infrastructure, but it would not include the cost of a
            dedicated bus lane for those electric buses.
          </Typography>
        </li>
      </ul>
    ),
  },

  {
    title:
      'The model breaks out Capital Expense (CAPEX) and Operating Expense (OPEX).  What is the difference between those two types of expenses, and why should they be separated?',
    description:
      'CAPEX (often called Investment Expense) is the money required upfront to purchase an asset necessary for decarbonization.  OPEX is the ongoing expense necessary to use that asset.  In decarbonization projects, incremental OPEX is usually a cost savings as the cost of running the new asset is cheaper than the old asset (for example, electricity is usually cheaper than diesel fuel).  City finance departments need to split CAPEX and OPEX because they are treated differently from an accounting perspective and are often funded differently.',
  },

  {
    title:
      'In the results tables produced by the model, the financials are shown in both “Cash” and “Net Present Value”.  What is the difference and how should I use each type of analysis?',
    description:
      'Some of the financials are expressed in cash (not discounted) and some are expressed in Net Present Value (NPV)(discounted).  Cash tends to be most useful to your finance / budget departments because they need to know how much money will actually be spent.  NPV is most useful in financial analysis because it brings all money back to a point in time for the calculation of Return on Investment (ROI).',
  },
  {
    title:
      'The output Excel tables show that the citizens of our city are responsible for a very large amount of the investment needed to decarbonize.  Our national government provides subsidies, so the investment burden on our citizens will not be so large.  Where do those subsidies show up in the analysis?',
    description:
      'The model only includes Uses of Funds, not Sources of Funds.  It says how much things cost, but it does not say where the funds will come from to pay for those costs.  The costs you see in the model outputs do not take into account any subsidies provided by the government to reduce that cost to citizens.',
  },
];
