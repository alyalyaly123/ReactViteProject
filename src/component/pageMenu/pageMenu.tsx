import React from "react";
import { Pagination } from "react-bootstrap";
import './pageMenu.css'

class PageMenu extends React.Component<{ dataLength: number, pageSize: number, currentPage: number, changePage: (n:number)=>void; }> {
    constructor(props:any) {
        super(props);
        this.changePage = this.changePage.bind(this);
    }

    // Number of pages in the paginator
    menuSize() {
        return Math.ceil(this.props.dataLength / this.props.pageSize);
    }


    // // Build page selector
    changePage(activePage: number) {
        if (activePage >= 1 && activePage <= this.menuSize()) {
            this.props.changePage(activePage)
        }
    }
    // Create page numbers.
    buildPagination() {
        const pages = [];
        for (let pageIndex = 1; pageIndex <= this.menuSize(); pageIndex++) {
            pages.push((
                <Pagination.Item key={pageIndex + "page"}
                    active={this.props.currentPage == pageIndex}
                    value={pageIndex}
                    onClick={() => this.changePage(pageIndex)}>
                    {pageIndex}</Pagination.Item>))

        }
        return pages;
    }


    render() {

        const currentPg: number = this.props.currentPage;
        // If multiple items, make the pagination, otherwise just leave 1 page.
        const isPlural = this.props.dataLength > this.props.pageSize;
        return (

            <div id="pageinatorDiv">
                {isPlural ?
                    <Pagination>
                        <Pagination.First onClick={() => this.changePage(1)} />
                        <Pagination.Prev onClick={() => this.changePage((currentPg) - 1)} />
                        {this.buildPagination()}
                        <Pagination.Next onClick={() => this.changePage((currentPg) + 1)} />
                        <Pagination.Last onClick={() => this.changePage(this.menuSize())} />
                    </Pagination>

                    :

                    <Pagination><Pagination.Item>{1}</Pagination.Item></Pagination>

                }
            </div>
            
        )
    }
}


export default PageMenu;