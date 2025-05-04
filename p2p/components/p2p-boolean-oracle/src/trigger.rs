use crate::bindings::wavs::worker::layer_types::{TriggerData, TriggerDataEthContractEvent};
use alloy_primitives::{Address, U256};
use alloy_sol_types::SolValue;
use anyhow::Result;
use wavs_wasi_chain::decode_event_log_data;

pub fn decode_trigger_event(
    trigger_data: TriggerData,
) -> Result<(solidity::TriggerInfo, solidity::TriggerInputData), String> {
    match trigger_data {
        TriggerData::EthContractEvent(TriggerDataEthContractEvent { log, .. }) => {
            let event: solidity::NewTrigger =
                decode_event_log_data!(log).map_err(|e| e.to_string())?;

            let trigger_info =
                solidity::TriggerInfo::abi_decode(&event._0, false).map_err(|e| e.to_string())?;

            let data = solidity::TriggerInputData::abi_decode(&trigger_info.data, false)
                .map_err(|e| format!("Failed to decode trigger data: {}", e))?;

            Ok((trigger_info, data))
        }
        _ => Err("Unsupported trigger data type".to_string()),
    }
}

pub fn encode_trigger_output(
    trigger_id: u64,
    order_id: U256,
    result: bool,
) -> Vec<u8> {
    solidity::DataWithId {
        triggerId: trigger_id,
        data: solidity::AvsOutputData {
            orderId: order_id,
            result,
        }
        .abi_encode()
        .to_vec()
        .into(),
    }
    .abi_encode()
}

mod solidity {
    use alloy_sol_macro::sol;
    pub use ITypes::*;

    sol! {
        #[derive(Debug)]
        struct TriggerInputData {
            uint256 orderId;
        }
    }

    sol! {
        #[derive(Debug)]
        struct AvsOutputData {
            uint256 orderId;
            bool result;
        }
    }

    // imports DataWithId, TriggerInfo, NewTrigger, and TriggerId
    sol!("../../src/interfaces/ITypes.sol");
}
