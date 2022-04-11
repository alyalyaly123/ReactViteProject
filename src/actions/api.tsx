import axios from 'axios';

// Data gatheringApi
async function getProducts() {

  let graphData: any[] = [];
  let totalCount = 0;


  /* Query loops through all available products from the uk
  After: Is the id of the position in the db the current item is, 
  "First:100" calls 100 items after that point. 
  */
  let after = "";
  let nextPage = true;

  while (nextPage === true) {
    // This query is fairly ugly, but seemed to be the easiest way to get all the subsections.
    const graphQuery = 
      `{
        products(
          channel: "uk"
          first: 100
          after:"`+after+`"
        ){
          totalCount
          edges {
            node {
              id
              name
              description
       
              isAvailable
              productType {
                name
              }
              pricing{
                onSale
                priceRange{
                  start{net{amount}}
                stop{net{amount}}}
              }
              created
              updatedAt
              seoTitle
              seoDescription
              category {
                name
                id
                description
              }
              channel
              rating
            }
            cursor
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }`;
    
      // Post request and continiously repeat to build up graph. I should improve error handling but for now its like this.
    await axios.post("https://twstg2.eu.saleor.cloud/graphql/", { query: graphQuery })
      .then(
        (res) => {

          console.log("res is " + JSON.stringify(res));
          const data = res['data']['data']['products'];
          const productEdges = data['edges'];
          graphData = graphData.concat(productEdges);
          totalCount = data['totalCount'];

          nextPage = data['pageInfo']['hasNextPage'];
          // If next page,create the cursor for adding the one after.
          if (nextPage) {
            const finalNode = productEdges[productEdges.length - 1]
            after =finalNode.cursor;
          }
        }
        ,
        (error) => {
          console.log("error is " + JSON.stringify(error))
          nextPage = false;
        });
  }
  const apiRet: any = { graphData: graphData, totalCount: totalCount }
  return apiRet;

}

export default getProducts;