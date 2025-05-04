#[allow(warnings)]
mod bindings;
use bindings::{export, Guest, TriggerAction};
mod trigger;
use serde::{Deserialize, Serialize};
use trigger::{decode_trigger_event, encode_trigger_output};
use wstd::runtime::block_on;
use reqwest;

struct Component;
export!(Component with_types_in bindings);

// Default value if environment variable is not set
const DEFAULT_ORACLE_RESULT: bool = true;

impl Guest for Component {
    fn run(action: TriggerAction) -> std::result::Result<Option<Vec<u8>>, String> {
        let (trigger_info, data) = decode_trigger_event(action.data)?;

        // Get the boolean result from environment or use default
        let result = get_boolean_result();
        
        println!("P2P Boolean Oracle: Resolving order {} with result: {}", trigger_info.triggerId, result);

        Ok(Some(encode_trigger_output(
            trigger_info.triggerId,
            data.orderId,
            result,
        )))
    }
}

fn get_boolean_result() -> bool {
    // Make an API request to CoinMarketCap to get Bitcoin price
    let client = reqwest::blocking::Client::new();
    
    // Using a demo API endpoint - in production this would be configured properly
    let api_url = "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?id=1&range=1h";
    
    match client.get(api_url).send() {
        Ok(response) => {
            if let Ok(root) = response.json::<Root>() {
                // Return true if Bitcoin price is above $50,000, false otherwise
                let btc_price = root.data.statistics.price;
                println!("Current BTC price: ${}", btc_price);
                btc_price > 50000.0
            } else {
                println!("Failed to parse API response");
                false
            }
        }
        Err(err) => {
            println!("API request failed: {}", err);
            false
        }
    }
}

/// -----
/// https://transform.tools/json-to-rust-serde
/// Generated from https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?id=1&range=1h
/// -----
///
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Root {
    pub data: Data,
    pub status: Status,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Data {
    pub id: f64,
    pub name: String,
    pub symbol: String,
    pub statistics: Statistics,
    pub description: String,
    pub category: String,
    pub slug: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Statistics {
    pub price: f64,
    #[serde(rename = "totalSupply")]
    pub total_supply: f64,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CoinBitesVideo {
    pub id: String,
    pub category: String,
    #[serde(rename = "videoUrl")]
    pub video_url: String,
    pub title: String,
    pub description: String,
    #[serde(rename = "previewImage")]
    pub preview_image: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Status {
    pub timestamp: String,
    pub error_code: String,
    pub error_message: String,
    pub elapsed: String,
    pub credit_count: f64,
}
