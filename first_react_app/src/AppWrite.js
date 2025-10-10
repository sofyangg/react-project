import {Client,TablesDB,Query,ID} from 'appwrite';

const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;
const PROJECT_DATABASE_ID=import.meta.env.VITE_APPWRITE_PROJECT_DATABASE_ID;
const PROJECT_TABLE_DB=import.meta.env.VITE_APPWRITE_PROJECT_TABLE_DB;
const APPWRITE_ENDPOINT=import.meta.env.VITE_APPWRITE_ENDPOINT;



const client= new Client()
.setEndpoint(APPWRITE_ENDPOINT)
.setProject(PROJECT_ID)

const Database=new TablesDB(client);

//UpdateSearchCount function:
export const UpdateSearchCount=async(searchTerm,movie)=>{
    try{ 
        //getting rows associated with that search term:
        const result= await Database.listRows({
        databaseId: PROJECT_DATABASE_ID,
        tableId: PROJECT_TABLE_DB,
        queries: [Query.equal('SearchTerm',searchTerm.toUpperCase() )] 
        });
        
        //checking rows count
        if (result.total!=0){
            
            //incrementing count by 1:
            const incremented= await Database.incrementRowColumn({databaseId: PROJECT_DATABASE_ID,
            tableId: PROJECT_TABLE_DB,
            rowId: result.rows[0].$id,
            column: 'count',
            value: 1,
        });
        }else{
            
            //creating new row in appwrite DB TABLE if search term is new:
            const rowCreated=await Database.createRow({
            databaseId: PROJECT_DATABASE_ID,
            tableId: PROJECT_TABLE_DB,
            rowId: ID.unique(),
            data: {
            "SearchTerm": searchTerm.toUpperCase(),
            "count": 1,
            "posterURL":`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        });
        }
        }
    catch(error){
    console.log(error);
    }
}

//selectTrendingMovies function:
export const selectTrendingMovies= async()=>{
    try{
    const result = await Database.listRows({
    databaseId: PROJECT_DATABASE_ID,
    tableId: PROJECT_TABLE_DB,
    queries: [
    Query.select(["posterURL"]),
    Query.limit(25),
    Query.orderDesc("count")
    ] 
    });
    
    return result.rows;
    
    }catch(error){
    console.log(error);
    }
}

