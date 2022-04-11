import React from "react";
import { Spinner, Dropdown, Container, Form, Button, Row, Col } from "react-bootstrap";
import ProductList from "../productList/productList";
import getProducts from "../../actions/api";
import './menu.css'

class Menu extends React.Component<any, {
    isLoading: boolean, graphData: any[],
    currentPage: number, sortBy: string
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            graphData: [],
            currentPage: 1,
            sortBy: "nameAsc"
        };
        this.changePage = this.changePage.bind(this);

    }

    componentDidMount() {
        getProducts().then(res => {
            this.setState({
                graphData: res['graphData'],
                isLoading: false
            })
        })
    }

    changePage(activePage: number) {
        this.setState({ currentPage: activePage })
    }

    // Sort data by the state given
    sortBy(graphData: any[]) {

        const sortBy = this.state.sortBy
        switch (sortBy) {
            case "nameAsc":
                graphData = graphData.sort((a, b) => a.node.seoName - b.node.seoName);
                break;
            case "nameDsc":
                graphData = graphData.sort((a, b) => (a.node.seoName) - (b.node.seoName)).reverse()
                break;
            case "costLow":
                graphData = graphData.sort((a, b) => a.node?.pricing?.priceRange?.start?.net?.amount - b.node?.pricing?.priceRange?.start?.net?.amount);
                break;
            case "costHigh":
                graphData = graphData.sort((a, b) => b.node?.pricing?.priceRange?.start?.net?.amount - a.node?.pricing?.priceRange?.start?.net?.amount);
                break;
            case "rating":
                graphData = graphData.sort((a, b) => b.node.rating - a.node.rating);
                break;
            default:
                console.log("no changes")
                break;
        }

        return graphData;
    }

    // I think there's a better way of handling this that doesn't involve changing page. But for now
    onSubmit() {
        this.setState({ currentPage: 1 });
    }

    // Every time the states reset, call this to edit the graph data to the parameters the user currently has.
    getFilteredData() {
        const params = new URLSearchParams(window.location.search);
        let nameSearch = params.get('productName');
        let data = this.state.graphData;
        if (nameSearch) {
            nameSearch = nameSearch.toLowerCase()
            data = data.filter(obj => {
                let name = obj.node.name
                if (name) {
                    // Make both lower case to allow better searching
                    name = name.toLowerCase();
                    return name.includes(nameSearch)
                }
            });
            data = this.sortBy(data);

        }

        return data;

    }
    // Change sort by state and refresh page
    dropDownSort(evt: any) {
        this.setState({ sortBy: evt, currentPage: 1 });
    }

    render() {

        const graphData = this.getFilteredData();

        const totalValues = graphData.length;
        const itemsExist = (totalValues > 0);

        return (
            // Loading buffer while API is called
            this.state.isLoading ?
                (
                    <div>
                        <Spinner animation="border" variant="danger" />
                        <p>Loading... </p>
                    </div>
                )
                :
                (
                    <Container fluid={true}>
                        <div id="productMenu">
                            {/** Form for filtering data */}
                            <Form onSubmit={() => this.onSubmit()}>
                                <Row>
                                    <Col xs={10}>
                                        <Form.Control name="productName" key="nameControl" type="string" placeholder="Search items" />
                                        <Form.Text key="nameText" className="text-muted"></Form.Text>
                                    </Col>
                                    <Col>
                                        <Dropdown onSelect={(evt) => this.dropDownSort(evt)}>

                                            <Dropdown.Toggle key="dropDownSort" variant="success" id="dropdown-basic">
                                                Dropdown Button
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item key={"nameAsc"} eventKey={"nameAsc"}>Name (asc)</Dropdown.Item>
                                                <Dropdown.Item key={"nameDsc"} eventKey={"nameDsc"}>Name (dsc)</Dropdown.Item>
                                                <Dropdown.Item key={"costLow"} eventKey={"costLow"}>Lowest Cost</Dropdown.Item>
                                                <Dropdown.Item key={"costHigh"} eventKey={"costHigh"}>Highest Cost</Dropdown.Item>
                                                <Dropdown.Item key={"rating"} eventKey={"rating"}>Highest rating</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                    <Col>
                                        <Button variant="primary" type="submit" key="nameSubmit">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>


                        </div>
                        {itemsExist ?
                            (
                                <ProductList graphData={graphData} currentPage={this.state.currentPage} changePage={this.changePage}></ProductList>)
                            :
                            (
                                <h1>Sorry, there are no products that match this search requirement.</h1>
                            )
                        }


                    </Container>
                )
        )
    }
}


export default Menu;