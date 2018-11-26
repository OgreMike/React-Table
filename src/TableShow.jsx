import React from 'react';

const BIG_DATA_LINK = "http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D";
const SMALL_DATA_LINK = "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D";
const ROWS_PER_PAGE = 50;

export class TableShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            isBigData: false,
            page: 0,
            sortBy: {
                field: null,
                direction: '+'
            },
            moreInfoItemIndex: null,
            filter: ''
        };
        this.loadData = this.loadData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    componentDidMount() {
        this.loadData(SMALL_DATA_LINK);
    }

    loadData(link) {
        fetch(link)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result,
                        error: null
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    sortBy(field) {

        const isSameField = this.state.sortBy.field === field;
        const currentDirection = this.state.sortBy.direction;
        let direction = '+';
        if (isSameField && currentDirection === '+') {
            direction = '-';
        }
        let sortBy = {
            field: field,
            direction
        };
        let arrayCopy = [...this.state.items];

        arrayCopy.sort((a, b) => {
            if (a[field] < b[field]) return sortBy.direction === '+' ? -1 : 1;
            if (a[field] > b[field]) return sortBy.direction === '+' ? 1 : -1;
            return 0;
        });
        this.setState({items: arrayCopy, sortBy});
    }


    handleChange(isBigData) {
        this.setState({
            isBigData: isBigData
        });
        this.loadData(isBigData ? BIG_DATA_LINK : SMALL_DATA_LINK);
    }

    handleRowClick(index) {
        this.setState({moreInfoItemIndex: index})
    }

    onFilterChange(event) {
        this.setState({filter: event.target.value.toLowerCase()})
    }

    render() {
        const {error, isLoaded, page, moreInfoItemIndex, filter} = this.state;
        let items = this.state.items;
        const moreInfoItem = moreInfoItemIndex && items[moreInfoItemIndex];
        const hasPrevPage = page > 0;
        const hasNextPage = items.length > (page + 1) * ROWS_PER_PAGE;

        if (filter) {
            items = items.filter(item => {
                return `${item.id}`.indexOf(filter) !== -1 ||
                    item.firstName.toLowerCase().indexOf(filter) !== -1 ||
                    item.lastName.toLowerCase().indexOf(filter) !== -1 ||
                    item.email.toLowerCase().indexOf(filter) !== -1 ||
                    item.phone.toLowerCase().indexOf(filter) !== -1;
            })
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <input type="text" value={this.state.filter} onChange={this.onFilterChange}/>
                    <table class="table table-bordered table-dark">
                        <thead>
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                            <label class="btn btn-secondary active">
                                <input type="checkbox" name="dataType"
                                       onChange={event => this.handleChange(event.target.checked)}/> Change Data
                            </label>
                        </div>
                        
                        <tr>
                            <th
                                scope="col"
                                onClick={() => this.sortBy('id')}
                            >
                                id&nbsp;
                                <span className={
                                    this.state.sortBy.field === 'id' && this.state.sortBy.direction === '-' ?
                                        'fas fa-angle-down' :
                                        'fas fa-angle-up'}
                                />
                            </th>
                            <th
                                scope="col"
                                onClick={() => this.sortBy('firstName')}
                            >
                                First Name&nbsp;
                                <span className={
                                    this.state.sortBy.field === 'firstName' && this.state.sortBy.direction === '-' ?
                                        'fas fa-angle-down' :
                                        'fas fa-angle-up'}
                                />
                            </th>
                            <th
                                scope="col"
                                onClick={() => this.sortBy('lastName')}
                            >
                                Last Name&nbsp;
                                <span className={
                                    this.state.sortBy.field === 'lastName' && this.state.sortBy.direction === '-' ?
                                        'fas fa-angle-down' :
                                        'fas fa-angle-up'}
                                />
                            </th>
                            <th
                                scope="col"
                                onClick={() => this.sortBy('email')}
                            >
                                email&nbsp;
                                <span className={
                                    this.state.sortBy.field === 'email' && this.state.sortBy.direction === '-' ?
                                        'fas fa-angle-down' :
                                        'fas fa-angle-up'}
                                />
                            </th>
                            <th
                                scope="col"
                                onClick={() => this.sortBy('phone')}
                            >
                                phone&nbsp;
                                <span className={
                                    this.state.sortBy.field === 'phone' && this.state.sortBy.direction === '-' ?
                                        'fas fa-angle-down' :
                                        'fas fa-angle-up'}
                                />
                            </th>
                        </tr>

                        </thead>
                        <tbody>

                        {items.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE).map((item, index) => (
                            <tr onClick={() => this.handleRowClick(index)}>
                                <td scope="row">{item.id} </td>
                                <td scope="row">{item.firstName} </td>
                                <td scope="row">{item.lastName} </td>
                                <td scope="row">{item.email} </td>
                                <td scope="row">{item.phone} </td>
                            </tr>
                        ))}

                        </tbody>
                        <tfoot>
                        <tr>
                            <td>
                                {hasPrevPage && (
                                    <button className="btn btn-primary" onClick={() => this.setState({page: page - 1})}>
                                        PREV
                                    </button>
                                )}&nbsp;
                            </td>
                            &nbsp;{page + 1}
                            <td>
                                {hasNextPage && (
                                    <button className="btn btn-primary" onClick={() => this.setState({page: page + 1})}>
                                        NEXT
                                    </button>
                                )}&nbsp;
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                    
                    {moreInfoItem && (
                        <div>
                            Выбран пользователь <b>{moreInfoItem.firstName} {moreInfoItem.lastName}</b>
                            <tr>
                            Описание:
                            <tr>
                            <textarea>
                            {moreInfoItem.description}
                            </textarea>
                            </tr>
                            </tr>
                            Адрес проживания: <b>{moreInfoItem.address.streetAddress}</b>
                            <tr>
                            Город: <b>{moreInfoItem.address.city}</b>
                            </tr>
                            <tr>
                            Провинция/штат: <b>{moreInfoItem.address.state}</b>
                            </tr>
                            Индекс: <b>{moreInfoItem.address.zip}</b>
                        </div>
                    )}
                </div>
            );
        }
    }
}