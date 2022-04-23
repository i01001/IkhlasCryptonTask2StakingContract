//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.11;

import "hardhat/console.sol";


contract IkhlasToken {
    string _symbol;
    string _name;
    uint8 _decimals;
    uint _totalSupply;
    address owner_;
    address public stakingContract;

 
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
 
    constructor() {
        owner_ = msg.sender;
        _symbol = "IKH1";
        _name = "Ikhlas NEW coin";
        _decimals = 18;
        _totalSupply = 1000000*10**18;
        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    modifier owner{
        require((msg.sender == owner_) || (msg.sender == stakingContract), "This transaction can only be carried out by owner!");
        _;
    }

    function setStakingContract(address _stakingContract) public owner{
        stakingContract = _stakingContract;
    }

    function name() public view returns (string memory){
        return _name;
    }

    function symbol() public view returns (string memory){
        return _symbol;
    }

    function decimals() public view returns (uint8){
        return _decimals;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Log(string _function, address _sender, uint _value, bytes _data);
    event log(string random);


    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
 
    function balanceOf(address _owner) public view returns (uint256 balance){
        return balances[_owner];
    }
 
    function approve(address _spender, uint256 _value) public returns (bool success){
        require(balances[msg.sender] >= _value, "msg.sender does not have sufficient tokens");
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
 
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balances[msg.sender] >= _value, "msg.sender does not have sufficient tokens");
        balances[msg.sender] = balances[msg.sender] - _value;
        balances[_to] = balances[_to] + _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
 
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balances[_from] >= _value, "msg.sender does not have sufficient tokens");
        if((msg.sender != owner_) && (msg.sender != stakingContract)){
        require(allowed[_from][msg.sender] >= _value, "value exceeding the allowance limit");
        allowed[_from][msg.sender] = (allowed[_from][msg.sender] - _value);
        }
        balances[_from] = balances[_from] - _value;
        balances[_to] = (balances[_to] + _value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining){
        return allowed[_owner][_spender];
    }

    function mint(address _to, uint256 _value) public owner returns(bool success){
        balances[_to] = (balances[_to] + _value);
        _totalSupply = (_totalSupply + _value);
        emit Transfer(address(0), _to, _value);
        return true;
    }

    function burn(address _to, uint256 _value) public owner returns(bool success){
        require(balances[_to] >= _value, "value to be burned exceeds the balance");
        balances[_to] = (balances[_to] - _value);
        _totalSupply = (_totalSupply - _value);
        emit Transfer(_to, address(0), _value);
        return true;
    }

    fallback() external payable
    {
        emit Log("fallback message failed", msg.sender, msg.value, msg.data);
    }

    receive() external payable
    {
        emit log("receive message failed");
    }
}
