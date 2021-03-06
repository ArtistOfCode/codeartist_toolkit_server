class Parser {
    public static ini(props: string, split: string): any {
        if (!props) return;
        let res = {}
        const rows = props.split('\r\n');
        rows.forEach(row => {
            const ele = row.split(split)
            if (ele.length < 2) {
                return;
            }
            res[ele[0]] = ele[1]
        });
        return res;
    }
}

export default Parser;