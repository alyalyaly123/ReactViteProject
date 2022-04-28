import React from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import PageMenu from "../pageMenu/pageMenu";
import './productList.css'
class ProductList extends React.Component<{ graphData: any[], currentPage: number, changePage: (n:number)=> (void) }, { itemsDisplayed: number, showModal: boolean, modalNodeId: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            itemsDisplayed: 35, // Items per page
            showModal: false,
            modalNodeId: ""
        };
        this.changePage = this.changePage.bind(this);
    }
    // Passes active page up to the component above
    changePage(activePage: number) {
        this.props.changePage(activePage)
    }

    //Open popup
    openModal(evt: any) {
        const nodeId = evt.target.id
        if(nodeId){
            this.setState({ showModal: true, modalNodeId: nodeId })
        }
    }
    // Close popup
    closeModal() {
        this.setState({ showModal: false, modalNodeId: "" })
    }
    // Display pop up window if enabled
    displayModal() {
        if (this.state.showModal) {
            
            const modalItems = [];
            const nodeId = this.state.modalNodeId;
            const data = this.props.graphData;
            
            const dataObj = data.filter(obj => { return obj?.node?.id === nodeId });
            console.log("modal data is "+ JSON.stringify(dataObj));
            const node = dataObj[0].node;
            const rating = (node.rating) ? parseFloat(node.rating).toFixed(1) : "n/a"
            const price = node?.pricing?.priceRange?.start?.net?.amount;
            if (node) {
                modalItems.push(<Modal show={true} key="headModal" ><Modal.Header key="modalHeader" closeButton>
                    <Modal.Title key="modalTitle">Product Description</Modal.Title>
                </Modal.Header>
                    <Modal.Body key="modalBody">
                        <h2 className="title">{node.name}</h2>
                        <p>Description:{node.seoDescription}</p>
                        <p>Category: {node.category.name}</p>
                        <p>Price: {price}</p>
                        <p>Rating:{rating}</p>
                    </Modal.Body>
                    <Modal.Footer key="modalFoot">
                        <Button key="modalcloseButton" variant="secondary" onClick={() => this.closeModal()}>
                            Close
                        </Button>
                    </Modal.Footer></Modal>)

                return modalItems;
            }
        }
        return null;
    }

    // Dynnamically building up elements on page
    buildGrid() {
        
        const data = this.props.graphData;
        const start = ((this.props.currentPage - 1) * this.state.itemsDisplayed);
        const end = start + this.state.itemsDisplayed;
        const dataUsed = data.slice(start, end);
        const gridHtml: any[] = []
        dataUsed.forEach((obj, index) => {

            const node = obj.node;
            const nodeId = node.id
            const rating = (node.rating) ? parseFloat(node.rating).toFixed(1) : "n/a"
            let price = node?.pricing?.priceRange?.start?.net?.amount;
            price = (typeof price === "undefined") ? " n/a" : price;

            const offset = (index % 4 == 0) ? 0 : 1;
            gridHtml.push(
                <Col key={index + "Col"} id={index + "colId"} md={{ span: 2, offset: offset }}
                    className="productItem widthQuarter" >
                    <div >
                        <h2 className="title">{node.name}</h2><br />
                        <p>Category: {node.category.name}</p>
                        <p>Price: £{price}</p>
                        <p>Rating: {rating} </p>
                        <Button key={nodeId + "Key"} id={nodeId} onClick={(evt: any) => this.openModal(evt)}>See More</Button>
                    </div>
                </Col>
            )

        })

        return gridHtml;
    }

    render() {
        const dataLength = this.props.graphData.length;
        const currentPg: number = this.props.currentPage;

        return (


            <div id="productGrid">
                <p>Graph length is {dataLength}. Current Page is {currentPg}</p>

                {this.displayModal()}

                <Container fluid="true" id="productGrid" >
                    <Row>
                        {this.buildGrid()}
                    </Row>
                </Container>



                <PageMenu dataLength={this.props.graphData.length} pageSize={this.state.itemsDisplayed}
                    currentPage={this.props.currentPage} changePage={this.changePage}></PageMenu>
            </div >
        )
    }
}


export default ProductList;