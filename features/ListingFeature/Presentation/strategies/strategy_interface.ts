import type Params from "~/base/core/Params/params";
import type {DataState} from "~/base/core/networkStructure/Resources/dataState/data_state";

export interface SearchFilterStrategy {
    execute(params: Params): Promise<DataState<any>>;
}


