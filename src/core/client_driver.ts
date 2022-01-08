
interface ClientDriver<Config> {

    connection(datasource: Config): Promise<string>;

    end(): Promise<string>;

    query(sql: string): Promise<any>;
}
